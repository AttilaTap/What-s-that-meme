/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { uploadData } from "./services/uploadService";
import useImageAnalysis from "./hooks/useImageAnalysis";
import useLabels from "./hooks/useLabels";
import useFileDrop from "./hooks/useFileDrop";
import ImageDropzone from "./components/imageDropzone";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, Pagination, Configure } from "react-instantsearch";

export default function Home() {
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [labels, setLabels] = useState([]);

  const { isAnalyzing, isAnalyzed, textAnnotations, analyzeImage, setTextAnnotations, resetAnalysis } = useImageAnalysis(labels, setLabels);
  const { labelInput, setLabelInput, addLabel, removeLabel, resetLabels } = useLabels(labels, setLabels);

  const onDrop = useFileDrop(setUploadedImage, resetAnalysis, resetLabels, setFileRejections);

  const handleUpload = () => {
    uploadData(uploadedImage, labels, textAnnotations, setIsUploading, setUploadedImage, resetAnalysis, resetLabels, setFileRejections);
  };

  const originalSearchClient = algoliasearch("W0VJU3M8Q7", "41486e21b0254ba83fa465a7bf0ead54");

  const searchClient = {
    ...originalSearchClient,
    search(requests) {
      if (requests.every(({ params }) => !params.query)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
          })),
        });
      }

      return originalSearchClient.search(requests);
    },
  };

  function Hit({ hit }) {
    return (
      <article className='border-gray-200 p-4 w-full md:w-48 md:h-48 lg:w-64 lg:h-64'>
        <img
          className='p-2'
          src={hit.imageUrl}
          alt={hit.text}
        />
      </article>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <InstantSearch
        searchClient={searchClient}
        indexName='meme data'
      >
        <Configure hitsPerPage={10} />
        <SearchBox
          className='mb-8 w-screen search-box-class search-box-width h-7'
          placeholder='Search for memes'
        />

        <Hits hitComponent={Hit} />

        <Pagination className='custom-pagination' />
      </InstantSearch>

      <div className='my-8'>
        {isAnalyzed ? (
          <button
            onClick={handleUpload}
            className='mt-4 bg-my-asparagus hover:bg-my-berkeleyblue  text-my-white font-bold py-2 px-4 rounded-lg'
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        ) : (
          <button
            onClick={() => analyzeImage(uploadedImage.split(",")[1])}
            className='mt-4 bg-my-asparagus hover:bg-my-berkeleyblue text-my-white font-bold py-2 px-4 rounded-lg'
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
        )}
      </div>
      <div className='mt-4'>
        <div>
          <div className='flex flex-row flex-wrap'>
            {labels.map((label, index) => (
              <div
                key={index}
                className='label m-1 bg-my-vanilla w-fit rounded-lg p-2.5'
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
          </div>

          {isAnalyzed && (
            <form
              onSubmit={addLabel}
              className='flex flex-row items-center search-box-class w-full'
            >
              <input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                className='p-2 m-2 rounded-lg mb-2 w-fit'
                placeholder='Add a tag...'
              />
              <button
                type='submit'
                disabled={labels.length >= 5}
                className='bg-my-asparagus hover:bg-my-berkeleyblue text-my-white font-bold py-2 px-4 rounded-lg'
              >
                +
              </button>
            </form>
          )}
        </div>
        <div className='search-box-class search-box-width'>
          <textarea
            type='text'
            value={textAnnotations}
            onChange={(e) => setTextAnnotations(e.target.value)}
            className='p-2 rounded-lg my-2 h-32 bg-transparent'
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
