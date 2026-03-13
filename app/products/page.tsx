export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { productsPageData } from "@/data/products-page-data";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    try {
        settings = await convex.query(api.siteSettings.getSiteSettings);
    } catch (e) {}

    return buildMetadata("/products", {
        title: (settings as any)?.siteTitle ? `Our Products | ${(settings as any).siteTitle}` : undefined,
        description: "Browse our full B2B personal care product catalog.",
    });
}

export default function ProductsPage() {
    return <CmsPageRenderer path="/products" fallbackData={productsPageData} useDynamicData />;
}
