export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { servicesPageData } from "@/data/services-page-data";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export async function generateMetadata(): Promise<Metadata> {
    try {
        const page = await convex.query(api.pages.getPublishedPage, { path: "/services" });
        const settings = await convex.query(api.siteSettings.getSiteSettings);
        const siteName = (settings as any)?.siteTitle || "Nature's Boon";

        if (page) {
            const puckData = page.data ? JSON.parse(page.data) : null;
            const firstBlock = puckData?.content?.[0];
            const title = firstBlock?.props?.title || "Services";

            return {
                title: `${title} | ${siteName}`,
                description: "End-to-end private label and contract manufacturing services.",
                openGraph: {
                    title: `${title} | ${siteName}`,
                    description: "End-to-end private label and contract manufacturing services.",
                    type: "website",
                    siteName,
                },
            };
        }
    } catch { /* fall through to defaults */ }

    return {
        title: "Services | Nature's Boon",
        description: "End-to-end private label and contract manufacturing services.",
    };
}

export default function ServicesPage() {
    return <CmsPageRenderer path="/services" fallbackData={servicesPageData} />;
}
