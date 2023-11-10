export const uploadData = async (uploadedImage, labels, textAnnotations, setIsUploading, setUploadedImage, resetAnalysis, resetLabels, setFileRejections) => {
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
