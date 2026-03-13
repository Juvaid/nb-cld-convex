export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { aboutPageData } from "@/data/about-page-data";

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata(): Promise<Metadata> {
    let page = null;
    let settings = null;
    try {
        page = await fetchQuery(api.pages.getPublishedPage, { path: "/about" });
        settings = await fetchQuery(api.siteSettings.getSiteSettings);
    } catch (e) {}

    const puckData = page?.data ? (typeof page.data === "string" ? JSON.parse(page.data) : page.data) : null;
    const firstBlock = puckData?.content?.[0];
    const convexTitle = firstBlock?.props?.title;
    const siteName = (settings as any)?.siteTitle;

    return buildMetadata("/about", {
        title: convexTitle && siteName ? `${convexTitle} | ${siteName}` : convexTitle,
        description: "Learn about Nature's Boon's B2B manufacturing excellence and heritage.",
    });
}

export default function AboutPage() {
    return <CmsPageRenderer path="/about" fallbackData={aboutPageData} />;
}
