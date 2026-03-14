export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { generateProductJsonLd, generateBaseMetadata } from '@/lib/seo';
import ProductDetail from '@/components/blocks/ProductDetail';

const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  'https://placeholder-url-for-build.convex.cloud';
const convex = new ConvexHttpClient(convexUrl);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let product: any = null;
  let settings: any = null;
  
  try {
    [product, settings] = await Promise.all([
      convex.query(api.products.getBySlug, { slug }),
      convex.query(api.siteSettings.getSiteSettings)
    ]);
  } catch {
    /* fall through */
  }

  const baseMetadata = generateBaseMetadata(settings);
  if (!product) return baseMetadata;

  const title = product.name;
  const description = product.description || `Explore ${product.name} from Nature's Boon B2B catalog.`;
  const imageUrl = product.images?.[0] || (baseMetadata.openGraph?.images as any)?.[0]?.url;

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      ...(imageUrl && { images: [{ url: imageUrl }] }),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug:string }>;
}) {
  const { slug } = await params;

  let initialProduct: any = undefined;
  try {
    initialProduct = await convex.query(api.products.getBySlug, { slug });
  } catch (e) {
    console.error('Failed to fetch product on server', e);
  }

  const jsonLd = initialProduct ? generateProductJsonLd(initialProduct) : {};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail
        slug={slug}
        initialProduct={initialProduct}
        showHeaderFooter={true}
      />
    </>
  );
}
