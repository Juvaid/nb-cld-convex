import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Helper to get R2 configuration safely without crashing at boot time
function getR2Config() {
    const config = {
        accountId: process.env.R2_ACCOUNT_ID,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        bucketName: process.env.R2_BUCKET_NAME,
        publicUrl: (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, ""),
    };

    const missing = Object.entries(config)
        .filter(([key, value]) => !value && key !== "publicUrl")
        .map(([key]) => key);

    return { ...config, missing };
}

// Lazy-loaded R2 client
let _r2Client: S3Client | null = null;
function getR2Client() {
    if (_r2Client) return _r2Client;

    const config = getR2Config();
    if (config.missing.length > 0) {
        throw new Error(`R2 Configuration incomplete. Missing: ${config.missing.join(", ")}`);
    }

    _r2Client = new S3Client({
        region: "auto",
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: config.accessKeyId!,
            secretAccessKey: config.secretAccessKey!,
        },
    });
    return _r2Client;
}

/**
 * Upload a file buffer to Cloudflare R2 and return its public CDN URL.
 */
export async function uploadToR2(
    key: string,
    body: Buffer | Uint8Array,
    contentType: string
): Promise<string> {
    const config = getR2Config();

    if (!config.publicUrl) {
        throw new Error("R2_PUBLIC_URL is missing. Please add it to your environment variables.");
    }

    const client = getR2Client();
    await client.send(
        new PutObjectCommand({
            Bucket: config.bucketName!,
            Key: key,
            Body: body,
            ContentType: contentType,
        })
    );

    return `${config.publicUrl}/${key}`;
}

/**
 * Delete a file from R2 by its key (filename).
 */
export async function deleteFromR2(key: string): Promise<void> {
    const config = getR2Config();
    const client = getR2Client();
    await client.send(new DeleteObjectCommand({ Bucket: config.bucketName!, Key: key }));
}

/**
 * Generate a presigned URL for direct browser-to-R2 uploads (optional, advanced).
 */
export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
    const config = getR2Config();
    const client = getR2Client();
    return getSignedUrl(
        client,
        new PutObjectCommand({ Bucket: config.bucketName!, Key: key, ContentType: contentType }),
        { expiresIn: 3600 }
    );
}

// Export these for diagnostics if needed, but they won't throw at boot now
export const getBucketName = () => process.env.R2_BUCKET_NAME || "";
export const getPublicUrl = () => (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
