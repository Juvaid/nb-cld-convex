import { CmsPageClient } from "@/components/CmsPageClient";

interface CmsPageRendererProps {
    /** The canonical path, e.g. "/about" */
    path: string;
    /** Static fallback data to use when no CMS page exists for this path */
    fallbackData: any;
}

/**
 * Server component wrapper for CMS pages.
 * Simply passes data down to the CmsPageClient to allow for client-side live fetching with Skeleton states.
 */
export async function CmsPageRenderer({ path, fallbackData }: CmsPageRendererProps) {
    return <CmsPageClient path={path} fallbackData={fallbackData} />;
}
