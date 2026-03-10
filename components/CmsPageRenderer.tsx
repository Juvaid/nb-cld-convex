import { CmsPageClient } from "@/components/CmsPageClient";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

interface CmsPageRendererProps {
    /** The canonical path, e.g. "/about" */
    path: string;
    /** Static fallback data to use when no CMS page exists for this path */
    fallbackData?: any;
    /** If true, ProductBrowser blocks will fetch live data from Convex instead of using static props */
    useDynamicData?: boolean;
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Server component wrapper for CMS pages.
 * Fetches initial data server-side for SEO and passes it to the client component.
 */
export async function CmsPageRenderer({ path, fallbackData, useDynamicData }: CmsPageRendererProps) {
    let initialPageData = null;
    let initialDbCategories = null;
    let initialDbProducts = null;
    let siteSettings = null;

    try {
        initialPageData = await convex.query(api.pages.getPublishedPage, { path });
        siteSettings = await convex.query(api.siteSettings.getSiteSettings);

        // If this page contains the ProductBrowser (like /products), pre-fetch the catalog data for SEO
        if (useDynamicData || path === "/products" || initialPageData?.data?.includes('"ProductBrowser"')) {
            initialDbCategories = await convex.query(api.categories.list);
            initialDbProducts = await convex.query(api.products.listAll, { status: "active" });
        }
    } catch (e) {
        console.error("Failed to fetch CMS page data on server", e);
    }

    return (
        <CmsPageClient
            path={path}
            fallbackData={fallbackData}
            useDynamicData={useDynamicData}
            siteSettings={siteSettings}
            initialPageData={{
                ...initialPageData,
                initialDbCategories,
                initialDbProducts
            }}
        />
    );
}
