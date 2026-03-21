# AI Adaptive Onboarding Engine

An intelligent onboarding system that parses a new hire's resume and a target job description, identifies skill gaps, and generates a personalized, week-by-week learning roadmap using a prerequisite-aware skill graph.

---

## Overview

Corporate onboarding often relies on static, one-size-fits-all training programs. Experienced hires waste time on material they already know, while beginners are overwhelmed by advanced content.

This system addresses that by:

- Extracting skills from a resume and job description using a large language model
- Comparing extracted skills at the proficiency level to classify each gap
- Traversing a 120-node prerequisite DAG built from domain knowledge and validated against O*NET occupational data to determine learning order
- Generating a week-by-week learning path fitted to the onboarding duration provided
- Producing a full reasoning trace that explains every decision in the pipeline

---

## Features

- Resume and job description upload (PDF)
- LLM-powered skill extraction with canonical name normalisation
- Proficiency-aware gap classification: learn from scratch, needs deepening
- Prerequisite DAG traversal using topological sort for ordered learning path
- BKT-inspired mastery prior estimation from resume evidence
- Onboarding duration input to fit the path within a time budget
- Reasoning trace panel showing each pipeline step and its output
- Clean, responsive dark-mode UI

---

## Tech Stack

### Backend
- Python 3.11
- FastAPI
- PyPDF2
- Google Gemini 2.0 Flash (via google-genai)
- NetworkX
- SQLAlchemy
- PostgreSQL
- python-dotenv

### Frontend
- React 18
- TypeScript
- Vite
- CSS

---

## Project Structure
```
AI-Adaptive-Onboarding-Engine/
├── backend/
│   ├── main.py              # FastAPI routes and pipeline orchestration
│   ├── utils.py             # Skill extraction, gap analysis, DAG, learning path
│   ├── data.py              # Prerequisite edges for DAG construction
│   ├── schemas.py           # Pydantic data models
│   ├── db.py                # Database connection
│   ├── models.py            # SQLAlchemy ORM models
│   └── requirements.txt     # Python dependencies
├── database/
│   └── schema.sql           # PostgreSQL schema
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main React component
│   │   ├── api.ts           # API fetch wrapper
│   │   ├── main.tsx         # React entry point
│   │   └── styles.css       # Application styles
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL (or use Docker Compose)
- A Google Gemini API key (free tier available at aistudio.google.com)

### 1. Clone the repository
```bash
git clone https://github.com/yourteam/AI-Adaptive-Onboarding-Engine.git
cd AI-Adaptive-Onboarding-Engine
```

### 2. Backend setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adaptive_onboarding_ai
```

### 3. Database setup

Create the database in PostgreSQL:
```sql
CREATE DATABASE adaptive_onboarding_ai;
```

Then run the schema:
```bash
psql -U postgres -d adaptive_onboarding_ai -f database/schema.sql
```

### 4. Run the backend
```bash
cd backend
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`

API documentation available at `http://127.0.0.1:8000/docs`

### 5. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Running with Docker

The fastest way to run the full stack:
```bash
docker-compose up --build
```

Then open `http://localhost:5173` in your browser.

Set your `GEMINI_API_KEY` in a `.env` file at the project root before running:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## How It Works

### Skill Extraction

Both the resume and job description are parsed from PDF and sent to Google Gemini 2.0 Flash with a structured prompt that returns a JSON array of skills. Each skill includes a canonical name, category (tool, competency, or domain), and proficiency level (beginner, intermediate, or advanced). Canonical naming ensures consistent comparison across documents.

### Gap Analysis

Resume skills and JD skills are compared by name after lowercasing. For each JD skill, the system checks whether the candidate has it and at what level. Gaps are classified as `learn_from_scratch` if absent entirely, or `needs_deepening` if present but below the required level.

### Prerequisite DAG and Topological Sort

A directed acyclic graph of approximately 120 skill nodes is constructed from a hand-curated prerequisite edge list informed by O*NET occupational skill level data. The edge list covers technical, HR, marketing, finance, data science, and operations domains. For each gap skill, the system queries the DAG for ancestor nodes, filters out skills the candidate already has, and runs a topological sort on the resulting subgraph. This guarantees that no skill appears in the learning path before its prerequisites.

### Timeline Generation

Modules are assigned estimated hours based on category (tool: 6h, competency: 8h, domain: 10h), with a modifier for classification (needs deepening requires half the hours of learn from scratch). Modules are bucketed into weeks against the total hour budget derived from the onboarding duration input.

### Reasoning Trace

Every step of the pipeline — parsing, extraction, gap analysis, DAG traversal, path generation — is logged with its output and returned to the frontend for display.

---

## Datasets Referenced

- O*NET 30.2 Database: onetcenter.org/database.html — used for skill level data to inform DAG prerequisite ordering
- Kaggle Resume Dataset: kaggle.com/datasets/snehaanbhawal/resume-dataset — used for domain validation across 24 job categories
- Kaggle Jobs and Job Descriptions: kaggle.com/datasets/kshitizregmi/jobs-and-job-description — used for skill cluster validation across 15 technical roles

---

## API Reference

### POST /analyze

Accepts a multipart form with the following fields:

| Field | Type | Description |
|---|---|---|
| resume | File | Resume PDF |
| jd | File | Job description PDF |
| onboarding_weeks | Integer | Onboarding duration in weeks |

Returns:
```json
{
  "resume_skills": [...],
  "jd_skills": [...],
  "gaps": [...],
  "learning_path": [...],
  "trace": [...]
}
```

---

## Team

Team ActiVeins

AI-Adaptive Onboarding Engine

Built for the ARTPARK CodeForge Hackathon.