import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { productsPageData } from "@/data/products-page-data";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export async function generateMetadata(): Promise<Metadata> {
    try {
        const settings = await convex.query(api.siteSettings.getSiteSettings);
        const siteName = (settings as any)?.siteTitle || "NatureBoon";
        const categories = await convex.query(api.categories.list);
        const categoryNames = categories?.map((c: any) => c.name).join(", ") || "";

        return {
            title: `Our Products | ${siteName}`,
            description: `Browse our full B2B personal care product catalog. Categories: ${categoryNames}`,
            openGraph: {
                title: `Our Products | ${siteName}`,
                description: `Browse our full B2B personal care product catalog.`,
                type: "website",
                siteName,
            },
        };
    } catch { /* fall through to defaults */ }

    return {
        title: "Our Products | NatureBoon",
        description: "Browse our full B2B personal care product catalog.",
    };
}

export default function ProductsPage() {
    return <CmsPageRenderer path="/products" fallbackData={productsPageData} useDynamicData />;
}
