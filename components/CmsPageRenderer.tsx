import { CmsPageClient } from "@/components/CmsPageClient";
import { preloadQuery, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getPageSchema } from "@/lib/getPageSchema";
import { PageRecord } from "@/types";

interface CmsPageRendererProps {
    /** The canonical path, e.g. "/about" */
    path: string;
    /** Static fallback data to use when no CMS page exists for this path */
    fallbackData?: any;
    /** If true, ProductBrowser blocks will fetch live data from Convex instead of using static props */
    useDynamicData?: boolean;
}

/**
 * Server component wrapper for CMS pages.
 * Fetches initial data server-side for SEO and passes it to the client component.
 */
export async function CmsPageRenderer({ path, fallbackData, useDynamicData }: CmsPageRendererProps) {
    let initialPage = null;
    let initialSettings = null;
    let initialStats = null;
    let initialCategories = null;
    let initialProducts = null;

    // PRELOAD handles for the client to attach to live data are generally fast and 
    // we want them to proceed to provide the best hydration experience.
    const preloadedPageData = await preloadQuery(api.pages.getPublishedPage, { path });
    const preloadedSettings = await preloadQuery(api.siteSettings.getSiteSettings);
    const preloadedStats = await preloadQuery(api.siteData.getStats);
    
    let preloadedCategories = null;
    let preloadedProducts = null;

    if (useDynamicData || path === "/products") {
        preloadedCategories = await preloadQuery(api.categories.list);
        preloadedProducts = await preloadQuery(api.products.listAll, { status: "active" });
    }

    try {
        // DEFENSIVE FETCH: Wrap all fetches in a single try/catch with a timeout
        // This ensures the page renders within a reasonable time even if Convex is slow.
        const timeout = (ms: number) => new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Convex fetch timeout")), ms)
        );
        
        // Fetch core site data
        const coreData = await Promise.race([
            Promise.all([
                fetchQuery(api.pages.getPublishedPage, { path }),
                fetchQuery(api.siteSettings.getSiteSettings),
                fetchQuery(api.siteData.getStats),
            ]),
            timeout(5000).then(() => [null, null, null])
        ]) as [any, any, any];

        [initialPage, initialSettings, initialStats] = coreData;

        // Fetch dynamic product data if needed
        if (useDynamicData || path === "/products") {
            const dynamicData = await Promise.race([
                Promise.all([
                    fetchQuery(api.categories.list),
                    fetchQuery(api.products.listAll, { status: "active" }),
                ]),
                timeout(5000).then(() => [null, null])
            ]) as [any, any];

            [initialCategories, initialProducts] = dynamicData;
        }
    } catch (e) {
        console.error(`[CmsPageRenderer] SSR fetch failed for ${path} after 5s or error:`, e);
        // All initial* vars stay null — client will hydrate with live data via preloaded handles
    }

    const schema = initialPage ? getPageSchema(initialPage.schemaType || "none", initialPage as PageRecord, "https://naturesboon.net") : null;

    return (
        <>
            {schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            )}
            <CmsPageClient
                path={path}
                fallbackData={fallbackData}
                useDynamicData={useDynamicData}
                preloadedPageData={preloadedPageData}
                preloadedSettings={preloadedSettings}
                preloadedStats={preloadedStats}
                preloadedCategories={preloadedCategories as any}
                preloadedProducts={preloadedProducts as any}
                initialPage={initialPage}
                initialSettings={initialSettings}
                initialStats={initialStats}
                initialCategories={initialCategories}
                initialProducts={initialProducts}
            />
        </>
    );
}


