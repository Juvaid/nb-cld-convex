export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { contactPageData } from "@/data/contact-page-data";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export async function generateMetadata(): Promise<Metadata> {
    try {
        const settings = await convex.query(api.siteSettings.getSiteSettings);
        const siteName = (settings as any)?.siteTitle || "Nature's Boon";

        return {
            title: `Contact | ${siteName}`,
            description: `Get in touch with ${siteName} for B2B inquiry and partnership.`,
            openGraph: {
                title: `Contact | ${siteName}`,
                description: `Get in touch with ${siteName} for B2B inquiry and partnership.`,
                type: "website",
                siteName,
            },
        };
    } catch { /* fall through to defaults */ }

    return {
        title: "Contact | Nature's Boon",
        description: "Get in touch with Nature's Boon for B2B inquiry and partnership.",
    };
}

export default function ContactPage() {
    return <CmsPageRenderer path="/contact" fallbackData={contactPageData} />;
}
