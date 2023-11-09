import { useCallback } from 'react';

const useFileDrop = (setUploadedImage, resetAnalysis, resetLabels, setFileRejections) => {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Clear any previous rejections or uploaded images
    setFileRejections([]);
    setUploadedImage(null);
    resetAnalysis();
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
        setUploadedImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }, [setUploadedImage, resetAnalysis, resetLabels, setFileRejections]);

  return onDrop;
};

export default useFileDrop;