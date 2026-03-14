import { DynamicCmsPageClient as CmsPageClient } from "@/components/DynamicClients";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

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
    // PRELOAD everything on the server to avoid CSR/SSR bails
    const preloadedPageData = await preloadQuery(api.pages.getPublishedPage, { path });
    const preloadedSettings = await preloadQuery(api.siteSettings.getSiteSettings);
    const preloadedStats = await preloadQuery(api.siteData.getStats);
    
    let preloadedCategories = null;
    let preloadedProducts = null;

    // Fetch catalog data if we're on the products page OR the page data hints at it
    // We can't access page data content yet since preloadQuery returns a handle, 
    // but the /products path check is a solid start for SSR indexing.
    if (useDynamicData || path === "/products") {
        preloadedCategories = await preloadQuery(api.categories.list);
        preloadedProducts = await preloadQuery(api.products.listAll, { status: "active" });
    }

    return (
        <>
            <CmsPageClient
                path={path}
                fallbackData={fallbackData}
                useDynamicData={useDynamicData}
                preloadedPageData={preloadedPageData}
                preloadedSettings={preloadedSettings}
                preloadedStats={preloadedStats}
                preloadedCategories={preloadedCategories as any}
                preloadedProducts={preloadedProducts as any}
            />
        </>
    );
}

