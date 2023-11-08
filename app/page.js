"use client";

import Dropzone from "react-dropzone";
import { useCallback, useState, useEffect } from "react";

export default function Home() {
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [labels, setLabels] = useState([]);
  const [textAnnotations, setTextAnnotations] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [labelInput, setLabelInput] = useState("");

  const handleSearch = (event) => {
    // Implement search logic here
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Clear any previous rejections or uploaded images
    setFileRejections([]);
    setUploadedImage(null);

    if (acceptedFiles.length === 0) {
      // No files were accepted, so we handle the rejections
      const rejectionErrors = fileRejections.map((rejection) => ({
        file: rejection.file,
        errors: rejection.errors,
      }));
      setFileRejections(rejectionErrors);
      return;
    }

    // Filter out files larger than 1MB or wrong file type
    const tooLargeFiles = acceptedFiles.filter((file) => file.size > 1048576 || !["image/png", "image/jpeg", "image/gif"].includes(file.type));
    if (tooLargeFiles.length > 0) {
      setFileRejections(
        tooLargeFiles.map((file) => ({
          file: file,
          errors: [{ code: "file-too-large-or-wrong-type", message: "File is larger than 1MB or not a supported format" }],
        })),
      );
    } else {
      // Assume here you only want to handle the first file in the acceptedFiles array
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        setUploadedImage(reader.result);
      };

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeImage = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: uploadedImage.split(",")[1] }),
      });

      const data = await response.json(); // Moved inside try block

      if (response.ok) {
        // Keep only the first 5 labels
        const topFiveLabels = data.labels.slice(0, 5);

        setLabels(topFiveLabels);
        setTextAnnotations(data.text);
        setIsAnalyzed(true);
      } else {
        // If the response is not ok, throw an error
        throw new Error(`Error in analysis: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      // Catch any errors thrown in the try block
      console.error("Error analyzing image:", error);
      // Update the UI to inform the user that an error has occurred
      // You might want to set an error state and display it in the UI
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetState = () => {
    setUploadedImage(null);
    setIsAnalyzing(false);
    setLabels([]);
    setTextAnnotations(null);
    setIsAnalyzed(false);
    setIsUploading(false);
    setFileRejections([]);
  };

  const uploadData = async () => {
    setIsUploading(true);

    try {
      // Call the backend endpoint to upload the image and store the data
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedImage.split(",")[1], // Get the base64 part of the data URL
          mimeType: uploadedImage.match(/^data:(.*);base64,/)[1], // Extract the MIME type
          labels, // Labels from the analysis
          text: textAnnotations, // Text from the analysis
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload");
      }

      // Here you can handle the success response, such as showing a message to the user
      alert("Image uploaded successfully!");
      resetState();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const addLabel = (event) => {
    event.preventDefault();
    if (labelInput && labels.length < 5 && !labels.includes(labelInput)) {
      setLabels([...labels, labelInput]);
      setLabelInput("");
    }
  };

  const removeLabel = (indexToRemove) => {
    setLabels(labels.filter((_, index) => index !== indexToRemove));
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='my-8'>
        <input
          type='text'
          placeholder='Search memes...'
          onChange={handleSearch}
          className='border-2 border-gray-300 p-2 rounded-lg w-full'
        />
      </div>

      <div className='my-8'>
        {isAnalyzed ? (
          <button
            onClick={uploadData}
            className='mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            disabled={isUploading} // You would manage this state when implementing the upload
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        ) : (
          <button
            onClick={analyzeImage}
            className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
        )}
      </div>
      <div className='mt-4'>
        <div>
          <strong>Tags:</strong>
          {labels.map((label, index) => (
            <div
              key={index}
              className='label'
            >
              <button onClick={() => removeLabel(index)}>x</button>
              {label}
            </div>
          ))}
          {isAnalyzed && (
            <form onSubmit={addLabel}>
              <input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder='Add a label...'
              />
              <button
                type='submit'
                disabled={labels.length >= 5}
              >
                Add
              </button>
            </form>
          )}
        </div>
        <div>
          <strong>Text Annotations:</strong>
          <p>{textAnnotations}</p>
        </div>
      </div>

      <section className='w-full'>
        {fileRejections.length > 0 && (
          <div className='text-red-500 text-sm mt-2'>
            {fileRejections.map(({ file, errors }) => (
              <p key={file.path}>
                {file.path} - {errors.map((e) => e.message).join(", ")}
              </p>
            ))}
          </div>
        )}
        <Dropzone
          onDrop={onDrop}
          maxSize={1048576}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/gif": [".gif"],
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className='flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-white'
            >
              <input {...getInputProps()} />
              <div className='space-y-1 text-center'>
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt='Uploaded content'
                    className='max-w-xs max-h-64'
                  />
                ) : (
                  <div>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400'
                      stroke='currentColor'
                      fill='none'
                      viewBox='0 0 48 48'
                      aria-hidden='true'
                    >
                      <path
                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12m36-12H12'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <p className='text-lg font-semibold'>{isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or click to select files"}</p>
                    <p className='text-sm text-gray-600'>Upload a file or drag and drop</p>
                    <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 1MB</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Dropzone>
      </section>
    </main>
  );
}
