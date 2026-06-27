// LOCAL-DISK FILE STORAGE
// This stands in for AWS S3 so uploads work on your machine with no AWS
// account needed. It keeps the same function names (uploadToS3, deleteFromS3,
// s3KeyFromUrl) so the routes that use it don't need to change.
//
// Files save to backend/uploads/ and are served at http://localhost:5000/files/...
// When you're ready to deploy with real S3, swap this file's contents back to
// the AWS SDK version - nothing else in the codebase needs to change.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "http://localhost:5000";

export async function uploadToS3(buffer, key, contentType) {
  const filePath = path.join(UPLOADS_DIR, key);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  return `${PUBLIC_BASE_URL}/files/${key}`;
}

export async function deleteFromS3(key) {
  const filePath = path.join(UPLOADS_DIR, key);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function s3KeyFromUrl(url) {
  try {
    const u = new URL(url);
    const marker = "/files/";
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    return u.pathname.slice(idx + marker.length);
  } catch {
    return null;
  }
}
