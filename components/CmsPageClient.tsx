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
    // SSR Guard: Safely return null if rendered in a non-browser environment where hooks might fail
    // However, we want to allow SSR to render initial data. 
    // If the error is specific to how useQuery behaves on Hostinger build env, we might need a tighter guard.
    // For now, let's stick to the force-dynamic fix as primary, and add a check before live data logic.

    // Live data hooks
    const livePage = useQuery(api.pages.getPublishedPage, { path });
    const liveSettings = useQuery(api.siteSettings.getSiteSettings);
    
    // Resolve page data
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
