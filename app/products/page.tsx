export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { productsPageData } from "@/data/products-page-data";
import { generatePageMetadata } from "@/lib/generatePageMetadata";
import { PageRecord } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
    const page = await fetchQuery(api.pages.getPublishedPage, { path: "/products" });
    if (!page) {
        return {};
    }
    return generatePageMetadata(page as PageRecord, "/products");
}

export default function ProductsPage() {
    return <CmsPageRenderer path="/products" fallbackData={productsPageData} useDynamicData />;
}
