export type PageSeoFallback = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
};

const OG_IMAGE = 'https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773305814460-herobannerv2.png';
const BASE_URL = 'https://darkorange-anteater-238035.hostingersite.com';

export const SEO_FALLBACKS: Record<string, PageSeoFallback> = {
  '/': {
    title: "Nature's Boon | Personal Care Manufacturer India",
    description: "India's trusted OEM, Private Label & Contract Manufacturer for skincare, haircare & personal care products. Based in Mohali, Punjab.",
    canonical: `${BASE_URL}/`,
    ogImage: OG_IMAGE,
  },
  '/products': {
    title: "Products | Nature's Boon",
    description: "Explore our range of skincare, haircare, men's grooming, personal care & bridal kit manufacturing solutions.",
    canonical: `${BASE_URL}/products`,
    ogImage: OG_IMAGE,
  },
  '/services': {
    title: "Services | Nature's Boon",
    description: "OEM manufacturing, Private Label, Custom Formulation & Contract Manufacturing services for personal care brands.",
    canonical: `${BASE_URL}/services`,
    ogImage: OG_IMAGE,
  },
  '/about': {
    title: "About Us | Nature's Boon",
    description: "20+ years of personal care manufacturing excellence. Meet the team behind Nature's Boon, Mohali, Punjab.",
    canonical: `${BASE_URL}/about`,
    ogImage: OG_IMAGE,
  },
  '/contact': {
    title: "Contact Us | Nature's Boon",
    description: "Get in touch with Nature's Boon for OEM, Private Label or contract manufacturing enquiries. Call +91 97818 00033.",
    canonical: `${BASE_URL}/contact`,
    ogImage: OG_IMAGE,
  },
  '/blogs': {
    title: "Blog | Nature's Boon",
    description: "Industry insights, formulation tips and manufacturing news from Nature's Boon.",
    canonical: `${BASE_URL}/blogs`,
    ogImage: OG_IMAGE,
  },
};

export function getSeoFallback(path: string): PageSeoFallback {
  // Normalize path by removing trailing slash except for root
  const normalizedPath = path === '/' ? path : path.replace(/\/$/, '');
  return SEO_FALLBACKS[normalizedPath] ?? {
    title: "Nature's Boon | Personal Care Manufacturer",
    description: "OEM, Private Label & Contract Manufacturing for personal care brands. Based in Mohali, Punjab, India.",
    canonical: `${BASE_URL}${path}`,
    ogImage: OG_IMAGE,
  };
}
