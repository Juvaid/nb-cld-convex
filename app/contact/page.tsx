export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { contactPageData } from "@/data/contact-page-data";
import { generatePageMetadata } from "@/lib/generatePageMetadata";
import { PageRecord } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
    const page = await fetchQuery(api.pages.getPublishedPage, { path: "/contact" });
    if (!page) {
        return {};
    }
    return generatePageMetadata(page as PageRecord, "/contact");
}

export default function ContactPage() {
    return <CmsPageRenderer path="/contact" fallbackData={contactPageData} />;
}
