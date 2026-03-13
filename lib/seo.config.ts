import type { DefaultSeoProps } from 'next-seo';

const SEO_CONFIG: DefaultSeoProps = {
  titleTemplate: `%s | Nature's Boon`,
  defaultTitle: "Nature's Boon | Premium Personal Care Manufacturer",
  description: 'A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.',
  canonical: 'https://new.naturesboon.net',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://new.naturesboon.net',
    siteName: "Nature's Boon",
    title: "Nature's Boon | Premium Personal Care Manufacturer",
    description: 'A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.',
    images: [
      {
        url: 'https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773305814460-herobannerv2.png',
        width: 1200,
        height: 600,
        alt: "Nature's Boon Manufacturing",
      },
    ],
  },
  twitter: {
    handle: '@naturesboon',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: 'https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773235816481-edited-1773235821963.jpg',
    },
  ],
};

export default SEO_CONFIG;
