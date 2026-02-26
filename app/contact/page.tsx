import type { Metadata } from "next";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { contactPageData } from "@/data/contact-page-data";

export const metadata: Metadata = {
    title: "Contact | NatureBoon",
    description: "Get in touch with NatureBoon for B2B inquiry and partnership.",
};

export default function ContactPage() {
    return <CmsPageRenderer path="/contact" fallbackData={contactPageData} />;
}
