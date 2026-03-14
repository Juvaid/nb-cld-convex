import type { Metadata } from "next"
import type { PageRecord, BlogRecord, ProductRecord } from "@/types"

export function generateProductMetadata(product: ProductRecord, path: string): Metadata {
  const url = `https://new.naturesboon.net${path}`

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
        url: product.images[0],
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
      images: [product.images[0]],
    },
  }
}

export function generateBlogMetadata(blog: BlogRecord, path: string): Metadata {
  const url = `https://new.naturesboon.net${path}`

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
        url: blog.coverImage!,
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
      images: [blog.coverImage!],
    },
  }
}

export function generatePageMetadata(page: PageRecord, path: string): Metadata {
  const url = `https://new.naturesboon.net${path}`

  return {
    title: page.title,
    description: page.description,            // Must come from page record
    keywords: page.keywords,                  // Must come from page record
    robots: "index, follow",
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.ogDescription ?? page.description,
      url,
      siteName: "Nature's Boon",
      images: [{
        url: page.ogImage || "https://new.naturesboon.net/og-image.jpg",
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
      images: [page.ogImage || "https://new.naturesboon.net/og-image.jpg"],
    },
  }
}
