import { useState } from "react";

const useImageAnalysis = (labels, setLabels) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textAnnotations, setTextAnnotations] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const analyzeImage = async (imageBase64) => {
    setIsAnalyzing(true);
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
        setIsAnalyzed(true);
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Error during image analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setIsAnalyzed(false);
    setLabels([]);
    setTextAnnotations("");
  };

  return {
    isAnalyzing,
    isAnalyzed,
    labels,
    textAnnotations,
    setTextAnnotations,
    analyzeImage,
    resetAnalysis,
  };
};

export default useImageAnalysis;
