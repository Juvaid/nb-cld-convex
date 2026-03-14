"use client";

import { useState, useEffect } from "react";
import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PuckRenderer } from "@/components/PuckRenderer";

/**
 * Inner component that attaches to live Convex data.
 * This only runs on the client.
 */
function LiveContent({
    preloadedPageData,
    preloadedSettings,
    preloadedStats,
    preloadedCategories,
    preloadedProducts,
    useDynamicData,
    fallbackData
}: any) {
    const livePage = usePreloadedQuery(preloadedPageData);
    const liveSettings = usePreloadedQuery(preloadedSettings);
    const liveStats = usePreloadedQuery(preloadedStats);
    const liveCategories = preloadedCategories ? usePreloadedQuery(preloadedCategories) : null;
    const liveProducts = preloadedProducts ? usePreloadedQuery(preloadedProducts) : null;

    let displayData = null;
    if (livePage?.data) {
        try {
            const parsed = typeof livePage.data === "string" ? JSON.parse(livePage.data) : livePage.data;
            if (parsed?.content?.length > 0) displayData = parsed;
        } catch (e) {
            console.error("Failed to parse CMS page data", e);
        }
    }

    if (!displayData && fallbackData) {
        displayData = fallbackData;
    }

    return (
        <PuckRenderer
            data={displayData || { root: {}, content: [] }}
            initialData={{
                initialDbCategories: liveCategories,
                initialDbProducts: liveProducts,
                globalStats: liveStats,
                useDynamicData: useDynamicData ?? true,
            }}
            siteSettings={liveSettings}
        />
    );
}

export function CmsPageClient({
    fallbackData,
    path,
    useDynamicData,
    preloadedPageData,
    preloadedSettings,
    preloadedStats,
    preloadedCategories,
    preloadedProducts,
    initialPage,
    initialSettings,
    initialStats,
    initialCategories,
    initialProducts,
}: {
    fallbackData: any;
    path: string;
    useDynamicData?: boolean;
    preloadedPageData: Preloaded<typeof api.pages.getPublishedPage>;
    preloadedSettings: Preloaded<typeof api.siteSettings.getSiteSettings>;
    preloadedStats: Preloaded<typeof api.siteData.getStats>;
    preloadedCategories?: Preloaded<typeof api.categories.list>;
    preloadedProducts?: Preloaded<typeof api.products.listAll>;
    initialPage?: any;
    initialSettings?: any;
    initialStats?: any;
    initialCategories?: any;
    initialProducts?: any;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // 1. Server-side render (or first client pass): Use static data
    if (!mounted) {
        let displayData = null;
        if (initialPage?.data) {
            try {
                const parsed = typeof initialPage.data === "string" ? JSON.parse(initialPage.data) : initialPage.data;
                if (parsed?.content?.length > 0) displayData = parsed;
            } catch (e) {}
        }

        if (!displayData && fallbackData) displayData = fallbackData;

        return (
            <div className="min-h-screen bg-background">
                <PuckRenderer
                    data={displayData || { root: {}, content: [] }}
                    initialData={{
                        initialDbCategories: initialCategories,
                        initialDbProducts: initialProducts,
                        globalStats: initialStats,
                        useDynamicData: useDynamicData ?? true,
                    }}
                    siteSettings={initialSettings}
                />
            </div>
        );
    }

    // 2. Client-side: Attach to live Convex stream
    return (
        <div className="min-h-screen bg-background">
            <LiveContent
                preloadedPageData={preloadedPageData}
                preloadedSettings={preloadedSettings}
                preloadedStats={preloadedStats}
                preloadedCategories={preloadedCategories}
                preloadedProducts={preloadedProducts}
                useDynamicData={useDynamicData}
                fallbackData={fallbackData}
            />
        </div>
    );
}

