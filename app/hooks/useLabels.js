import { useState } from "react";

const useLabels = (initialLabels = []) => {
  const [labels, setLabels] = useState(initialLabels);
  const [labelInput, setLabelInput] = useState("");

  const addLabel = (event) => {
    event.preventDefault();
    if (labelInput && labels.length < 5 && !labels.includes(labelInput)) {
      setLabels([...labels, labelInput]);
      setLabelInput(""); // Clear the input
    }
  };

  const removeLabel = (indexToRemove) => {
    setLabels(labels.filter((_, index) => index !== indexToRemove));
  };

  const resetLabels = () => {
    setLabels([]);
    setLabelInput("");
  };

  return {
    labels,
    setLabelInput,
    addLabel,
    removeLabel,
    resetLabels,
  };
};

export default useLabels;
