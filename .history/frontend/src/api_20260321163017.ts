export const analyzeFiles = async (resume: File, jd: File) => {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jd", jd);

  const response = await fetch("", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("API error");
  }

  return await response.json();
};