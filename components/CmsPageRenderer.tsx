import { DynamicCmsPageClient as CmsPageClient } from "@/components/DynamicClients";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

interface CmsPageRendererProps {
    /** The canonical path, e.g. "/about" */
    path: string;
    /** Static fallback data to use when no CMS page exists for this path */
    fallbackData?: any;
    /** If true, ProductBrowser blocks will fetch live data from Convex instead of using static props */
    useDynamicData?: boolean;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

/**
 * Server component wrapper for CMS pages.
 * Fetches initial data server-side for SEO and passes it to the client component.
 */
export async function CmsPageRenderer({ path, fallbackData, useDynamicData }: CmsPageRendererProps) {
    let initialPageData: any = null;
    let initialDbCategories = null;
    let initialDbProducts = null;
    let siteSettings = null;
    let lcpImage: { src: string; alt: string } | null = null;

    try {
        initialPageData = await convex.query(api.pages.getPublishedPage, { path });
        siteSettings = await convex.query(api.siteSettings.getSiteSettings);

        // If this page contains the ProductBrowser (like /products), pre-fetch the catalog data for SEO
        if (useDynamicData || path === "/products" || initialPageData?.data?.includes('"ProductBrowser"')) {
            initialDbCategories = await convex.query(api.categories.list);
            initialDbProducts = await convex.query(api.products.listAll, { status: "active" });
        }

        // LCP Optimization: Pre-parse the Puck data to find the first Hero image and preload it
        if (initialPageData?.data) {
            try {
                const puckData = JSON.parse(initialPageData.data);
                const firstBlock = puckData?.content?.[0];
                
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
                            src: imageId.startsWith("http") ? imageId : `/api/storage/${imageId}`,
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

    return (
        <>
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
                    initialDbProducts
                }}
            />
        </>
    );
}
