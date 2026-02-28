import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const path = req.nextUrl.searchParams.get("path");

        if (!path) {
            return NextResponse.json({ message: "Missing path parameter" }, { status: 400 });
        }

        // If 'layout' is explicitly passed, clear the entire site layout cache (useful for global settings like Favicon)
        if (path === "layout" || path === "all") {
            revalidatePath("/", "layout");
        } else {
            revalidatePath(path);

            // Additionally, revalidate broader layouts if it's the home page or a highly impactful page
            if (path === "/") {
                revalidatePath("/", "layout");
            }
        }

        return NextResponse.json({ revalidated: true, now: Date.now(), path });
    } catch (err) {
        return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
    }
}
