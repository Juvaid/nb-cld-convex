"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PuckRenderer } from "@/components/PuckRenderer";
import { PageSkeleton } from "@/components/ui/Skeleton";

export function CmsPageClient({
    fallbackData,
    path,
    initialPageData,
    useDynamicData,
}: {
    fallbackData: any;
    path: string;
    initialPageData?: any;
    useDynamicData?: boolean;
}) {
    const livePage = useQuery(api.pages.getPublishedPage, { path });
    const page = livePage !== undefined ? livePage : initialPageData;

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

    // Inject useDynamicData into initialData so ProductBrowser can pick it up
    const enrichedInitialData = {
        ...initialPageData,
        useDynamicData: useDynamicData ?? true, // Always use dynamic data when passed via props
    };

    return (
        <div className="min-h-screen bg-background">
            <PuckRenderer data={liveData || { root: {}, content: [] }} initialData={enrichedInitialData} />
        </div>
    );
}

