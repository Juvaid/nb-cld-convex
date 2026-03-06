import type { Metadata } from "next";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { productsPageData } from "@/data/products-page-data";

export const metadata: Metadata = {
    title: "Our Products | NatureBoon",
    description: "Browse our full B2B personal care product catalog.",
};

export default function ProductsPage() {
    // useDynamicData=true makes the ProductBrowser component fetch live from Convex
    // instead of using the hardcoded fallback in productsPageData
    return <CmsPageRenderer path="/products" fallbackData={productsPageData} useDynamicData />;
}

