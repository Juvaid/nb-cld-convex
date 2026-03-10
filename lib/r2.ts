import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.R2_ACCOUNT_ID) throw new Error("R2_ACCOUNT_ID is not set");
if (!process.env.R2_ACCESS_KEY_ID) throw new Error("R2_ACCESS_KEY_ID is not set");
if (!process.env.R2_SECRET_ACCESS_KEY) throw new Error("R2_SECRET_ACCESS_KEY is not set");
if (!process.env.R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME is not set");

export const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export const BUCKET = process.env.R2_BUCKET_NAME!;
export const PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

// CRITICAL: Ensure PUBLIC_URL is set to avoid broken relative links
if (!PUBLIC_URL) {
    console.error("❌ [R2 CONFIG ERROR] R2_PUBLIC_URL is not defined in environment variables.");
    // We don't throw yet to allow the client to initialize, but we'll throw in uploadToR2
} else {
    console.log("✅ [R2 CONFIG] Public URL configured:", PUBLIC_URL);
}

/**
 * Upload a file buffer to Cloudflare R2 and return its public CDN URL.
 */
export async function uploadToR2(
    key: string,
    body: Buffer | Uint8Array,
    contentType: string
): Promise<string> {
    if (!PUBLIC_URL) {
        throw new Error("R2_PUBLIC_URL is missing. Cannot generate public asset URL.");
    }
    await r2.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: body,
            ContentType: contentType,
        })
    );
    return `${PUBLIC_URL}/${key}`;
}

/**
 * Delete a file from R2 by its key (filename).
 */
export async function deleteFromR2(key: string): Promise<void> {
    await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Generate a presigned URL for direct browser-to-R2 uploads (optional, advanced).
 */
export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
    return getSignedUrl(
        r2,
        new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
        { expiresIn: 3600 }
    );
}
