import { useCallback } from 'react';
import useImageAnalysis from './useImageAnalysis';


const useFileDrop = (setUploadedImage, resetLabels, setFileRejections, labels, setLabels, textAnnotations, setTextAnnotations) => {
  const { isAnalyzing, isAnalyzed, analyzeImage } = useImageAnalysis(labels, setLabels, textAnnotations, setTextAnnotations);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Clear any previous rejections or uploaded images
    setFileRejections([]);
    setUploadedImage(null);
    resetLabels();

    if (acceptedFiles.length === 0) {
      // Handle file rejections
      const rejectionErrors = fileRejections.map((rejection) => ({
        file: rejection.file,
        errors: rejection.errors,
      }));
      setFileRejections(rejectionErrors);
    } else {
      // Process the accepted file
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        console.log('file reading was successful');
        setUploadedImage(reader.result);
        analyzeImage(reader.result.split(",")[1]);
      };

      reader.readAsDataURL(file);
    }
  }, [setUploadedImage, resetLabels, setFileRejections, analyzeImage]);

  return {onDrop, labels, setLabels, textAnnotations, setTextAnnotations};
};

export default useFileDrop;