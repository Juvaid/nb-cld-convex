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

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {};
  try {
    settings = await convex.query(api.siteSettings.getSiteSettings);
  } catch (error) {
    console.warn("Failed to fetch site settings for metadata:", error);
  }

  const title = settings.siteTitle || "NatureBoon | Premium Manufacturing Platform";
  const description = settings.footerDescription || "Next-generation B2B manufacturing platform for premium personal care.";
  const faviconUrl = settings.faviconUrl;

  return {
    title,
    description,
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
