import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { deleteFromR2 } from "@/lib/r2";

function getConvexClient() {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL not set");
    return new ConvexHttpClient(url);
}

async function verifyAdminSession(client: ConvexHttpClient, request: NextRequest) {
    const token = request.headers.get("x-auth-token") ?? null;
    if (!token) return null;
    const user = await client.query(api.auth.getCurrentUser, { token });
    if (!user || user.role !== "admin") return null;
    return { user, token };
}

/**
 * DELETE /api/media/delete
 * Body: JSON { ids: string[] }  — Convex document IDs to delete
 *
 * For each ID we:
 *  1. Look up the media record in Convex to get the R2 key (storageId)
 *  2. Delete the R2 object via AWS SDK
 *  3. Delete the Convex record
 */
export async function DELETE(request: NextRequest) {
    const client = getConvexClient();

    const auth = await verifyAdminSession(client, request);
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }
    const { token } = auth;

    try {
        const { ids } = (await request.json()) as { ids: string[] };

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "No IDs provided." }, { status: 400 });
        }

        const results: { id: string; ok: boolean; error?: string }[] = [];

        for (const id of ids) {
            try {
                // 1. Fetch the record so we know the R2 key
                const item = await client.query(api.media.getById, { id: id as any });

                if (item) {
                    // 2. Delete from R2 (storageId holds the R2 object key)
                    // Skip if storageId looks like a full URL (legacy records)
                    const r2Key = item.storageId;
                    if (r2Key && !r2Key.startsWith("http")) {
                        await deleteFromR2(r2Key);
                    }
                }

                // 3. Delete the Convex record regardless
                await client.mutation(api.media.remove, { id: id as any, token });

                results.push({ id, ok: true });
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error(`[Delete] Failed for id=${id}:`, msg);
                results.push({ id, ok: false, error: msg });
            }
        }

        const failed = results.filter((r) => !r.ok);
        return NextResponse.json({
            success: true,
            deleted: results.filter((r) => r.ok).length,
            failed: failed.length,
            errors: failed,
        });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[Media Delete Error]", msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
