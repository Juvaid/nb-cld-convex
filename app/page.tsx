export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import homePageData from "@/data/home-page-data.json";
import { NextSeo } from 'next-seo';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    try {
        settings = await convex.query(api.siteSettings.getSiteSettings);
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
