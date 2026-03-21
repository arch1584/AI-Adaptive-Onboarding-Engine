from fastapi import FastAPI, UploadFile, File
from utils import *
from db import engine, SessionLocal
from models import Base, Result

# 🔹 Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}


@app.post("/analyze")
async def analyze(resume: UploadFile = File(...), jd: UploadFile = File(...)):
    db = SessionLocal()

    # 🔹 Extract text
    

    print("RESUME TEXT:", resume_text[:300])
    print("JD TEXT:", jd_text[:300])

    # 🔹 Extract skills
    resume_skills = normalize_skills(extract_skills(resume_text))
    jd_skills = normalize_skills(extract_skills(jd_text))

    # 🔹 Gap analysis
    missing = find_gap(resume_skills, jd_skills)

    # 🔹 Learning path
    path = generate_path(missing)

    # 🔹 Save to DB
    result = Result(
        resume_skills=resume_skills,
        jd_skills=jd_skills,
        missing_skills=missing,
        learning_path=path
    )

    db.add(result)
    db.commit()

    return {
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "missing_skills": missing,
        "learning_path": path
    }