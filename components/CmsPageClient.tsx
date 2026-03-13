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
    const [minPlayElapsed, setMinPlayElapsed] = useState(false);
    
    useEffect(() => { 
        setIsClient(true); 
        // Force minimum loading animation on home page
        if (path === "/") {
            const timer = setTimeout(() => setMinPlayElapsed(true), 3500);
            return () => clearTimeout(timer);
        } else {
            setMinPlayElapsed(true);
        }
    }, [path]);

    // Live data hooks — "skip" on server by passing undefined args when not client-mounted
    const livePage = useQuery(api.pages.getPublishedPage, isClient ? { path } : "skip");
    const liveSettings = useQuery(api.siteSettings.getSiteSettings, isClient ? undefined : "skip");

    // Resolve: live data wins once available, otherwise use server-pre-fetched data
    const page = (livePage !== undefined ? livePage : initialPageData);
    const siteSettings = (liveSettings !== undefined ? liveSettings : initialSettings);

    // Show high-quality loader on Home Page
    if (path === "/" && (!minPlayElapsed || (page === undefined && !fallbackData))) {
        return <LoadingAnimation />;
    }

    // Show simple skeleton on other pages if data is still missing
    if (page === undefined && !fallbackData) {
        return (
            <div className="min-h-screen bg-white p-8 space-y-8 animate-pulse">
                <div className="h-12 w-1/3 bg-slate-100 rounded-2xl" />
                <div className="h-64 w-full bg-slate-100 rounded-[40px]" />
                <div className="grid grid-cols-3 gap-8">
                    <div className="h-32 bg-slate-50 rounded-3xl" />
                    <div className="h-32 bg-slate-50 rounded-3xl" />
                    <div className="h-32 bg-slate-50 rounded-3xl" />
                </div>
            </div>
        );
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

