import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import ProductDetail from "@/components/blocks/ProductDetail";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

// Pre-render all known product pages at build time for faster crawling
export async function generateStaticParams() {
    try {
        const products = await convex.query(api.products.listNames);
        return (products || []).map((p: any) => ({ slug: p.slug || p._id }));
    } catch {
        return []; // Graceful fallback if Convex is unreachable during build
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const product = await convex.query(api.products.getBySlug, { slug });
        if (product) {
            const title = `${product.name} | Nature's Boon`;
            const description = product.description || `Buy ${product.name} from Nature's Boon B2B catalog.`;
            const imageUrl = product.images?.[0] || undefined;

            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    type: "website",
                    siteName: "Nature's Boon",
                    ...(imageUrl && { images: [{ url: imageUrl }] }),
                }
            };
        }
    } catch { /* fall through to defaults */ }

    return {
        title: "Product | Nature's Boon",
        description: "Premium B2B Manufacturing - Nature's Boon",
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let initialProduct = undefined;
    try {
        initialProduct = await convex.query(api.products.getBySlug, { slug });
    } catch (e) {
        console.error("Failed to fetch product on server", e);
    }

    return <ProductDetail slug={slug} initialProduct={initialProduct} showHeaderFooter={true} />;
}
