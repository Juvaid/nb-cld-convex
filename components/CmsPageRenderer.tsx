import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageClient } from "@/components/CmsPageClient";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface CmsPageRendererProps {
    /** The canonical path, e.g. "/about" */
    path: string;
    /** Static fallback data to use when no CMS page exists for this path */
    fallbackData: any;
}

/**
 * Server component — fetches the published CMS page for a given path.
 * Passes the resolved data down to the CmsPageClient (a "use client" component)
 * for rendering via PuckRenderer.
 *
 * This pattern avoids the `createContext in server component` error because
 * PuckRenderer (which uses Framer Motion / ThemeProvider context internally)
 * is only ever imported in CmsPageClient, not here.
 */
export async function CmsPageRenderer({ path, fallbackData }: CmsPageRendererProps) {
    let data: any = null;

    try {
        const page = await convex.query(api.pages.getPublishedPage, { path });
        if (page?.data) {
            const parsed = JSON.parse(page.data);
            // Only use CMS data if the page has actual content blocks
            if (parsed?.content?.length > 0) {
                data = parsed;
            }
        }
    } catch (error) {
        console.warn(`[CmsPageRenderer] Failed to fetch CMS page for "${path}":`, error);
    }

    // Fall back to static local data if no CMS data found
    const renderData = data || fallbackData;

    return <CmsPageClient data={renderData} />;
}
