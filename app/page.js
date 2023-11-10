/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { uploadData } from "./services/uploadService";
import useImageAnalysis from "./hooks/useImageAnalysis";
import useLabels from "./hooks/useLabels";
import useFileDrop from "./hooks/useFileDrop";
import ImageDropzone from "./components/imageDropzone";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";

export default function Home() {
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [labels, setLabels] = useState([]);

  const { isAnalyzing, isAnalyzed, textAnnotations, analyzeImage, setTextAnnotations, resetAnalysis } = useImageAnalysis(labels, setLabels);
  const { labelInput, setLabelInput, addLabel, removeLabel, resetLabels } = useLabels(labels, setLabels);

  const onDrop = useFileDrop(setUploadedImage, resetAnalysis, resetLabels, setFileRejections);

  // Initialize Algolia client
  const searchClient = algoliasearch("W0VJU3M8Q7", "41486e21b0254ba83fa465a7bf0ead54");

  const handleUpload = () => {
    uploadData(uploadedImage, labels, textAnnotations, setIsUploading, setUploadedImage, resetAnalysis, resetLabels, setFileRejections);
  };

  function Hit({ hit }) {
    return (
      <article className='border border-gray-200 p-4'>
        <img
          className='w-full h-auto'
          src={hit.imageUrl}
          alt={hit.text}
        />
      </article>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='w-full my-8 flex flex-col items-center justify-center'>
        <InstantSearch
          searchClient={searchClient}
          indexName='meme data'
        >
          <SearchBox className='p-8' />
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            <Hits hitComponent={Hit} />
          </div>
        </InstantSearch>
      </div>

      <div className='my-8'>
        {isAnalyzed ? (
          <button
            onClick={handleUpload}
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
          {labels.map((label, index) => (
            <div
              key={index}
              className='label mb-1'
            >
              <button
                onClick={() => removeLabel(index)}
                className='border-2 border-gray-300 px-1 rounded-lg mr-2 text-white font-bold bg-red-500'
              >
                x
              </button>
              {label}
            </div>
          ))}
          {isAnalyzed && (
            <form onSubmit={addLabel}>
              <input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                className='border-2 border-gray-300 p-2 rounded-lg w-full mb-2'
                placeholder='Add a tag...'
              />
              <button
                type='submit'
                disabled={labels.length >= 5}
                className='border-2 bg-green-500 p-2 text-white font-bold rounded-lg w-full'
              >
                Add Tag
              </button>
            </form>
          )}
        </div>
        <div>
          <input
            type='text'
            value={textAnnotations}
            onChange={(e) => setTextAnnotations(e.target.value)}
            className='border-2 border-gray-300 p-2 rounded-lg w-full my-2'
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
