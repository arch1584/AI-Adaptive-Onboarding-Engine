from google import genai
import json, os, re
import networkx as nx
from dotenv import load_dotenv
import os

load_dotenv()

from data import edges



def llm_extract_skills(text: str, category: str):

    resume_prompt = f"""
    You are a precise HR skill extractor. Extract all professional skills from given resume text.

    Return ONLY a JSON object in this exact format, nothing else:
    {{
    "skills": [
        {{"name": "canonical skill name", "category": "tool|competency|domain", "level": "beginner|intermediate|advanced"}}
    ]
    }}

    Rules:
    - Use full canonical names: "Machine Learning" not "ML", "Microsoft Excel" not "excel"
    - category "tool" = software, platforms, programming languages (SharePoint, Python, ADP)
    - category "competency" = demonstrated abilities (Project Management, Recruitment, Process Improvement)
    - category "domain" = knowledge areas (Labor Law, Marketing, Human Resources)
    - Infer level from years of experience and context clues in the text
    - Extract EVERY skill mentioned, do not filter or limit
    - Never invent skills not present in the text

    Resume text:
    {text[:4000]}
    """

    jd_prompt = f"""
    You are a precise HR skill extractor. Extract all required skills from given job description text.

    Return ONLY a JSON object in this exact format, nothing else:
    {{
    "skills": [
        {{"name": "canonical skill name", "category": "tool|competency|domain", "level": "beginner|intermediate|advanced"}}
    ]
    }}

    Rules:
    - Use full canonical names: "Machine Learning" not "ML", "Microsoft Excel" not "excel"
    - category "tool" = software, platforms, programming languages
    - category "competency" = abilities and behaviours required
    - category "domain" = knowledge areas required
    - level: the proficiency level the role demands for this skill — 
        "beginner" if introductory exposure is enough, 
        "intermediate" if the role requires working knowledge, 
        "advanced" if the role requires expert-level mastery
    - Extract EVERY skill mentioned, do not filter or limit
    - Never invent skills not present in the text

    Job description text:
    {text[:4000]}
    """

    if category =="jd":
        prompt = jd_prompt
    else:
        prompt = resume_prompt

    
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")

    client = genai.Client(api_key=api_key)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        if hasattr(response, "text") and response.text:
            return response.text
        if hasattr(response, "candidates") and response.candidates:
            return response.candidates[0].content.parts[0].text
        raise ValueError("Unexpected Gemini response structure.")
    except Exception as e:
        raise RuntimeError(f"Gemini API error: {e}")





def parse_skills_response(raw_text: str) -> list[dict]:
    # strip markdown fences if present
    cleaned = re.sub(r'```json|```', '', raw_text).strip()
    
    data = json.loads(cleaned)
    
    if "skills" not in data or not isinstance(data["skills"], list):
        raise ValueError("Invalid skill response structure from Gemini")
    
    return data["skills"]


LEVEL_RANK = {"beginner": 1, "intermediate": 2, "advanced": 3}

def compare_skills(resume_skills: list[dict], jd_skills: list[dict]) -> list[dict]:
    gaps = []
    resume_lookup = {s["name"].lower(): s for s in resume_skills}
    
    for jd_skill in jd_skills:
        name_key = jd_skill["name"].lower()
        match = resume_lookup.get(name_key)
        
        if not match:
            classification = "learn_from_scratch"
        elif LEVEL_RANK.get(match["level"], 0) < LEVEL_RANK.get(jd_skill["level"], 0):
            classification = "needs_deepening"
        else:
            continue  # skill fully met, exclude from gaps
        
        gaps.append({
            "name":           jd_skill["name"],
            "category":       jd_skill["category"],
            "required_level": jd_skill["level"],
            "current_level":  match["level"] if match else "none",
            "classification": classification
        })
    
    return gaps








# DAG CONSTRUCTION
def build_dag(edges) -> nx.DiGraph:
    G = nx.DiGraph()

    G.add_edges_from(edges)
    return G


# Load DAG once at module level — not per request
DAG = build_dag(edges)


# HOURS AND RESOURCE TYPE BY CATEGORY 
HOURS_MAP = {
    "tool":        6,
    "competency":  8,
    "domain":      10,
}

RESOURCE_MAP = {
    "tool":        "hands-on practice",
    "competency":  "workshop or mentorship",
    "domain":      "structured course",
}

CLASSIFICATION_HOURS_MODIFIER = {
    "learn_from_scratch": 1.0,
    "needs_deepening":    0.5,   # already has base knowledge, needs less time
    "prerequisite":       0.75,
}


# LEARNING PATH GENERATOR 
def generate_learning_path(gaps: list[dict], onboarding_weeks: int = 8) -> list[dict]:
    hours_per_week = 10
    total_budget   = onboarding_weeks * hours_per_week

    # Step 1 — collect all nodes needed: gap skills + their missing prerequisites
    resume_skill_names = set()   # will be passed in future; for now inferred from gaps
    all_nodes_needed   = set()

    for gap in gaps:
        skill_name = gap["name"].lower()
        all_nodes_needed.add(gap["name"])

        # find prerequisites in DAG
        dag_key = next(
            (n for n in DAG.nodes if n.lower() == skill_name),
            None
        )
        if dag_key:
            ancestors = nx.ancestors(DAG, dag_key)
            for ancestor in ancestors:
                # only add ancestor if candidate doesn't already have it
                already_known = any(
                    g["current_level"] != "none" and g["name"].lower() == ancestor.lower()
                    for g in gaps
                )
                if not already_known:
                    all_nodes_needed.add(ancestor)

    # Step 2 — build subgraph and topological sort
    subgraph_nodes = [
        n for n in DAG.nodes
        if n in all_nodes_needed or n.lower() in {x.lower() for x in all_nodes_needed}
    ]
    subgraph = DAG.subgraph(subgraph_nodes)

    try:
        ordered = list(nx.topological_sort(subgraph))
    except nx.NetworkXUnfeasible:
        ordered = list(all_nodes_needed)   # fallback if cycle somehow exists

    # Step 3 — build gap lookup for classification
    gap_lookup = {g["name"].lower(): g for g in gaps}

    # Step 4 — assign weeks and hours, build module list
    learning_path = []
    hours_used    = 0
    current_week  = 1

    for skill_name in ordered:
        if hours_used >= total_budget:
            break

        skill_lower = skill_name.lower()
        gap_info    = gap_lookup.get(skill_lower)

        # determine classification
        if gap_info:
            classification = gap_info["classification"]
            category       = gap_info.get("category", "domain")
            required_level = gap_info.get("required_level", "intermediate")
            current_level  = gap_info.get("current_level", "none")
        else:
            classification = "prerequisite"
            category       = "domain"
            required_level = "intermediate"
            current_level  = "none"

        # calculate hours
        base_hours  = HOURS_MAP.get(category, 8)
        modifier    = CLASSIFICATION_HOURS_MODIFIER.get(classification, 1.0)
        hours_est   = round(base_hours * modifier)

        # assign week
        if hours_used + hours_est > current_week * hours_per_week:
            current_week += 1

        # justification
        if classification == "learn_from_scratch":
            justification = f"{skill_name} is required by the job description but not found in your resume."
        elif classification == "needs_deepening":
            justification = f"You have {current_level}-level {skill_name} but the role requires {required_level}."
        else:
            justification = f"{skill_name} is a prerequisite needed before advancing to a required skill."

        learning_path.append({
            "skill":          skill_name,
            "week":           current_week,
            "hours_est":      hours_est,
            "category":       category,
            "resource_type":  RESOURCE_MAP.get(category, "course"),
            "classification": classification,
            "required_level": required_level,
            "current_level":  current_level,
            "justification":  justification,
            "prerequisites":  [
                str(p) for p in DAG.predecessors(
                    next((n for n in DAG.nodes if n.lower() == skill_lower), skill_name)
                )
            ] if skill_name in DAG.nodes else []
        })

        hours_used += hours_est

    return learning_path