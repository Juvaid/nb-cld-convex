import type { Metadata } from "next"
import type { PageRecord, BlogRecord, ProductRecord } from "@/types"

const SITE_URL = "https://new.naturesboon.net";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Resolves a media ID or relative URL into an absolute URL for social crawlers.
 */
function getAbsoluteImageUrl(imageUrl?: string): string {
  if (!imageUrl) return DEFAULT_OG_IMAGE;
  if (imageUrl.startsWith("http")) return imageUrl;
  
  // Handle storage IDs (which might not be full URLs)
  // If it's a relative path, prepend site URL
  if (imageUrl.startsWith("/")) return `${SITE_URL}${imageUrl}`;
  
  // If it's just an ID (contains no dots or slashes), assume it's a storage ID
  if (!imageUrl.includes("/") && !imageUrl.includes(".")) {
    return `${SITE_URL}/api/storage/${imageUrl}`;
  }

  return `${SITE_URL}/${imageUrl}`;
}

export function generateProductMetadata(product: ProductRecord, path: string): Metadata {
  const url = `${SITE_URL}${path}`
  const imageUrl = getAbsoluteImageUrl(product.images[0]);

  return {
    title: product.name,
    description: product.description,
    keywords: product.keywords,
    robots: "index, follow",
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: product.description,
      url,
      siteName: "Nature's Boon",
      images: [{
        url: imageUrl,
        width: 1200,
        height: 600,
        alt: product.name,
      }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [imageUrl],
    },
  }
}

export function generateBlogMetadata(blog: BlogRecord, path: string): Metadata {
  const url = `${SITE_URL}${path}`
  const imageUrl = getAbsoluteImageUrl(blog.coverImage);

  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: blog.keywords,
    robots: "index, follow",
    alternates: { canonical: url },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url,
      siteName: "Nature's Boon",
      images: [{
        url: imageUrl,
        width: 1200,
        height: 600,
        alt: blog.title,
      }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [imageUrl],
    },
  }
}

export function generatePageMetadata(page: PageRecord, path: string): Metadata {
  const url = `${SITE_URL}${path}`
  const imageUrl = getAbsoluteImageUrl(page.ogImage);

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    robots: "index, follow",
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.ogDescription ?? page.description,
      url,
      siteName: "Nature's Boon",
      images: [{
        url: imageUrl,
        width: 1200,
        height: 600,
        alt: page.title,
      }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.ogDescription ?? page.description,
      images: [imageUrl],
    },
  }
}
