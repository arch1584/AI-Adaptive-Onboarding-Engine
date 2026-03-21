from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2

from utils import extract_skills, generate_learning_path

app = FastAPI()

# ✅ CORS (VERY IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📄 Function to extract text from PDF
def extract_text_from_pdf(file: UploadFile):
    reader = PyPDF2.PdfReader(file.file)
    text = ""

    for page in reader.pages:
        try:
            text += page.extract_text() or ""
        except:
            pass

    return text.lower()


# 🚀 MAIN API
@app.post("/analyze")
async def analyze(resume: UploadFile = File(...), jd: UploadFile = File(...)):

    # Extract text
    resume_text = extract_text_from_pdf(resume)
    jd_text = extract_text_from_pdf(jd)

    # Extract skills
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    # Find missing skills
    missing_skills = list(set(jd_skills) - set(resume_skills))

    # Generate learning path
    learning_path = generate_learning_path(missing_skills)

    return {
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "missing_skills": missing_skills,
        "learning_path": learning_path,
    }