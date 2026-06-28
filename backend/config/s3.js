// LOCAL-DISK FILE STORAGE
// This stands in for AWS S3 so uploads work on your machine with no AWS
// account needed. It keeps the same function names (uploadToS3, deleteFromS3,
// s3KeyFromUrl) so the routes that use it don't need to change.
//
// Files save to backend/uploads/ and are served at http://localhost:5000/files/...
// When you're ready to deploy with real S3, swap this file's contents back to
// the AWS SDK version - nothing else in the codebase needs to change.

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;

export async function uploadToS3(buffer, key, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function deleteFromS3(key) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export function s3KeyFromUrl(url) {
  try {
    const u = new URL(url);
    return u.pathname.slice(1);
  } catch {
    return null;
  }
}