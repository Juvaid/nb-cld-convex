import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import ProductDetail from "@/components/scraped/ProductDetail";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const product = await convex.query(api.products.getBySlug, { slug });
        if (product) {
            return {
                title: `${product.name} | NatureBoon`,
                description: product.description || `Buy ${product.name} from NatureBoon B2B catalog.`,
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
    return <ProductDetail slug={slug} />;
}
