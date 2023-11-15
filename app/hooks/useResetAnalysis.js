const useResetAnalysis = (setLabels, setTextAnnotations) => {
  const resetAnalysis = () => {
    setLabels([]);
    setTextAnnotations("");
  };

  return { resetAnalysis };
};

export default useResetAnalysis;
