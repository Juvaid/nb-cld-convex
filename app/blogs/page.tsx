export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { DynamicBlogsClient as BlogsClient } from "@/components/DynamicClients";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    try {
        settings = await convex.query(api.siteSettings.getSiteSettings);
    } catch (e) {}

    const siteName = (settings as any)?.siteTitle;

    return buildMetadata("/blogs", {
        title: siteName ? `Blog | ${siteName}` : undefined,
        description: siteName ? `Insights and stories from the world of personal care manufacturing by ${siteName}.` : undefined,
    });
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
