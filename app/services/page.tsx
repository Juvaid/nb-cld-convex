export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { servicesPageData } from "@/data/services-page-data";

import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    let page = null;
    let settings = null;
    try {
        page = await fetchQuery(api.pages.getPublishedPage, { path: "/services" });
        settings = await fetchQuery(api.siteSettings.getSiteSettings);
    } catch (e) {}

    return buildMetadata("/services", {
        title: page?.title || (settings as any)?.siteTitle,
        description: page?.description || "End-to-end private label and contract manufacturing services.",
    });
}

export default function ServicesPage() {
    return <CmsPageRenderer path="/services" fallbackData={servicesPageData} />;
}
