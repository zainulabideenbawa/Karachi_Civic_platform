import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID || "68ad6e637f1e301834c96e3692678087";
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "civickarachi";
export const R2_ENDPOINT = `https://${accountId}.r2.cloudflarestorage.com`;
export const R2_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || `https://pub-civickarachi.r2.dev`;

/**
 * S3 Client for Cloudflare R2
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Generate a pre-signed URL for direct browser-to-R2 upload (Section 13.5 Layer 4)
 * - Restricts expiration to 60 seconds
 * - Enforces image/webp or image/jpeg
 */
export async function createPresignedUploadUrl(
  key: string,
  contentType: string = "image/webp",
  expiresInSeconds: number = 60
) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: expiresInSeconds,
  });

  return {
    uploadUrl,
    key,
    publicUrl: `${R2_PUBLIC_DOMAIN}/${key}`,
  };
}

/**
 * Direct Server-Side Upload to R2 (Fallback & Server Actions)
 */
export async function uploadToR2(
  fileBuffer: Buffer | Uint8Array,
  key: string,
  contentType: string = "image/webp"
) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  return {
    key,
    publicUrl: `${R2_PUBLIC_DOMAIN}/${key}`,
  };
}
