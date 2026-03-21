import pdfplumber
import openai
import json
from data import KNOWN_SKILLS, COURSE_MAP

def extract_text(file):
    with pdfplumber.open(file.file) as pdf:
        return "".join([p.extract_text() or "" for p in pdf.pages])

def extract_skills(text):
    prompt = f"""
    Extract technical skills as a JSON list.
    Text: {text}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        return json.loads(response['choices'][0]['message']['content'])
    except:
        return []

def normalize_skills(skills):
    return [s for s in skills if s in KNOWN_SKILLS]

def find_gap(resume, jd):
    return list(set(jd) - set(resume))

def generate_path(missing):
    return [
        {"skill": s, "steps": COURSE_MAP.get(s, ["Basics", "Practice", "Project"])}
        for s in missing
    ]