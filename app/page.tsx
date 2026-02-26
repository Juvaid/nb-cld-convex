import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import homePageData from "@/data/home-page-data.json";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata(): Promise<Metadata> {
    try {
        const settings = await convex.query(api.siteSettings.getSiteSettings);
        return {
            title: (settings as any)?.siteTitle || "NatureBoon | Premium Manufacturing Platform",
            description: (settings as any)?.footerDescription || "Next-generation B2B manufacturing platform for premium personal care.",
        };
    } catch {
        return {
            title: "NatureBoon | Premium Manufacturing Platform",
            description: "Next-generation B2B manufacturing platform for premium personal care.",
        };
    }
}

export default function HomePage() {
    return <CmsPageRenderer path="/" fallbackData={homePageData} />;
}
