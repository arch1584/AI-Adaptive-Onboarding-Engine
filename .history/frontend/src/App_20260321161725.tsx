import React, { useState } from "react";
import { analyzeFiles } from "./api";

function App() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume || !jd) {
      alert("Upload both files");
      return;
    }

    try {
      setLoading(true);
      const data = await analyzeFiles(resume, jd);
      setResult(data);
    } catch (err) {
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  const score =
    result && result.jd_skills.length > 0
      ? Math.round(
          (result.resume_skills.length / result.jd_skills.length) * 100
        )
      : 0;

  return (
    <div className="container">
      <h1>🚀 AI Adaptive Onboarding</h1>

      <input type="file" onChange={(e) => setResume(e.target.files?.[0] || null)} />
      <input type="file" onChange={(e) => setJd(e.target.files?.[0] || null)} />

      <button onClick={handleAnalyze}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="results">
          <h2>Results</h2>

          <h3>Resume Skills</h3>
          <p>{result.resume_skills.join(", ")}</p>

          <h3>Missing Skills</h3>
          <p>{result.missing_skills.join(", ")}</p>

          <h3>Match Score</h3>
          <h2>{score}%</h2>

          <h3>Learning Path</h3>
          {result.learning_path.map((item: any, i: number) => (
            <div key={i}>
              <b>{item.skill}</b>
              <ul>
                {item.steps.map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;