import type { Metadata } from 'next';
import type { ReadonlyURLSearchParams } from 'next/navigation';

// =================================================================================
// METADATA & SEO CONFIG
// =================================================================================

const SITE_CONFIG = {
  name: "Nature's Boon",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://new.naturesboon.net',
  ogImage:
    'https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773305814460-herobannerv2.png',
  title: "Nature's Boon | Premium Manufacturing Platform",
  description:
    'Next-generation B2B manufacturing platform for premium personal care, specializing in OEM, Private Label, and innovative R&D solutions.',
  keywords: [
    'B2B Manufacturing',
    'Personal Care',
    'OEM',
    'Private Label',
    'Contract Manufacturing',
    "Nature's Boon",
    'Skincare Manufacturer',
    'Haircare Manufacturer',
  ],
};

/**
 * Generates the default metadata for the site.
 * @param settings - Dynamic site settings from Convex.
 * @returns Metadata object for Next.js.
 */
export function generateBaseMetadata(settings?: any): Metadata {
  const title = settings?.siteTitle || SITE_CONFIG.title;
  const description = settings?.footerDescription || SITE_CONFIG.description;
  const faviconUrl = settings?.faviconUrl;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: title,
      template: `%s | ${settings?.siteTitle || SITE_CONFIG.name}`,
    },
    description,
    keywords: SITE_CONFIG.keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 600,
          alt: `${SITE_CONFIG.name} Manufacturing`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: SITE_CONFIG.url,
    },
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  };
}

// =================================================================================
// JSON-LD STRUCTURED DATA
// =================================================================================

/**
 * Generates JSON-LD structured data for the Organization and Local Business.
 * @param settings - Dynamic site settings from Convex.
 * @returns JSON-LD script content.
 */
export function generateBusinessJsonLd(settings?: any): object[] {
  const siteUrl = SITE_CONFIG.url;
  
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: "Nature's Boon",
    url: siteUrl,
    logo: settings?.logoUrl || `${siteUrl}/logo-high-res.png`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: settings?.phoneNumber || '+91-97818 00033',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['Hindi', 'English'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/naturesboon',
      'https://www.instagram.com/natures_boon',
      'https://www.linkedin.com/company/naturesboon',
    ],
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: "Nature's Boon",
    description: "Leading Private Label Cosmetics & Skincare Manufacturer in India.",
    url: siteUrl,
    telephone: settings?.phoneNumber || '+91-97818 00033',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.addressStreet || 'Plot No. 123, Industrial Area',
      addressLocality: settings?.addressLocality || 'Bawana',
      addressRegion: settings?.addressRegion || 'Delhi',
      postalCode: settings?.addressPostalCode || '110039',
      addressCountry: settings?.addressCountry || 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '28.7997',
      longitude: '77.0330',
    },
    image: [
      settings?.logoUrl || `${siteUrl}/og-image.jpg`,
    ],
  };

  return [organization, localBusiness];
}

/**
 * Generates JSON-LD structured data for a Product.
 * @param product - The product data.
 * @returns JSON-LD script content.
 */
export function generateProductJsonLd(product: any): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku || product._id,
    image: product.imageUrl,
    brand: {
      '@type': 'Brand',
      name: "Nature's Boon",
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      url: `${SITE_CONFIG.url}/products/${product.slug}`,
      // Add price if available in your product data
      // price: product.price,
      // availability: 'https://schema.org/InStock',
    },
  };
}

/**
 * Generates JSON-LD structured data for an Article (Blog Post).
 * @param blog - The blog post data.
 * @returns JSON-LD script content.
 */
export function generateArticleJsonLd(blog: any): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.imageUrl,
    author: {
      '@type': 'Organization',
      name: "Nature's Boon",
    },
    publisher: {
      '@type': 'Organization',
      name: "Nature's Boon",
      logo: {
        '@type': 'ImageObject',
        url: 'https://naturesboon.in/og-image.jpg', // Main site logo
      },
    },
    datePublished: new Date(blog.publishedAt).toISOString(),
    dateModified: new Date(blog.updatedAt || blog.publishedAt).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blogs/blog/${blog.slug}`,
    },
  };
}
// =================================================================================
// FALLBACKS & PAGE CONFIG
// =================================================================================

export type PageSeoFallback = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
};

export const SEO_FALLBACKS: Record<string, PageSeoFallback> = {
  '/': {
    title: "Nature's Boon | Personal Care Manufacturer India",
    description: "India's trusted OEM, Private Label & Contract Manufacturer for skincare, haircare & personal care products. Based in Mohali, Punjab.",
    canonical: `${SITE_CONFIG.url}/`,
    ogImage: SITE_CONFIG.ogImage,
  },
  '/products': {
    title: "Products | Nature's Boon",
    description: "Explore our range of skincare, haircare, men's grooming, personal care & bridal kit manufacturing solutions.",
    canonical: `${SITE_CONFIG.url}/products`,
    ogImage: SITE_CONFIG.ogImage,
  },
  '/services': {
    title: "Services | Nature's Boon",
    description: "OEM manufacturing, Private Label, Custom Formulation & Contract Manufacturing services for personal care brands.",
    canonical: `${SITE_CONFIG.url}/services`,
    ogImage: SITE_CONFIG.ogImage,
  },
  '/about': {
    title: "About Us | Nature's Boon",
    description: "20+ years of personal care manufacturing excellence. Meet the team behind Nature's Boon, Mohali, Punjab.",
    canonical: `${SITE_CONFIG.url}/about`,
    ogImage: SITE_CONFIG.ogImage,
  },
  '/contact': {
    title: "Contact Us | Nature's Boon",
    description: "Get in touch with Nature's Boon for OEM, Private Label or contract manufacturing enquiries. Call +91 97818 00033.",
    canonical: `${SITE_CONFIG.url}/contact`,
    ogImage: SITE_CONFIG.ogImage,
  },
  '/blogs': {
    title: "Blog | Nature's Boon",
    description: "Industry insights, formulation tips and manufacturing news from Nature's Boon.",
    canonical: `${SITE_CONFIG.url}/blogs`,
    ogImage: SITE_CONFIG.ogImage,
  },
};

export function getSeoFallback(path: string): PageSeoFallback {
  // Normalize path by removing trailing slash except for root
  const normalizedPath = path === '/' ? path : path.replace(/\/$/, '');
  return SEO_FALLBACKS[normalizedPath] ?? {
    title: "Nature's Boon | Personal Care Manufacturer",
    description: "OEM, Private Label & Contract Manufacturing for personal care brands. Based in Mohali, Punjab, India.",
    canonical: `${SITE_CONFIG.url}${path}`,
    ogImage: SITE_CONFIG.ogImage,
  };
}

/**
 * Merges convex overrides with static fallbacks to produce final Next.js Metadata.
 */
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
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: fallback.canonical,
    },
    openGraph: {
      title,
      description,
      url: fallback.canonical,
      siteName: SITE_CONFIG.name,
      type: 'website',
      images: [
        {
          url: fallback.ogImage!,
          width: 1200,
          height: 600,
          alt: `${SITE_CONFIG.name} Manufacturing`,
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

// Export a legacy-style config for next-seo (used in Providers)
export const SEO_CONFIG = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: SITE_CONFIG.url,
    site_name: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 600,
        alt: SITE_CONFIG.name,
      },
    ],
  },
};

export default SEO_CONFIG;
