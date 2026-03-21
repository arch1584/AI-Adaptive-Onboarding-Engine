import pdfplumber
import json
import re

from data import KNOWN_SKILLS, COURSE_MAP


# 🔹 Extract text from PDF (robust + fallback)
def extract_text(file):
    text = ""

    try:
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
    except:
        pass

    # 🔥 fallback (very important)
    if not text.strip():
        try:
            text = file.file.read().decode("latin-1", errors="ignore")
        except:
            pass

    return text


# 🔹 Extract skills (NO AI → stable)
def extract_skills(text):
    return simple_skill_extraction(text)


# 🔹 Strong keyword matching
def simple_skill_extraction(text):
    found = set()
    text_lower = text.lower()

    # 🔹 direct matching
    for skill in KNOWN_SKILLS:
        if skill.lower() in text_lower:
            found.add(skill)

    # 🔥 smart detection
    words = re.findall(r"\b\w+\b", text_lower)

    if "python" in words:
        found.add("Python")

    if "sql" in words:
        found.add("SQL")

    if "java" in words:
        found.add("Java")

    if "javascript" in words or "js" in words:
        found.add("JavaScript")

    if "machine" in words and "learning" in words:
        found.add("Machine Learning")

    if "deep" in words and "learning" in words:
        found.add("Deep Learning")

    if "data" in words and "analysis" in words:
        found.add("Data Analysis")

    if "react" in words:
        found.add("React")

    if "docker" in words:
        found.add("Docker")

    if "aws" in words:
        found.add("AWS")

    return list(found)


# 🔹 Normalize
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