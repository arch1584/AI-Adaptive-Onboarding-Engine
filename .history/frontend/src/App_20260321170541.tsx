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

      const response = await fetch("http://127.0.0.1:8001/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 AI Onboarding Engine</h1>

        {/* Upload Section */}
        <div style={styles.uploadBox}>
          <p>Upload Resume</p>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setResumeFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        <div style={styles.uploadBox}>
          <p>Upload Job Description</p>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setJdFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {/* Loader */}
        {loading && <div style={styles.loader}></div>}

        {/* Results */}
        {result && (
          <div style={styles.results}>
            <h2>📊 Results</h2>

            <Section title="Resume Skills" data={result.resume_skills} />
            <Section title="JD Skills" data={result.jd_skills} />
            <Section title="Missing Skills" data={result.missing_skills} />

            <h3>📚 Learning Path</h3>
            {result.learning_path.map((item: any, idx: number) => (
              <div key={idx} style={styles.learningCard}>
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
    </div>
  );
}

// 🔹 Reusable Section
function Section({ title, data }: any) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{data && data.length ? data.join(", ") : "None"}</p>
    </div>
  );
}

// 🎨 STYLES
const styles: any = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "500px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  uploadBox: {
    marginBottom: "15px",
    padding: "10px",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  loader: {
    margin: "20px auto",
    width: "40px",
    height: "40px",
    border: "5px solid #ccc",
    borderTop: "5px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  results: {
    marginTop: "20px",
  },
  learningCard: {
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
};

export default App;