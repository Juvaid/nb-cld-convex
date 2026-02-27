"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PuckRenderer } from "@/components/PuckRenderer";
import { PageSkeleton } from "@/components/ui/Skeleton";

export function CmsPageClient({ fallbackData, path }: { fallbackData: any; path: string }) {
    const page = useQuery(api.pages.getPublishedPage, { path });

    // Show Skeleton while Convex is fetching (page is strictly undefined)
    if (page === undefined) {
        return <PageSkeleton />;
    }

    let liveData = null;
    if (page?.data) {
        try {
            const parsed = JSON.parse(page.data);
            if (parsed?.content?.length > 0) liveData = parsed;
        } catch (e) {
            console.error("Failed to parse CMS page data", e);
        }
    }

    // Render live data if available, otherwise just render an empty object so the layout works
    return (
        <div className="min-h-screen bg-background">
            <PuckRenderer data={liveData || { root: {}, content: [] }} />
        </div>
    );
}
