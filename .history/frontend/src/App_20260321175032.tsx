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

  const generateInsight = (score: number) => {
    if (score > 80) return "Strong alignment with job requirements.";
    if (score > 50) return "Moderate alignment. Some skills need improvement.";
    return "Significant skill gaps detected. Focus on core areas.";
  };

  const generateRecommendations = (missing: string[]) => {
    return missing.slice(0, 3).map(
      (skill) => `Prioritize learning ${skill} to improve job readiness.`
    );
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

  const insight = generateInsight(score);
  const recommendations = result
    ? generateRecommendations(result.missing_skills)
    : [];

  return (
    <div className="container">
      <div className="card">

        {/* Header */}
        <div className="header">
          <h1>AI Adaptive Onboarding Engine</h1>
          <p>Skill intelligence for faster onboarding</p>
        </div>

        

        {/* Upload */}
        <div className="uploadGrid">
          <div className="uploadBox">
            <p>Resume</p>
            <input
              type="file"
              onChange={(e) =>
                setResumeFile(e.target.files?.[0] || null)
              }
            />
          </div>

          <div className="uploadBox">
            <p>Job Description</p>
            <input
              type="file"
              onChange={(e) =>
                setJdFile(e.target.files?.[0] || null)
              }
            />
          </div>
        </div>

        <button className="button" onClick={handleSubmit}>
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>

        {loading && <div className="loader"></div>}

        {result && (
          <div className="results">

            {/* Score */}
            <div className="scoreBox">
              <h2>{score}% Match</h2>
              <div className="progressContainer">
                <div
                  className="progressBar"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* AI Insight */}
            <div className="insightBox">
              <h3>AI Insight</h3>
              <p>{insight}</p>
            </div>

            {/* Skills */}
            <div className="grid">
              <Section title="Resume Skills" data={result.resume_skills} />
              <Section title="JD Skills" data={result.jd_skills} />
              <Section title="Missing Skills" data={result.missing_skills} />
            </div>

            {/* Recommendations */}
            <div className="recommendationBox">
              <h3>Recommendations</h3>
              <ul>
                {recommendations.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Learning Path */}
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
      <h4>{title}</h4>
      <p>{data.length ? data.join(", ") : "None"}</p>
    </div>
  );
}

export default App;