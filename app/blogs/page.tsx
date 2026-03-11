export const dynamic = "force-dynamic";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { DynamicBlogsClient as BlogsClient } from "@/components/DynamicClients";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export default async function BlogsPage() {
    let settings = null;
    try {
        settings = await convex.query(api.siteSettings.getSiteSettings);
    } catch (e) {
        console.error("Failed to fetch settings for blogs page", e);
    }

    return <BlogsClient initialSettings={settings} />;
}
