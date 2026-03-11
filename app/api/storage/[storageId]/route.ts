import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const client = new ConvexHttpClient(convexUrl);

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storageId: string }> }
) {
    const { storageId } = await params;

    if (!storageId) {
        return new NextResponse("Storage ID missing", { status: 400 });
    }

    try {
        const url = await client.query(api.media.getUrlByStorageId, { storageId });

        if (!url) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // Fetch the actual image data to proxy it with caching headers
        const response = await fetch(url);
        
        if (!response.ok) {
            return new NextResponse("Failed to fetch image from storage", { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get("Content-Type") || "image/png";

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Storage API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
