export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { servicesPageData } from "@/data/services-page-data";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata(): Promise<Metadata> {
    let page = null;
    let settings = null;
    try {
        page = await convex.query(api.pages.getPublishedPage, { path: "/services" });
        settings = await convex.query(api.siteSettings.getSiteSettings);
    } catch (e) {}

    const puckData = page?.data ? (typeof page.data === "string" ? JSON.parse(page.data) : page.data) : null;
    const firstBlock = puckData?.content?.[0];
    const convexTitle = firstBlock?.props?.title;
    const siteName = (settings as any)?.siteTitle;

    return buildMetadata("/services", {
        title: convexTitle && siteName ? `${convexTitle} | ${siteName}` : convexTitle,
        description: "End-to-end private label and contract manufacturing services.",
    });
}

export default function ServicesPage() {
    return <CmsPageRenderer path="/services" fallbackData={servicesPageData} />;
}
