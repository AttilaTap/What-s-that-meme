const useAnalyzeImage = () => {
  const analyzeImage = async (imageBase64) => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analysis failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Error during image analysis:", error);
      throw error;
    }
  };

  return { analyzeImage };
};

export default useAnalyzeImage;
