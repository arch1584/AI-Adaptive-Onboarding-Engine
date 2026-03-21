from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2

from utils import llm_extract_skills, parse_skills_response, compare_skills, generate_learning_path, DAG

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
async def analyze(resume: UploadFile = File(...), jd: UploadFile = File(...), onboarding_weeks: int = Form(8)):

    # Extract text
    resume_text = extract_text_from_pdf(resume)
    jd_text = extract_text_from_pdf(jd)

    resume_raw    = llm_extract_skills(resume_text, "resume")
    jd_raw        = llm_extract_skills(jd_text, "jd")

    resume_skills = parse_skills_response(resume_raw)
    jd_skills     = parse_skills_response(jd_raw)

    gaps          = compare_skills(resume_skills, jd_skills)
    gaps          = compare_skills(resume_skills, jd_skills)
    learning_path = generate_learning_path(gaps, onboarding_weeks=onboarding_weeks)

    trace = [
        {"step": "resume_parsing",    "output": f"Extracted {len(resume_skills)} skills from resume"},
        {"step": "jd_parsing",        "output": f"Extracted {len(jd_skills)} skills from JD"},
        {"step": "gap_analysis",      "output": f"Identified {len(gaps)} skill gaps"},
        {"step": "dag_traversal",     "output": f"Resolved prerequisites via {len(DAG.nodes)}-node skill graph"},
        {"step": "path_generation",   "output": f"Generated {len(learning_path)} modules over {onboarding_weeks} weeks"},
    ]

    return {
        "resume_skills":  resume_skills,
        "jd_skills":      jd_skills,
        "gaps":           gaps,
        "learning_path":  learning_path,
        "trace":          trace,
    }