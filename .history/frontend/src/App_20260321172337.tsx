import { useState } from "react";
import "./styles.css";

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🎯 Calculate Match Score
  const calculateScore = (resume: any[], jd: any[]) => {
    if (!jd.length) return 0;
    const match = resume.filter((s) => jd.includes(s));
    return Math.round((match.length / jd.length) * 100);
  };

  // 🚀 API Call
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

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
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

        {/* Header */}
        <h1 className="title">AI Adaptive Onboarding Engine</h1>
        <p className="subtitle">
          Intelligent skill gap analysis and personalized onboarding
        </p>

        {/* About Section */}
        <div className="about">
          This system evaluates a candidate’s resume against a job description
          to identify skill gaps and generate a structured learning roadmap.
          It helps organizations accelerate onboarding by aligning candidate
          capabilities with role requirements using automated intelligence.
        </div>

        {/* Upload Section */}
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

        {/* Button */}
        <button className="button" onClick={handleSubmit}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {/* Loader */}
        {loading && <div className="loader"></div>}

        {/* Results */}
        {result && (
          <div className="results">

            {/* Score */}
            <div className="scoreBox">
              <div className="scoreNumber">{score}% Match</div>
              <div className="progressContainer">
                <div
                  className="progressBar"
                  style={{ width: `${score}%` }}
                >
                  {score}%
                </div>
              </div>
            </div>

            {/* Sections */}
            <Section title="Resume Skills" data={result.resume_skills} />
            <Section title="Job Description Skills" data={result.jd_skills} />
            <Section title="Missing Skills" data={result.missing_skills} />

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

// 🔹 Reusable Section
function Section({ title, data }: any) {
  return (
    <div className="section">
      <h3>{title}</h3>
      <p>{data && data.length ? data.join(", ") : "None"}</p>
    </div>
  );
}

export default App;