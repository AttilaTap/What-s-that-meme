import React from "react";
import Dropzone from "react-dropzone";

const ImageDropzone = ({ onDrop, uploadedImage }) => {
  return (
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
        className={`flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md  ${
          isDragActive ? 'border-gray-700' : 'border-gray-300'
        }`}
        >
          <input {...getInputProps()} />
          <div className='space-y-1 text-center'>
            {uploadedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
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
  );
};

export default ImageDropzone;
