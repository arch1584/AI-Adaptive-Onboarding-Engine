import { useState } from "react";
import "./styles.css";

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [onboardingWeeks, setOnboardingWeeks] = useState<number>(8);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAllResume, setShowAllResume] = useState(false);
  const [showAllJD, setShowAllJD] = useState(false);

  const calculateScore = (resume: any[], jd: any[]) => {
    if (!jd.length) return 0;
    const resumeNames = resume.map((s) => s.name.toLowerCase());
    const jdNames     = jd.map((s) => s.name.toLowerCase());
    const match       = resumeNames.filter((s) => jdNames.includes(s));
    return Math.round((match.length / jdNames.length) * 100);
  };

  const generateInsight = (score: number) => {
    if (score > 80) return "Strong alignment with job requirements.";
    if (score > 50) return "Moderate alignment. Some skills need improvement.";
    return "Significant skill gaps detected. Focus on core areas.";
  };

  const generateRecommendations = (gaps: any[]) => {
    return gaps.slice(0, 3).map((gap) => {
      if (gap.classification === "needs_deepening")
        return `Deepen your ${gap.name} skills from ${gap.current_level} to ${gap.required_level} level.`;
      return `Learn ${gap.name} — required by the role but not found in your resume.`;
    });
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jdFile) {
      alert("Please upload both files");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd", jdFile);
    formData.append("onboarding_weeks", String(onboardingWeeks));

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/analyze", {
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

  const score           = result ? calculateScore(result.resume_skills, result.jd_skills) : 0;
  const insight         = generateInsight(score);
  const recommendations = result ? generateRecommendations(result.gaps) : [];

  const classificationColor: Record<string, string> = {
    learn_from_scratch: "#4c1d95",
    needs_deepening:    "#78350f",
    prerequisite:       "#1e3a5f",
  };

  const classificationLabel: Record<string, string> = {
    learn_from_scratch: "Learn from scratch",
    needs_deepening:    "Needs deepening",
    prerequisite:       "Prerequisite",
  };

  return (
    <div className="container">
      <div className="card">

        <div className="header">
          <h1>AI Adaptive Onboarding Engine</h1>
          <p>Skill intelligence for faster onboarding</p>
        </div>

        <div className="about">
          This platform analyzes a candidate's resume against job requirements to
          identify skill gaps and measure alignment with the role. It leverages
          intelligent parsing and comparison techniques to extract key competencies
          from both the resume and job description, providing a clear overview of
          matched and missing skills. Based on this analysis, the system generates
          a personalized learning path and actionable recommendations to help
          candidates quickly bridge gaps and become job-ready.
        </div>

        <div className="uploadGrid">
          <div className="uploadBox">
            <p>Resume</p>
            <input type="file" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
          </div>
          <div className="uploadBox">
            <p>Job Description</p>
            <input type="file" onChange={(e) => setJdFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="durationRow">
          <label>Onboarding Duration</label>
          <select value={onboardingWeeks} onChange={(e) => setOnboardingWeeks(Number(e.target.value))}>
            <option value={2}>2 weeks</option>
            <option value={4}>4 weeks</option>
            <option value={8}>8 weeks</option>
            <option value={12}>12 weeks</option>
            <option value={24}>6 months</option>
          </select>
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
                <div className="progressBar" style={{ width: `${score}%` }} />
              </div>
            </div>

            {/* AI Insight */}
            <div className="insightBox">
              <h3>AI Insight</h3>
              <p>{insight}</p>
            </div>

            {/* Resume + JD Skills side by side */}
            <div className="skillsSection">

              <div className="skillBox">
                <h4>Resume Skills <span className="skillCount">({result.resume_skills.length})</span></h4>
                <div className="skillTags">
                  {(showAllResume
                    ? result.resume_skills
                    : result.resume_skills.slice(0, 8)
                  ).map((s: any, i: number) => (
                    <span key={i} className="skillTag">{s.name}</span>
                  ))}
                </div>
                {result.resume_skills.length > 8 && (
                  <button className="showMore" onClick={() => setShowAllResume(!showAllResume)}>
                    {showAllResume ? "Show less ↑" : `+${result.resume_skills.length - 8} more ↓`}
                  </button>
                )}
              </div>

              <div className="skillBox">
                <h4>JD Skills <span className="skillCount">({result.jd_skills.length})</span></h4>
                <div className="skillTags">
                  {(showAllJD
                    ? result.jd_skills
                    : result.jd_skills.slice(0, 8)
                  ).map((s: any, i: number) => (
                    <span key={i} className="skillTag">{s.name}</span>
                  ))}
                </div>
                {result.jd_skills.length > 8 && (
                  <button className="showMore" onClick={() => setShowAllJD(!showAllJD)}>
                    {showAllJD ? "Show less ↑" : `+${result.jd_skills.length - 8} more ↓`}
                  </button>
                )}
              </div>

            </div>

            {/* Skill Gaps — separated by classification */}
            <div className="gapsSection">
              <h3>Skill Gaps <span className="skillCount">({result.gaps.length} identified)</span></h3>

              {result.gaps.filter((g: any) => g.classification === "learn_from_scratch").length > 0 && (
                <div className="gapGroup">
                  <h5 className="gapGroupLabel scratch">Learn from scratch</h5>
                  <div className="gapTags">
                    {result.gaps
                      .filter((g: any) => g.classification === "learn_from_scratch")
                      .map((gap: any, i: number) => (
                        <div key={i} className="gapTag scratchTag">
                          <span className="gapName">{gap.name}</span>
                          <span className="gapLevel">target: {gap.required_level}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {result.gaps.filter((g: any) => g.classification === "needs_deepening").length > 0 && (
                <div className="gapGroup">
                  <h5 className="gapGroupLabel deepen">Needs deepening</h5>
                  <div className="gapTags">
                    {result.gaps
                      .filter((g: any) => g.classification === "needs_deepening")
                      .map((gap: any, i: number) => (
                        <div key={i} className="gapTag deepenTag">
                          <span className="gapName">{gap.name}</span>
                          <span className="gapLevel">{gap.current_level} → {gap.required_level}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
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
            <div className="timeline">
              {result.learning_path.map((item: any, i: number) => (
                <div key={i} className="timelineItem">
                  <div className="timelineDot" />
                  <div className="timelineCard">
                    <div className="timelineHeader">
                      <span className="timelineWeek">Week {item.week}</span>
                      <span style={{
                        background: classificationColor[item.classification] || "#1f2937",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}>
                        {classificationLabel[item.classification] || item.classification}
                      </span>
                    </div>
                    <strong>{item.skill}</strong>
                    <div className="timelineMeta">
                      <span>{item.hours_est}h estimated</span>
                      <span>{item.resource_type}</span>
                      <span>Level: {item.required_level}</span>
                    </div>
                    <p className="timelineJustification">{item.justification}</p>
                    {item.prerequisites?.length > 0 && (
                      <p className="timelinePrereqs">
                        Requires: {item.prerequisites.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reasoning Trace */}
            <h3>Reasoning Trace</h3>
            <div className="traceBox">
              {result.trace.map((t: any, i: number) => (
                <div key={i} className="traceItem">
                  <span className="traceStep">{t.step}</span>
                  <span className="traceOutput">{t.output}</span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;