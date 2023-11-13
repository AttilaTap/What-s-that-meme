"use client";

import { useState } from "react";
import { uploadData } from "../services/uploadService";
import useLabels from "../hooks/useLabels";
import useFileDrop from "../hooks/useFileDrop";
import ImageDropzone from "../components/imageDropzone";
import { useRouter } from "next/navigation";

export default function UserUpload() {
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [textAnnotations, setTextAnnotations] = useState("");

  const { labelInput, setLabelInput, addLabel, removeLabel, resetLabels } = useLabels(labels, setLabels);
  const { onDrop } = useFileDrop(setUploadedImage, resetLabels, setFileRejections, labels, setLabels, textAnnotations, setTextAnnotations);

  const handleUpload = () => {
    uploadData(uploadedImage, labels, textAnnotations, setIsUploading, setUploadedImage, resetLabels, setFileRejections);
  };

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
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

      <section className='mt-4'>
        <textarea
          type='text'
          value={textAnnotations}
          onChange={(e) => setTextAnnotations(e.target.value)}
          className='p-2 rounded-lg my-2 h-32 bg-transparent'
          placeholder='Edit text...'
        />
      </section>

      <section className='my-8 w-full flex justify-between items-center'>
        <div className='flex-grow'>
          <button
            onClick={handleBack}
            className='w-full bg-my-tangelo hover:bg-my-darkslategray text-my-white font-bold py-2 px-4 rounded-lg'
          >
            Back
          </button>
        </div>
        <div className='flex-grow'></div>
        <div className='flex-grow'>
          <button
            onClick={handleUpload}
            className='w-full bg-my-darkslategray hover:bg-my-berkeleyblue text-my-white font-bold py-2 px-4 rounded-lg'
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </section>
    </main>
  );
}
