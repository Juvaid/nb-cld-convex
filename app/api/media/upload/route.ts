import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { uploadToR2 } from "@/lib/r2";

const ALLOWED_TYPES = [
    "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
    "video/mp4", "video/webm",
];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100 MB

// ── helpers ──────────────────────────────────────────────────────────────────

function getConvexClient() {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL not set");
    return new ConvexHttpClient(url);
}

async function verifyAdminSession(client: ConvexHttpClient, request: NextRequest) {
    // Token is read from the x-auth-token header (set by useUpload from localStorage)
    const token = request.headers.get("x-auth-token") ?? null;

    if (!token) return null;

    const user = await client.query(api.auth.getCurrentUser, { token });
    if (!user || user.role !== "admin") return null;
    return user;
}

function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return `File type '${file.type}' is not allowed.`;
    }
    const maxSize = file.type.startsWith("video/") ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
        const label = file.type.startsWith("video/") ? "100 MB" : "10 MB";
        return `'${file.name}' exceeds the ${label} limit.`;
    }
    return null;
}

async function uploadSingleFile(file: File, client: ConvexHttpClient, folder?: string) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const key = `${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const publicUrl = await uploadToR2(key, buffer, file.type);

    const mediaId = await client.mutation(api.media.saveR2Media, {
        filename: file.name,
        r2Key: key,
        url: publicUrl,
        type: file.type.startsWith("video/") ? "video" : "image",
        size: file.size,
        folder,
    });

    return { url: publicUrl, mediaId, filename: file.name, type: file.type, size: file.size };
}

// ── POST /api/media/upload ───────────────────────────────────────────────────
// Accepts multipart/form-data with one or more fields named "file".
// Requires an active admin session (cookie __session or header x-auth-token).

export async function POST(request: NextRequest) {
    const client = getConvexClient();

    // 1. Auth guard
    const adminUser = await verifyAdminSession(client, request);
    if (!adminUser) {
        return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const files = formData.getAll("file") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No file(s) provided. Field name must be 'file'." }, { status: 400 });
        }

        // 2. Validate all files upfront before touching R2
        for (const file of files) {
            const err = validateFile(file);
            if (err) return NextResponse.json({ error: err }, { status: 400 });
        }

        // Optional folder tag shared by all files in this upload batch
        const folder = (formData.get("folder") as string | null) || undefined;

        // 3. Upload concurrently
        const results = await Promise.all(files.map((f) => uploadSingleFile(f, client, folder)));

        return NextResponse.json({ success: true, results });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[R2 Upload Error]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
