import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import ProductDetail from "@/components/blocks/ProductDetail";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const product = await convex.query(api.products.getBySlug, { slug });
        if (product) {
            const title = `${product.name} | NatureBoon`;
            const description = product.description || `Buy ${product.name} from NatureBoon B2B catalog.`;
            const imageUrl = product.images?.[0] || undefined;

            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    type: "website",
                    siteName: "NatureBoon",
                    ...(imageUrl && { images: [{ url: imageUrl }] }),
                }
            };
        }
    } catch { /* fall through to defaults */ }

    return {
        title: "Product | NatureBoon",
        description: "Premium B2B Manufacturing - NatureBoon",
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
