import { useState } from "react";
import "./styles.css";

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateScore = (resume: any[], jd: any[]) => {
    if (!jd.length) return 0;
    const match = resume.filter((s) => jd.includes(s));
    return Math.round((match.length / jd.length) * 100);
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jdFile) {
      alert("Please upload both files");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd", jdFile);

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8001/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  const score = result
    ? calculateScore(result.resume_skills, result.jd_skills)
    : 0;

  return (
    <div className="container">
      <div className="card">

        <h1 className="title">AI Adaptive Onboarding Engine</h1>
        <p className="subtitle">
          Intelligent skill gap analysis and personalized onboarding
        </p>

        <div className="about">
          This platform analyzes a candidate’s resume against job requirements
          to identify missing skills and generate a structured learning path.
          It helps organizations onboard talent faster and more efficiently.
        </div>

        <div className="uploadGrid">
          <div className="uploadBox">
            <p>Upload Resume</p>
            <input
              type="file"
              onChange={(e) =>
                setResumeFile(e.target.files?.[0] || null)
              }
            />
          </div>

          <div className="uploadBox">
            <p>Upload Job Description</p>
            <input
              type="file"
              onChange={(e) =>
                setJdFile(e.target.files?.[0] || null)
              }
            />
          </div>
        </div>

        <button className="button" onClick={handleSubmit}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {loading && <div className="loader"></div>}

        {result && (
          <div className="results">

            <div className="scoreBox">
              <div className="scoreNumber">{score}% Match</div>
              <div className="progressContainer">
                <div
                  className="progressBar"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            <Section title="Resume Skills" data={result.resume_skills} />
            <Section title="Job Description Skills" data={result.jd_skills} />
            <Section title="Missing Skills" data={result.missing_skills} />

            <h3>Learning Path</h3>
            {result.learning_path.map((item: any, i: number) => (
              <div key={i} className="learningCard">
                <strong>{item.skill}</strong>
                <ul>
                  {item.steps.map((step: string, j: number) => (
                    <li key={j}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function Section({ title, data }: any) {
  return (
    <div className="section">
      <h3>{title}</h3>
      <p>{data.length ? data.join(", ") : "None"}</p>
    </div>
  );
}

export default App;