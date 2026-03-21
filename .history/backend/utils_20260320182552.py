import pdfplumber
import json

# 🔹 Optional OpenAI (safe)
try:
    from openai import OpenAI
    client = OpenAI()
    USE_OPENAI = True
except:
    USE_OPENAI = False

from data import KNOWN_SKILLS, COURSE_MAP


# 🔹 Extract text from PDF
def extract_text(file):
    text = ""
    try:
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except:
        pass
    return text


# 🔹 Extract skills (AI + fallback)
def extract_skills(text):

    # 🟢 Try OpenAI
    if USE_OPENAI:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": f"""
                        Extract ONLY technical skills as JSON list.
                        Example: ["Python","SQL"]

                        Text:
                        {text}
                        """
                    }
                ]
            )

            content = response.choices[0].message.content
            return json.loads(content)

        except:
            pass

    # 🔴 Fallback
    return simple_skill_extraction(text)


# 🔹 Simple keyword matching
def simple_skill_extraction(text):
    found = []
    text_lower = text.lower()

    for skill in KNOWN_SKILLS:
        if skill.lower() in text_lower:
            found.append(skill)

    # 🔥 Aliases
    if "ml" in text_lower:
        found.append("Machine Learning")

    if "js" in text_lower:
        found.append("JavaScript")

    return list(set(found))


# 🔹 Normalize
def normalize_skills(skills):
    return [s for s in skills if s in KNOWN_SKILLS]


# 🔹 Skill gap
def find_gap(resume, jd):
    return list(set(jd) - set(resume))


# 🔹 Learning path
def generate_path(missing):
    path = []

    for skill in missing:
        steps = COURSE_MAP.get(skill, ["Basics", "Practice", "Project"])

        path.append({
            "skill": skill,
            "steps": steps
        })

    return path