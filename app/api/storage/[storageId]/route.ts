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

        // Redirect to the actual Convex storage URL
        return NextResponse.redirect(url);
    } catch (error) {
        console.error("Storage API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
