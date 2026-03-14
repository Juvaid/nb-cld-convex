export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { contactPageData } from "@/data/contact-page-data";

import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    let settings = null;
    let page = null;
    try {
        [settings, page] = await Promise.all([
            fetchQuery(api.siteSettings.getSiteSettings),
            fetchQuery(api.pages.getPublishedPage, { path: "/contact" })
        ]);
    } catch (e) {}

    return buildMetadata("/contact", {
        title: page?.title || ((settings as any)?.siteTitle ? `Contact | ${(settings as any).siteTitle}` : undefined),
        description: page?.description || ((settings as any)?.siteTitle ? `Get in touch with ${(settings as any).siteTitle} for B2B inquiry and partnership.` : undefined),
    });
}

export default function ContactPage() {
    return <CmsPageRenderer path="/contact" fallbackData={contactPageData} />;
}
