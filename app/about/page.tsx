export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { aboutPageData } from "@/data/about-page-data";

import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    let page = null;
    let settings = null;
    try {
        page = await fetchQuery(api.pages.getPublishedPage, { path: "/about" });
        settings = await fetchQuery(api.siteSettings.getSiteSettings);
    } catch (e) {}

    return buildMetadata("/about", {
        title: page?.title || (settings as any)?.siteTitle,
        description: page?.description || "Learn about Nature's Boon's B2B manufacturing excellence and heritage.",
    });
}

export default function AboutPage() {
    return <CmsPageRenderer path="/about" fallbackData={aboutPageData} />;
}
