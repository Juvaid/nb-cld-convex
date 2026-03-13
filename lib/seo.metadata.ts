import type { Metadata } from 'next';
import { getSeoFallback } from './seo.fallback';

export function buildMetadata(
  path: string,
  convexOverrides?: {
    title?: string;
    description?: string;
  } | null
): Metadata {
  const fallback = getSeoFallback(path);

  // Convex data wins if available, static fallback used otherwise
  const title = convexOverrides?.title || fallback.title;
  const description = convexOverrides?.description || fallback.description;

  return {
    title,
    description,
    alternates: {
      canonical: fallback.canonical,
    },
    openGraph: {
      title,
      description,
      url: fallback.canonical,
      siteName: "Nature's Boon",
      type: 'website',
      images: [
        {
          url: fallback.ogImage!,
          width: 1200,
          height: 600,
          alt: "Nature's Boon Manufacturing",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
