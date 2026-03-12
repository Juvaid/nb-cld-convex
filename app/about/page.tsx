export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { aboutPageData } from "@/data/about-page-data";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export async function generateMetadata(): Promise<Metadata> {
    try {
        const page = await convex.query(api.pages.getPublishedPage, { path: "/about" });
        const settings = await convex.query(api.siteSettings.getSiteSettings);
        const siteName = (settings as any)?.siteTitle || "Nature's Boon";

        if (page) {
            const puckData = page.data ? JSON.parse(page.data) : null;
            const firstBlock = puckData?.content?.[0];
            const title = firstBlock?.props?.title || "About Us";

            return {
                title: `${title} | ${siteName}`,
                description: "Learn about Nature's Boon's B2B manufacturing excellence and heritage.",
                openGraph: {
                    title: `${title} | ${siteName}`,
                    description: "Learn about Nature's Boon's B2B manufacturing excellence and heritage.",
                    type: "website",
                    siteName,
                },
            };
        }
    } catch { /* fall through to defaults */ }

    return {
        title: "About Us | Nature's Boon",
        description: "Learn about Nature's Boon's B2B manufacturing excellence and heritage.",
    };
}

export default function AboutPage() {
    return <CmsPageRenderer path="/about" fallbackData={aboutPageData} />;
}
