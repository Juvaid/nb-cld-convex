import './globals.css';

import { ConvexHttpClient } from 'convex/browser';
import { Inter } from 'next/font/google';

import { Providers } from './providers';
import { api } from '@/convex/_generated/api';
import {
  generateBaseMetadata,
  generateBusinessJsonLd,
} from '@/lib/seo';
import { FloatingActionHub } from '@/components/FloatingActionHub';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  'https://placeholder-url-for-build.convex.cloud';
const convex = new ConvexHttpClient(convexUrl);

// Generate base metadata from Convex settings
export async function generateMetadata() {
  let settings: any;
  try {
    settings = await convex.query(api.siteSettings.getSiteSettings);
  } catch (error) {
    // Silently fail during build, fallback is handled in generateBaseMetadata
  }
  return generateBaseMetadata(settings);
}

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  let settings: any;
  try {
    settings = await convex.query(api.siteSettings.getSiteSettings);
  } catch (error) {
    // Silently fail, fallback is handled in generateLocalBusinessJsonLd
  }

  const jsonLd = generateBusinessJsonLd(settings);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd, null, 2),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased text-slate-900`}>
        <Providers children={children} modal={modal} />
        <FloatingActionHub settings={settings?.floating_widget} whatsappMessage={settings?.whatsapp_message} />
      </body>
    </html>
  );
}
