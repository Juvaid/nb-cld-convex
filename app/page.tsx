export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import homePageData from "@/data/home-page-data.json";

import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    let page = null;
    try {
        [settings, page] = await Promise.all([
            fetchQuery(api.siteSettings.getSiteSettings),
            fetchQuery(api.pages.getPublishedPage, { path: "/" })
        ]);
    } catch (e) {
        // Fallback used in buildMetadata
    }

    return buildMetadata("/", {
        title: page?.title || (settings as any)?.siteTitle,
        description: page?.description || (settings as any)?.footerDescription,
    });
}

export default function HomePage() {
    return (
        <>
            <CmsPageRenderer path="/" fallbackData={homePageData} />
        </>
    );
}
