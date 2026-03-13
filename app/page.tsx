export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import homePageData from "@/data/home-page-data.json";

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    try {
        settings = await fetchQuery(api.siteSettings.getSiteSettings);
    } catch (e) {
        // Fallback used in buildMetadata
    }

    return buildMetadata("/", {
        title: (settings as any)?.siteTitle,
        description: (settings as any)?.footerDescription,
    });
}

export default function HomePage() {
    return (
        <>
            <CmsPageRenderer path="/" fallbackData={homePageData} />
        </>
    );
}
