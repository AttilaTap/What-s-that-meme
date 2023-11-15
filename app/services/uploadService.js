// Function to prepare the request payload
const prepareUploadPayload = (uploadedImage, labels, textAnnotations) => {
  return {
    image: uploadedImage.split(",")[1],
    mimeType: uploadedImage.match(/^data:(.*);base64,/)[1],
    labels,
    text: textAnnotations,
  };
};

// Function to handle the API response
const handleApiResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to upload");
  }
  return data;
};

// Function to upload the image data
export const uploadData = async (uploadedImage, labels, textAnnotations, setIsUploading) => {
  setIsUploading(true);

  try {
    const payload = prepareUploadPayload(uploadedImage, labels, textAnnotations);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await handleApiResponse(response);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  } finally {
    setIsUploading(false);
  }
};
