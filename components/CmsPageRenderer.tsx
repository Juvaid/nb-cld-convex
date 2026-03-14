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
    // PRELOAD handles for the client to attach to live data
    const preloadedPageData = await preloadQuery(api.pages.getPublishedPage, { path });
    const preloadedSettings = await preloadQuery(api.siteSettings.getSiteSettings);
    const preloadedStats = await preloadQuery(api.siteData.getStats);
    
    // FETCH actual data for initial SSR markup
    const initialPage = await fetchQuery(api.pages.getPublishedPage, { path });
    const initialSettings = await fetchQuery(api.siteSettings.getSiteSettings);
    const initialStats = await fetchQuery(api.siteData.getStats);

    let preloadedCategories = null;
    let preloadedProducts = null;
    let initialCategories = null;
    let initialProducts = null;

    if (useDynamicData || path === "/products") {
        preloadedCategories = await preloadQuery(api.categories.list);
        preloadedProducts = await preloadQuery(api.products.listAll, { status: "active" });
        initialCategories = await fetchQuery(api.categories.list);
        initialProducts = await fetchQuery(api.products.listAll, { status: "active" });
    }

    const schema = initialPage ? getPageSchema(initialPage.schemaType || "none", initialPage as PageRecord, "https://new.naturesboon.net") : null;

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

