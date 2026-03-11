export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { aboutPageData } from "@/data/about-page-data";

export const metadata: Metadata = {
    title: "About Us | NatureBoon",
    description: "Learn about NatureBoon's B2B manufacturing excellence and heritage.",
};

export default function AboutPage() {
    return <CmsPageRenderer path="/about" fallbackData={aboutPageData} />;
}
