import { DynamicCmsPageClient as CmsPageClient } from "@/components/DynamicClients";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { SeoContentSnapshot } from "@/components/SeoContentSnapshot";

interface CmsPageRendererProps {
    /** The canonical path, e.g. "/about" */
    path: string;
    /** Static fallback data to use when no CMS page exists for this path */
    fallbackData?: any;
    /** If true, ProductBrowser blocks will fetch live data from Convex instead of using static props */
    useDynamicData?: boolean;
}

/**
 * Server component wrapper for CMS pages.
 * Fetches initial data server-side for SEO and passes it to the client component.
 */
export async function CmsPageRenderer({ path, fallbackData, useDynamicData }: CmsPageRendererProps) {
    let initialPageData: any = null;
    let initialDbCategories = null;
    let initialDbProducts = null;
    let siteSettings = null;
    let globalStats = null;
    let lcpImage: { src: string; alt: string } | null = null;
    let parsedPuckData: any = null;

    try {
        initialPageData = await fetchQuery(api.pages.getPublishedPage, { path });
        siteSettings = await fetchQuery(api.siteSettings.getSiteSettings);

        // Fetch global stats for ModernStats / ModernHero blocks (SSR-safe)
        globalStats = await fetchQuery(api.siteData.getStats);

        // If this page contains the ProductBrowser (like /products), pre-fetch the catalog data for SEO
        if (useDynamicData || path === "/products" || initialPageData?.data?.includes('"ProductBrowser"')) {
            initialDbCategories = await fetchQuery(api.categories.list);
            initialDbProducts = await fetchQuery(api.products.listAll, { status: "active" });
        }

        // Parse Puck data for both LCP optimization and SEO snapshot
        if (initialPageData?.data) {
            try {
                parsedPuckData = typeof initialPageData.data === "string"
                    ? JSON.parse(initialPageData.data)
                    : initialPageData.data;

                const firstBlock = parsedPuckData?.content?.[0];
                
                if (firstBlock) {
                    let imageId = "";
                    const props = firstBlock.props || {};
                    
                    // Check common Hero block types and their image property names
                    if (firstBlock.type === "HeroCarousel") {
                        const firstSlide = props.slides?.[0];
                        imageId = firstSlide?.mobileImage || firstSlide?.image;
                    } else if (firstBlock.type === "NatureBoonHero" || firstBlock.type === "ModernHero" || firstBlock.type === "Hero") {
                        imageId = props.image;
                    }

                    if (imageId) {
                        lcpImage = {
                            src: imageId.startsWith("http") || imageId.startsWith("/") ? imageId : `/api/storage/${imageId}`,
                            alt: props.title || "Hero image"
                        };
                    }
                }
            } catch (err) {
                // Silently fail parsing for LCP optimization
            }
        }
    } catch (e) {
        console.error("Failed to fetch CMS page data on server", e);
    }

    // Use fallback data for SEO snapshot if no Convex data
    const snapshotData = parsedPuckData || fallbackData;

    return (
        <>
            {/* 
              SEO Content Snapshot — Server-rendered semantic HTML for crawlers.
              Always in the page source, visually hidden with sr-only.
            */}
            {snapshotData && (
                <SeoContentSnapshot
                    puckData={snapshotData}
                    products={initialDbProducts}
                    categories={initialDbCategories}
                    globalStats={globalStats}
                    path={path}
                />
            )}

            {/* 
              Preload the Hero image found in Puck data. 
              This Link rel="preload" is inserted into the head by Next.js <Image priority /> 
              even though the main component is loaded with ssr: false.
            */}
            {lcpImage && (
                <div className="hidden pointer-events-none" aria-hidden="true">
                    <Image 
                        src={lcpImage.src} 
                        alt={lcpImage.alt}
                        width={1200}
                        height={600}
                        priority
                        className="opacity-0"
                    />
                </div>
            )}
            <CmsPageClient
                path={path}
                fallbackData={fallbackData}
                useDynamicData={useDynamicData}
                siteSettings={siteSettings}
                initialPageData={{
                    ...initialPageData,
                    initialDbCategories,
                    initialDbProducts,
                    globalStats,
                }}
            />
        </>
    );
}

