import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

// Export all site data as a downloadable JSON backup
// GET http://localhost:3000/api/data/export
export async function GET() {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return NextResponse.json({ error: "NEXT_PUBLIC_CONVEX_URL not set" }, { status: 500 });
    }

    try {
        const client = new ConvexHttpClient(convexUrl);
        const backup = await client.query(api.backup.exportAll, {});

        const filename = `nb-backup-${new Date().toISOString().slice(0, 10)}.json`;
        const json = JSON.stringify(backup, null, 2);

        return new NextResponse(json, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
