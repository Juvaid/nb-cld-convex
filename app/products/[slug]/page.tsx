import type { Metadata } from 'next';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import ProductDetail from '@/components/blocks/ProductDetail';
import { generateProductMetadata } from '@/lib/generatePageMetadata';
import { ProductRecord } from '@/types';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = await fetchQuery(api.products.getBySlug, { slug });
    if (!product) {
        return {};
    }
    return generateProductMetadata(product as ProductRecord, `/products/${slug}`);
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const initialProduct = await fetchQuery(api.products.getBySlug, { slug });

    return (
        <ProductDetail
            slug={slug}
            initialProduct={initialProduct}
            showHeaderFooter={true}
        />
    );
}
