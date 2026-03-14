import type { Metadata } from 'next';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import ProductDetail from '@/components/blocks/ProductDetail';
import { generateProductMetadata } from '@/lib/generatePageMetadata';
import { ProductRecord } from '@/types';

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const product = await fetchQuery(api.products.getBySlug, { slug: params.slug });
    if (!product) {
        return {};
    }
    return generateProductMetadata(product as ProductRecord, `/products/${params.slug}`);
}

export default async function ProductPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;

    const initialProduct = await fetchQuery(api.products.getBySlug, { slug });

    return (
        <ProductDetail
            slug={slug}
            initialProduct={initialProduct}
            showHeaderFooter={true}
        />
    );
}
