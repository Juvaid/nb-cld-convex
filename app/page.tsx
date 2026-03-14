export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import homePageData from "@/data/home-page-data.json";
import { generatePageMetadata } from "@/lib/generatePageMetadata";
import { PageRecord } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
    const page = await fetchQuery(api.pages.getPublishedPage, { path: "/" });
    if (!page) {
        return {};
    }
    return generatePageMetadata(page as PageRecord, "/");
}

export default function HomePage() {
    return (
        <>
            <CmsPageRenderer path="/" fallbackData={homePageData} />
        </>
    );
}
