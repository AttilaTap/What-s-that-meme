"use client";

import { useState } from "react";
import useImageAnalysis from "./hooks/useImageAnalysis";
import useLabels from "./hooks/useLabels";
import useFileDrop from "./hooks/useFileDrop";
import ImageDropzone from "./components/imageDropzone";

export default function Home() {
  const { isAnalyzing, isAnalyzed, labels, textAnnotations, analyzeImage, setTextAnnotations, resetAnalysis } = useImageAnalysis();
  const { labelInput, setLabelInput, addLabel, removeLabel, resetLabels } = useLabels();

  const [fileRejections, setFileRejections] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useFileDrop(setUploadedImage, resetAnalysis, resetLabels, setFileRejections);

  const handleSearch = (event) => {
    // Implement search logic here
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
      setUploadedImage(null);
      setIsUploading(false);
      setFileRejections([]);
      resetAnalysis();
      resetLabels();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handler to update text annotations
  const handleTextAnnotationsChange = (event) => {
    setTextAnnotations(event.target.value);
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
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        ) : (
          <button
            onClick={() => analyzeImage(uploadedImage.split(",")[1])}
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
          <input
            type='text'
            value={textAnnotations}
            onChange={(e) => setTextAnnotations(e.target.value)}
            className='border-2 border-gray-300 p-2 rounded-lg w-full'
            placeholder='Edit text annotations...'
          />
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
        <ImageDropzone
          onDrop={onDrop}
          uploadedImage={uploadedImage}
        />
      </section>
    </main>
  );
}
