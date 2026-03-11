export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { servicesPageData } from "@/data/services-page-data";

export const metadata: Metadata = {
    title: "Services | NatureBoon",
    description: "End-to-end private label and contract manufacturing services.",
};

export default function ServicesPage() {
    return <CmsPageRenderer path="/services" fallbackData={servicesPageData} />;
}
