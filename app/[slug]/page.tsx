export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { generatePageMetadata } from "@/lib/generatePageMetadata";
import { PageRecord } from "@/types";

interface DynamicPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    props: DynamicPageProps
): Promise<Metadata> {
    const { slug } = await props.params;
    const path = `/${slug}`;

    const page = await fetchQuery(api.pages.getPublishedPage, { path });
    if (!page) {
        return {};
    }
    return generatePageMetadata(page as PageRecord, path);
}

export default async function DynamicCmsPage(props: DynamicPageProps) {
    const { slug } = await props.params;
    const path = `/${slug}`;

    return <CmsPageRenderer path={path} />;
}

