import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { BlogsClient } from "./BlogsClient";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function BlogsPage() {
    let settings = null;
    try {
        settings = await convex.query(api.siteSettings.getSiteSettings);
    } catch (e) {
        console.error("Failed to fetch settings for blogs page", e);
    }

    return <BlogsClient initialSettings={settings} />;
}
