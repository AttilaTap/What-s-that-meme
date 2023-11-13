const useImageAnalysis = (labels, setLabels, textAnnotations, setTextAnnotations) => {
  const analyzeImage = async (imageBase64) => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const data = await response.json();

      if (response.ok) {
        setLabels(data.labels.slice(0, 5));
        setTextAnnotations(data.text);
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Error during image analysis:", error);
    }
  };

  const resetAnalysis = () => {
    setLabels([]);
    setTextAnnotations("");
  };

  return {
    labels,
    textAnnotations,
    setTextAnnotations,
    analyzeImage,
    resetAnalysis,
  };
};

export default useImageAnalysis;
