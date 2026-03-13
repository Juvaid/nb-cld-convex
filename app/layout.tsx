import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {};
  try {
    settings = await convex.query(api.siteSettings.getSiteSettings);
  } catch (error) {
    // Silence error during build
  }

  const title = settings.siteTitle || "Nature's Boon | Premium Manufacturing Platform";
  const description = settings.footerDescription || "Next-generation B2B manufacturing platform for premium personal care.";
  const faviconUrl = settings.faviconUrl;

  return {
    title,
    description,
    keywords: [
      "B2B Manufacturing", "Personal Care", "OEM", "Private Label",
      "Contract Manufacturing", "Nature's Boon", "Skincare Manufacturer",
      "Haircare Manufacturer"
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Nature's Boon",
      images: [
        {
          url: "https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773305814460-herobannerv2.png",
          width: 1200,
          height: 600,
          alt: "Nature's Boon Manufacturing",
        },
      ],
    },
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  };
}

import { Providers } from "./providers";

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  let settings: any = {};
  try {
    // Only fetch if we're not in the middle of a build that can't reach Convex
    settings = await convex.query(api.siteSettings.getSiteSettings);
  } catch (error) {
    // Silence error during build; static fallbacks handled below
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://naturesboon.net";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": settings.siteTitle || "Nature's Boon",
    "image": settings.logoUrl || `${siteUrl}/logo.png`,
    "description": settings.footerDescription || "Personal care manufacturing excellence.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No 123, JLPL Industrial Area",
      "addressLocality": "Mohali",
      "addressRegion": "Punjab",
      "postalCode": "140308",
      "addressCountry": "IN"
    },
    "telephone": "+91-9877659808",
    "email": "naturesboon@yahoo.com",
    "url": siteUrl,
    "sameAs": [
      "https://www.instagram.com/natures_boon",
      "https://www.facebook.com/naturesboon"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers children={children} modal={modal} />
      </body>
    </html>
  );
}
