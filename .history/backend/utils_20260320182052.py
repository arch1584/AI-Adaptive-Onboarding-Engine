import pdfplumber
import json

# ✅ Optional OpenAI (safe import)
try:
    from openai import OpenAI
    client = OpenAI()
    USE_OPENAI = True
except:
    USE_OPENAI = False

from data import KNOWN_SKILLS, COURSE_MAP


# 🔹 Extract text from PDF
def extract_text(file):
    try:
        with pdfplumber.open(file.file) as pdf:
            return "".join([page.extract_text() or "" for page in pdf.pages])
    except:
        return ""


# 🔹 Extract skills (SAFE VERSION)
def extract_skills(text):

    # 🟢 If OpenAI available → use it
    if USE_OPENAI:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": f"""
                        Extract ONLY technical skills as a JSON list.
                        Example: ["Python", "SQL"]

                        Text:
                        {text}
                        """
                    }
                ]
            )

            content = response.choices[0].message.content

            return json.loads(content)

        except:
            pass  # fallback below

    # 🔴 Fallback (IMPORTANT for hackathon stability)
    return simple_skill_extraction(text)


# 🔹 Simple fallback (no AI needed)
def simple_skill_extraction(text):
    found = []
    text_lower = text.lower()

    for skill in KNOWN_SKILLS:
        if skill.lower() in text_lower:
            found.append(skill)

    return found


# 🔹 Normalize skills
def normalize_skills(skills):
    return [s for s in skills if s in KNOWN_SKILLS]


# 🔹 Find missing skills
def find_gap(resume, jd):
    return list(set(jd) - set(resume))


# 🔹 Generate learning path
def generate_path(missing):
    path = []

    for skill in missing:
        steps = COURSE_MAP.get(skill, ["Basics", "Practice", "Project"])

        path.append({
            "skill": skill,
            "steps": steps
        })

    return path