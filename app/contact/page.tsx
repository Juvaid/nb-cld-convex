export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { contactPageData } from "@/data/contact-page-data";

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    try {
        settings = await fetchQuery(api.siteSettings.getSiteSettings);
    } catch (e) {}

    const siteName = (settings as any)?.siteTitle;

    return buildMetadata("/contact", {
        title: siteName ? `Contact | ${siteName}` : undefined,
        description: siteName ? `Get in touch with ${siteName} for B2B inquiry and partnership.` : undefined,
    });
}

export default function ContactPage() {
    return <CmsPageRenderer path="/contact" fallbackData={contactPageData} />;
}
