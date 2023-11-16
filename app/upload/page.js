"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { uploadData } from "../services/uploadService";
import "react-toastify/dist/ReactToastify.css";

import useAnalyzeImage from "../hooks/useImageAnalysis";
import useResetAnalysis from "../hooks/useResetAnalysis";
import useFileDrop from "../hooks/useFileDrop";
import ImageDropzone from "../components/imageDropzone";
import useLabels from "../hooks/useLabels";

export default function UserUpload() {
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [textAnnotations, setTextAnnotations] = useState("");

  const { analyzeImage } = useAnalyzeImage();
  const { resetAnalysis } = useResetAnalysis(setLabels, setTextAnnotations);

  const { labelInput, setLabelInput, addLabel, removeLabel } = useLabels(labels, setLabels);
  const isUploadButtonDisabled = !uploadedImage || isUploading;

  const { onDrop } = useFileDrop(async (result) => {
    setUploadedImage(result);
    try {
      const analysis = await analyzeImage(result.split(",")[1]);
      if (analysis && analysis.labels) {
        setLabels(analysis.labels.slice(0, 5));
        setTextAnnotations(analysis.text);
      } else {
        console.error("Analysis data is missing or incomplete.");
        toast.error("Error in analyzing image.");
      }
    } catch (error) {
      console.error("Error during image analysis:", error);
      toast.error("Error in analyzing image.");
    }
  });

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await uploadData(uploadedImage, labels, textAnnotations, setIsUploading);
      toast.success("Image uploaded successfully!");
      resetAnalysis();
      setUploadedImage(null);
      setFileRejections([]);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <main className='flex min-h-screen flex-col justify-between items-center'>
      <section className='mb-8'>
        <ImageDropzone
          onDrop={onDrop}
          uploadedImage={uploadedImage}
        />

        {fileRejections.length > 0 && (
          <div className='text-red-500 text-sm mt-2'>
            {fileRejections.map(({ file, errors }) => (
              <p key={file.path}>
                {file.path} - {errors.map((e) => e.message).join(", ")}
              </p>
            ))}
          </div>
        )}
      </section>

      <ToastContainer
        position='top-center'
        autoClose={1000}
      />

      <section>
        {labels.map((label, index) => (
          <div
            key={index}
            className='label m-1 bg-my-moonstoneshade w-fit rounded-lg p-2.5'
          >
            {label}
            <button
              onClick={() => removeLabel(index)}
              className='px-1 rounded-lg mr-2 ml-2.5 '
            >
              x
            </button>
          </div>
        ))}
        <form
          onSubmit={addLabel}
          className='flex flex-row items-center w-full mt-4'
        >
          <input
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            className='p-2 m-2 rounded-lg mb-2 w-fit text-my-black'
            placeholder='Add a tag...'
          />
          <button
            type='submit'
            disabled={labels.length >= 5}
            className='bg-my-darkslategray hover:bg-my-berkeleyblue text-my-white font-bold py-2 px-4 rounded-lg'
          >
            +
          </button>
        </form>
      </section>

      <section className='items-center w-96'>
        <textarea
          type='text'
          value={textAnnotations}
          onChange={(e) => setTextAnnotations(e.target.value)}
          className='rounded-lg bg-transparent h-32 my-8 w-full mx-0'
          placeholder='Edit text...'
        />
      </section>

      <section className='mb-10 flex justify-between'>
        <div className='mr-12 my-4'>
          <button
            onClick={handleBack}
            className='bg-my-tangelo hover:bg-my-darkslategray text-my-white font-bold py-2 px-10 rounded-lg'
          >
            Back
          </button>
        </div>
        <div className='ml-12 my-4'>
          <button
            onClick={handleUpload}
            className='bg-my-darkslategray hover:bg-my-berkeleyblue text-my-white font-bold py-2 px-10 rounded-lg'
            disabled={isUploadButtonDisabled}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </section>
    </main>
  );
}
