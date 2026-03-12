export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { DynamicBlogsClient as BlogsClient } from "@/components/DynamicClients";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export async function generateMetadata(): Promise<Metadata> {
    try {
        const settings = await convex.query(api.siteSettings.getSiteSettings);
        const siteName = (settings as any)?.siteTitle || "Nature's Boon";

        return {
            title: `Blog | ${siteName}`,
            description: `Insights and stories from the world of personal care manufacturing by ${siteName}.`,
            openGraph: {
                title: `Blog | ${siteName}`,
                description: `Insights and stories from the world of personal care manufacturing.`,
                type: "website",
                siteName,
            },
        };
    } catch { /* fall through to defaults */ }

    return {
        title: "Blog | Nature's Boon",
        description: "Insights and stories from the world of personal care manufacturing.",
    };
}

export default async function BlogsPage() {
    let settings = null;
    try {
        settings = await convex.query(api.siteSettings.getSiteSettings);
    } catch (e) {
        console.error("Failed to fetch settings for blogs page", e);
    }

    return <BlogsClient initialSettings={settings} />;
}
