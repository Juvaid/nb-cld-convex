export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { aboutPageData } from "@/data/about-page-data";
import { generatePageMetadata } from "@/lib/generatePageMetadata";
import { PageRecord } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
    const page = await fetchQuery(api.pages.getPublishedPage, { path: "/about" });
    if (!page) {
        return {};
    }
    return generatePageMetadata(page as PageRecord, "/about");
}

export default function AboutPage() {
    return <CmsPageRenderer path="/about" fallbackData={aboutPageData} />;
}
