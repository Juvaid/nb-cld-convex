import type { Metadata } from 'next';

const SITE_CONFIG = {
  name: "Nature's Boon",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://new.naturesboon.net',
  ogImage: 'https://new.naturesboon.net/og-image.jpg',
  title: "Nature's Boon | Manufacturing Excellence",
  description: "A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.",
  keywords: ['Private Label Cosmetics', 'OEM Skincare Manufacturer India', 'Contract Manufacturing Punjab'],
};

export function generateBaseMetadata(settings?: any): Metadata {
  const title = settings?.siteTitle || SITE_CONFIG.title;
  const description = settings?.footerDescription || SITE_CONFIG.description;
  const faviconUrl = settings?.faviconUrl;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`,
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
      'https://www.facebook.com/people/Natures-Boon/100091906116013',
      'https://www.instagram.com/naturesboon.cosmeticsmfg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    ],
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: "Nature's Boon",
    description: "Leading Private Label Cosmetics & Skincare Manufacturer in India.",
    url: siteUrl,
    telephone: settings?.phoneNumber || '+91-9877659808',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.addressStreet || 'Pakhowal Road, Thakkarwal',
      addressLocality: settings?.addressLocality || 'Ludhiana',
      addressRegion: settings?.addressRegion || 'Punjab',
      postalCode: settings?.addressPostalCode || '141013',
      addressCountry: settings?.addressCountry || 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '30.8467',
      longitude: '75.8197',
    },
    image: [
      settings?.logoUrl || `${siteUrl}/og-image.jpg`,
    ],
  };

  return [organization, localBusiness];
}
