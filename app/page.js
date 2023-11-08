"use client";

import Dropzone from "react-dropzone";
import { useCallback, useState } from "react";

export default function Home() {
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [labels, setLabels] = useState([]);
  const [textAnnotations, setTextAnnotations] = useState(null);

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setLabels(data.labels);
      setTextAnnotations(data.text);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
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
        {uploadedImage && (
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
          <strong>Labels:</strong>
          {labels.map((label, index) => (
            <div key={index}>{label}</div>
          ))}
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
