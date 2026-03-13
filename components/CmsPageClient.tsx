"use client";

import { useState, useEffect } from "react";
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
    // Only activate live queries AFTER the client has mounted and the WebSocket
    // is ready. This prevents the SSR/hydration render from showing a loader.
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    // Live data hooks — "skip" on server by passing undefined args when not client-mounted
    const livePage = useQuery(api.pages.getPublishedPage, isClient ? { path } : "skip");
    const liveSettings = useQuery(api.siteSettings.getSiteSettings, isClient ? undefined : "skip");

    // Resolve: live data wins once available, otherwise use server-pre-fetched data
    const page = (livePage !== undefined ? livePage : initialPageData);
    const siteSettings = (liveSettings !== undefined ? liveSettings : initialSettings);

    // Show loader ONLY if we have zero data (no server pre-fetch AND no live data yet)
    if (page === undefined && !fallbackData) {
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
        useDynamicData: useDynamicData ?? true,
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

