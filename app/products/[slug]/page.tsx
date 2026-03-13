export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import ProductDetail from "@/components/blocks/ProductDetail";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);


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

    return (
        <>
            {/* Server-rendered SEO content — visible in page source for crawlers */}
            {initialProduct && (
                <article className="sr-only" itemScope itemType="https://schema.org/Product">
                    <h1 itemProp="name">{initialProduct.name}</h1>
                    {initialProduct.description && <p itemProp="description">{initialProduct.description}</p>}
                    {initialProduct.sku && <meta itemProp="sku" content={initialProduct.sku} />}
                    {initialProduct.tags?.[0] && <meta itemProp="category" content={initialProduct.tags[0]} />}
                    {initialProduct.images?.[0] && (
                        <meta itemProp="image" content={
                            initialProduct.images[0].startsWith("http") 
                                ? initialProduct.images[0] 
                                : `${process.env.NEXT_PUBLIC_SITE_URL || "https://new.naturesboon.net"}/api/storage/${initialProduct.images[0]}`
                        } />
                    )}
                    <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
                        <meta itemProp="name" content="Nature's Boon" />
                    </div>
                    <div itemProp="manufacturer" itemScope itemType="https://schema.org/Organization">
                        <meta itemProp="name" content="Nature's Boon" />
                    </div>
                </article>
            )}
            <ProductDetail slug={slug} initialProduct={initialProduct} showHeaderFooter={true} />
        </>
    );
}
