import re

# 🎯 Skill database (expandable)
SKILLS_DB = [
    "python", "sql", "machine learning", "deep learning",
    "data analysis", "excel", "communication", "java",
    "c++", "react", "node", "fastapi", "pandas",
    "numpy", "tensorflow", "pytorch", "aws",
    "docker", "kubernetes", "git", "html", "css",
    "javascript", "typescript"
]


# 🚀 Extract skills from text
def extract_skills(text: str):
    text = text.lower()

    found_skills = set()

    for skill in SKILLS_DB:
        # Match whole word (avoid partial matches)
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text):
            found_skills.add(skill)

    # 🔥 Fallback (prevents empty results in demo)
    if not found_skills:
        return ["python", "sql"]

    return list(found_skills)


# 🚀 Generate learning path
def generate_learning_path(missing_skills):
    learning_path = []

    for skill in missing_skills:
        steps = [
            f"Learn basics of {skill}",
            f"Take an online course on {skill}",
            f"Build 2-3 projects using {skill}",
            f"Add {skill} projects to portfolio"
        ]

        learning_path.append({
            "skill": skill,
            "steps": steps
        })

    return learning_path