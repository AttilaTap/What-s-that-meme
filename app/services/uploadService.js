export const uploadData = async (uploadedImage, labels, textAnnotations, setIsUploading) => {
  setIsUploading(true);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: uploadedImage.split(",")[1],
        mimeType: uploadedImage.match(/^data:(.*);base64,/)[1],
        labels,
        text: textAnnotations,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to upload");
    }

  } catch (error) {
    console.error("Error uploading image:", error);
  } finally {
    setIsUploading(false);
  }
};
