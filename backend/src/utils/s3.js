import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";

// Initialize the S3 client with your credentials and region
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file to an S3 bucket.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} fileName - The name of the file to upload.
 * @param {string} filePath - The local path to the file to upload.
 * @returns {Promise<void>} - Resolves when the file is successfully uploaded.
 */
export async function uploadToS3(bucketName = "smbhav", fileName, filePath) {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fs.createReadStream(filePath),
        ContentType: "application/pdf",
      })
    );
    console.log(`File uploaded successfully to ${bucketName}/${fileName}`);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Generates a pre-signed URL for accessing a file in S3.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} fileName - The name of the file in the bucket.
 * @param {number} expiresIn - The expiration time for the pre-signed URL in seconds.
 * @returns {Promise<string>} - The pre-signed URL.
 */
export async function getFileUrlByKey(
  bucketName = "smbhav",
  fileName,
  expiresIn = 60
) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    console.log(`Pre-signed URL: ${url}`);
    return url;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw error;
  }
}

