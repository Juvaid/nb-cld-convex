import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

// Import a JSON backup file
// POST http://localhost:3000/api/data/import
// Body: multipart/form-data with field "backup" containing the JSON file
// Or JSON body: { "backup": { ... }, "dryRun": true }
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return NextResponse.json({ error: "NEXT_PUBLIC_CONVEX_URL not set" }, { status: 500 });
    }

    try {
        const contentType = request.headers.get("content-type") || "";
        let backup: unknown;
        let dryRun = false;

        if (contentType.includes("multipart/form-data")) {
            // File upload
            const formData = await request.formData();
            const file = formData.get("backup") as File | null;
            dryRun = formData.get("dryRun") === "true";

            if (!file) {
                return NextResponse.json({ error: "No backup file provided. Field name must be 'backup'." }, { status: 400 });
            }
            const text = await file.text();
            backup = JSON.parse(text);
        } else {
            // JSON body
            const body = await request.json();
            backup = body.backup;
            dryRun = body.dryRun ?? false;
        }

        if (!backup) {
            return NextResponse.json({ error: "Backup data is empty or invalid." }, { status: 400 });
        }

        const client = new ConvexHttpClient(convexUrl);
        const result = await client.mutation(api.backup.importAll, { backup, dryRun, token });

        return NextResponse.json({
            success: true,
            dryRun,
            result,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
