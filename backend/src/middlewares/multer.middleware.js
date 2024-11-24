import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique identifiers

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Define the destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename: originalname + UUID + timestamp
    const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
    const extension = file.originalname.split('.').pop(); // Extract file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  },
});

export const upload = multer({
  storage,
});
