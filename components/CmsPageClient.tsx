"use client";

import { PuckRenderer } from "@/components/PuckRenderer";

/**
 * Client component that receives pre-fetched CMS page data and renders it via Puck.
 * Must be a client component because PuckRenderer uses context (Framer Motion, etc.).
 */
export function CmsPageClient({ data }: { data: any }) {
    return (
        <div className="min-h-screen">
            <PuckRenderer data={data} />
        </div>
    );
}
