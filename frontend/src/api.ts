export const analyzeFiles = async (resume: File, jd: File, onboardingWeeks: number) => {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jd", jd);
  formData.append("onboarding_weeks", String(onboardingWeeks));

  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("API error");
  }

  return await response.json();
};