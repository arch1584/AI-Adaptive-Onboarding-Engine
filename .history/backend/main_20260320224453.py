from fastapi import FastAPI, UploadFile, File
from utils import *
from db import engine, SessionLocal
from models import Base, Result
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}


@app.post("/analyze")
async def analyze(resume: UploadFile = File(...), jd: UploadFile = File(...)):
    db = SessionLocal()

    resume_text = extract_text(resume)
    jd_text = extract_text(jd)

    # 🔥 Extract skills
    resume_skills = normalize_skills(extract_skills(resume_text))
    jd_skills = normalize_skills(extract_skills(jd_text))

    # 🔹 Gap
    missing = find_gap(resume_skills, jd_skills)

    # 🔹 Learning path
    path = generate_path(missing)

    # 🔹 Save
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