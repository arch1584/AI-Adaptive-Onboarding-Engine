import pdfplumber
import json
import re

# 🔹 Optional OpenAI (safe)
try:
    from openai import OpenAI
    client = OpenAI()
    USE_OPENAI = True
except:
    USE_OPENAI = False

from data import KNOWN_SKILLS, COURSE_MAP


# 🔹 Extract text from PDF (robust)
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

    # 🟢 Try OpenAI (optional)
    if USE_OPENAI:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": f"""
                        Extract ONLY technical skills as a JSON list.
                        Example: ["Python","SQL","Machine Learning"]

                        Text:
                        {text}
                        """
                    }
                ]
            )

            content = response.choices[0].message.content
            return json.loads(content)

        except:
            pass  # fallback if AI fails

    # 🔴 Fallback (main logic)
    return simple_skill_extraction(text)


# 🔹 Smart keyword + regex matching
def simple_skill_extraction(text):
    found = set()
    text_lower = text.lower()

    # 🔹 Direct matching
    for skill in KNOWN_SKILLS:
        if skill.lower() in text_lower:
            found.add(skill)

    # 🔥 Aliases / abbreviations
    aliases = {
        "ml": "Machine Learning",
        "dl": "Deep Learning",
        "js": "JavaScript",
        "py": "Python",
        "postgres": "PostgreSQL",
        "node": "Node.js"
    }

    for key, value in aliases.items():
        if re.search(rf"\b{key}\b", text_lower):
            found.add(value)

    return list(found)


# 🔹 Normalize skills
def normalize_skills(skills):
    return list(set([s for s in skills if s in KNOWN_SKILLS]))


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