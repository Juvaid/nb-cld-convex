"use client";

import { useState, useEffect } from "react";
import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PuckRenderer } from "@/components/PuckRenderer";

export function CmsPageClient({
    fallbackData,
    path,
    useDynamicData,
    preloadedPageData,
    preloadedSettings,
    preloadedStats,
    preloadedCategories,
    preloadedProducts,
}: {
    fallbackData: any;
    path: string;
    useDynamicData?: boolean;
    preloadedPageData: Preloaded<typeof api.pages.getPublishedPage>;
    preloadedSettings: Preloaded<typeof api.siteSettings.getSiteSettings>;
    preloadedStats: Preloaded<typeof api.siteData.getStats>;
    preloadedCategories?: Preloaded<typeof api.categories.list>;
    preloadedProducts?: Preloaded<typeof api.products.listAll>;
}) {
    // 1. Consume preloaded data instantly from the server
    const page = usePreloadedQuery(preloadedPageData);
    const siteSettings = usePreloadedQuery(preloadedSettings);
    const globalStats = usePreloadedQuery(preloadedStats);
    
    // Optional catalog data
    const dbCategories = preloadedCategories ? usePreloadedQuery(preloadedCategories) : null;
    const dbProducts = preloadedProducts ? usePreloadedQuery(preloadedProducts) : null;

    let liveData = null;

    // Resolve: Convex Data wins, otherwise use fallbackData
    if (page?.data) {
        try {
            const parsed = typeof page.data === "string" ? JSON.parse(page.data) : page.data;
            if (parsed?.content?.length > 0) liveData = parsed;
        } catch (e) {
            console.error("Failed to parse CMS page data", e);
        }
    }

    if (!liveData && fallbackData) {
        liveData = fallbackData;
    }

    // Inject metadata for blocks like ProductBrowser
    const initialData = {
        initialDbCategories: dbCategories,
        initialDbProducts: dbProducts,
        globalStats,
        useDynamicData: useDynamicData ?? true,
    };

    return (
        <div className="min-h-screen bg-background">
            <PuckRenderer
                data={liveData || { root: {}, content: [] }}
                initialData={initialData}
                siteSettings={siteSettings}
            />
        </div>
    );
}

