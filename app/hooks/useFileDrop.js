import { useCallback } from "react";
import { toast } from "react-toastify";

const useFileDrop = (onFileLoad, onFileError) => {
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const isTooLarge = fileRejections.some((rejection) => rejection.errors.some((error) => error.code === "file-too-large"));

      if (isTooLarge) {
        toast.error("Sorry, max file size is 1MB");
      }

      if (acceptedFiles.length === 0) {
        const rejectionErrors = fileRejections.map((rejection) => ({
          file: rejection.file,
          errors: rejection.errors,
        }));
        onFileError(rejectionErrors);
      } else {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          console.log("file reading was successful");
          onFileLoad(reader.result);
        };

        reader.readAsDataURL(file);
      }
    },
    [onFileLoad, onFileError],
  );

  return { onDrop };
};

export default useFileDrop;
