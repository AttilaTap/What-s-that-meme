const { Storage } = require("@google-cloud/storage");
const { Firestore, Timestamp } = require("@google-cloud/firestore");
const { v4: uuidv4 } = require("uuid");

const storage = new Storage();
const db = new Firestore();
const bucket = storage.bucket("whats_that_meme_bucket");

const addRecordToDatabase = async (labels, text, imageUrl) => {
  const docRef = db.collection("images").doc();
  await docRef.set({
    labels,
    text,
    imageUrl,
    timestamp: Timestamp.now(),
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { image, mimeType, labels, text } = req.body; // Assume labels and text are sent in the body
  const imageBuffer = Buffer.from(image, "base64");

  // Generate a unique filename with UUID
  const uniqueFilename = `${uuidv4()}.${mimeType.split("/")[1]}`;

  const file = bucket.file(uniqueFilename);
  const stream = file.createWriteStream({
    metadata: {
      contentType: mimeType,
    },
  });

  stream.on("error", (err) => {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Error uploading to Google Cloud Storage" });
  });

  stream.on("finish", async () => {
    // The file upload is complete, we can make the file public now
    try {
      await file.makePublic();

      // Get the public URL for the uploaded file
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      // Add record to Firestore database
      await addRecordToDatabase(labels, text, publicUrl);

      return res.status(200).json({ message: "Image uploaded successfully!", filename: uniqueFilename, imageUrl: publicUrl });
    } catch (error) {
      console.error("Error making uploaded file public or adding record to database:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  stream.end(imageBuffer);
}
