export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { productsPageData } from "@/data/products-page-data";

import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    let page = null;
    try {
        [settings, page] = await Promise.all([
            fetchQuery(api.siteSettings.getSiteSettings),
            fetchQuery(api.pages.getPublishedPage, { path: "/products" })
        ]);
    } catch (e) {}

    return buildMetadata("/products", {
        title: page?.title || ((settings as any)?.siteTitle ? `Our Products | ${(settings as any).siteTitle}` : undefined),
        description: page?.description || "Browse our full B2B personal care product catalog.",
    });
}

export default function ProductsPage() {
    return <CmsPageRenderer path="/products" fallbackData={productsPageData} useDynamicData />;
}
