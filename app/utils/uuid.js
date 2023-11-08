const { v4: uuidv4 } = require("uuid");

const generateUniqueFilename = (originalName) => {
  // Generate a UUID for uniqueness
  const uniqueId = uuidv4();

  // Get the file extension from the original name
  const extension = originalName.split(".").pop();

  // Return the unique filename
  return `${uniqueId}.${extension}`;
};
