const { Storage } = require("@google-cloud/storage");
const { Firestore, Timestamp } = require("@google-cloud/firestore");
const { v4: uuidv4 } = require("uuid");

const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, "base64").toString("utf-8"));
const projectId = process.env.GCP_PROJECT_ID;

const storage = new Storage({ credentials });
const db = new Firestore({ credentials, projectId});
const bucket = storage.bucket("whats_that_meme_bucket");

export async function POST(req) {
  const { image, mimeType, labels, text } = await req.json();
  if (!image || !mimeType) {
    return new Response(JSON.stringify({ error: "Missing image or MIME type." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Generate a unique filename with UUID
  const uniqueFilename = `${uuidv4()}.${mimeType.split("/")[1]}`;

  // Prepare the file and stream for upload
  const file = bucket.file(uniqueFilename);
  const stream = file.createWriteStream({
    metadata: {
      contentType: mimeType,
    },
  });

  // Convert the base64 string to a buffer and upload it
  const buffer = Buffer.from(image, "base64");

  try {
    await new Promise((resolve, reject) => {
      stream.on("error", (err) => {
        console.error("Upload error:", err);
        reject(
          new Response(JSON.stringify({ error: "Error uploading to Google Cloud Storage" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }),
        );
      });

      stream.on("finish", resolve);
      stream.end(buffer);
    });

    // Make the file public and add record to Firestore
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;

    // Generate a random number between 1 and 100
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    await db.collection("images").add({
      labels,
      text,
      imageUrl: publicUrl,
      RNG: randomNumber,
      timestamp: Timestamp.now(),
    });

    // Respond to the client
    return new Response(JSON.stringify({ message: "Image uploaded and data stored successfully!", imageUrl: publicUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Exception caught:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
