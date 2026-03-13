export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { DynamicBlogsClient as BlogsClient } from "@/components/DynamicClients";

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    try {
        settings = await fetchQuery(api.siteSettings.getSiteSettings);
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
        settings = await fetchQuery(api.siteSettings.getSiteSettings);
    } catch (e) {
        console.error("Failed to fetch settings for blogs page", e);
    }

    return <BlogsClient initialSettings={settings} />;
}
