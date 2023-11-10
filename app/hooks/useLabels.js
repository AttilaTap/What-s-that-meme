import { useState } from "react";

const useLabels = (labels, setLabels) => {
  const [labelInput, setLabelInput] = useState("");

  const addLabel = (event) => {
    event.preventDefault();
    if (labelInput && !labels.includes(labelInput)) {
      setLabels((prevLabels) => [...prevLabels, labelInput]);
      setLabelInput("");
    }
  };

  const removeLabel = (indexToRemove) => {
    setLabels((prevLabels) => prevLabels.filter((_, index) => index !== indexToRemove));
  };

  const resetLabels = () => {
    setLabels([]);
    setLabelInput("");
  };

  return {
    labels,
    labelInput,
    setLabelInput,
    addLabel,
    removeLabel,
    resetLabels,
  };
};

export default useLabels;
