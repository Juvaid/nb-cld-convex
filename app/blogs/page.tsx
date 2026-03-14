export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { DynamicBlogsClient as BlogsClient } from "@/components/DynamicClients";
import { generatePageMetadata } from "@/lib/generatePageMetadata";
import { PageRecord } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
    const page = await fetchQuery(api.pages.getPublishedPage, { path: "/blogs" });
    if (!page) {
        return {};
    }
    return generatePageMetadata(page as PageRecord, "/blogs");
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
