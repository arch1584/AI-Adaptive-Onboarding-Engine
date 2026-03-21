import { useState } from "react";

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeFile || !jdFile) {
      alert("Please upload both Resume and JD");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd", jdFile);

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>AI Adaptive Onboarding Engine 🚀</h1>

      {/* Resume Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Upload Resume</h3>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setResumeFile(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>

      {/* JD Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Upload Job Description</h3>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setJdFile(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>

      {/* Button */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* Result Section */}
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Results</h2>

          <p>
            <strong>Resume Skills:</strong>{" "}
            {result.resume_skills?.join(", ")}
          </p>

          <p>
            <strong>JD Skills:</strong> {result.jd_skills?.join(", ")}
          </p>

          <p>
            <strong>Missing Skills:</strong>{" "}
            {result.missing_skills?.join(", ")}
          </p>

          <h3>Learning Path</h3>
          {result.learning_path?.map((item: any, index: number) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>{item.skill}</strong>
              <ul>
                {item.steps.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
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