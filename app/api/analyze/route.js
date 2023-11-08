const vision = require("@google-cloud/vision");

export async function POST(req, res) {
  const body = await req.json();
  const image = body?.image;

  if (!image) {
    return new Response(JSON.stringify({ error: "No image provided." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, "base64").toString("utf-8"));

    const visionClient = new vision.ImageAnnotatorClient({ credentials });

    // Convert the base64-encoded image back to a Buffer
    const imageBuffer = Buffer.from(image, "base64");

    // Prepare the request for Google Cloud Vision API
    const [labelResult] = await visionClient.labelDetection({ image: { content: imageBuffer } });
    const labels = labelResult.labelAnnotations.map((label) => label.description);

    const [textResult] = await visionClient.textDetection({ image: { content: imageBuffer } });
    const text = textResult.textAnnotations[0]?.description || "";

    // Send the results back to the frontend
    return new Response(JSON.stringify({ labels, text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error with Google Vision API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
