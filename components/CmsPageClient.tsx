"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PuckRenderer } from "@/components/PuckRenderer";
import { LoadingAnimation } from "@/components/animations/LoadingAnimation";

export function CmsPageClient({
    fallbackData,
    path,
    initialPageData,
    useDynamicData,
    siteSettings: initialSettings,
}: {
    fallbackData: any;
    path: string;
    initialPageData?: any;
    useDynamicData?: boolean;
    siteSettings?: any;
}) {
    // Live data hooks
    const livePage = useQuery(api.pages.getPublishedPage, { path });
    const liveSettings = useQuery(api.siteSettings.getSiteSettings);
    
    // Resolve page data: use live data if available, otherwise initial data, finally fallback data
    const page = livePage !== undefined ? livePage : initialPageData;
    const siteSettings = liveSettings !== undefined ? liveSettings : initialSettings;

    // Show Premium Loader while Convex is fetching (page is strictly undefined)
    if (page === undefined) {
        return <LoadingAnimation />;
    }

    let liveData = null;
    
    // 1. Try Live/Initial Convex Data
    if (page?.data) {
        try {
            const parsed = typeof page.data === "string" ? JSON.parse(page.data) : page.data;
            if (parsed?.content?.length > 0) liveData = parsed;
        } catch (e) {
            console.error("Failed to parse CMS page data", e);
        }
    }

    // 2. Fallback to passed fallbackData if Convex data is empty or failed
    if (!liveData && fallbackData) {
        liveData = fallbackData;
    }

    // Inject useDynamicData into initialPageData so ProductBrowser can pick it up
    const enrichedPageData = {
        ...(initialPageData || {}),
        useDynamicData: useDynamicData ?? true, // Always use dynamic data when passed via props
    };

    return (
        <div className="min-h-screen bg-background">
            <PuckRenderer
                data={liveData || { root: {}, content: [] }}
                initialData={enrichedPageData}
                siteSettings={siteSettings}
            />
        </div>
    );
}
