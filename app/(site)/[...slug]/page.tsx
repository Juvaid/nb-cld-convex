import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import PageClient from "./PageClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const path = "/" + slug.join("/");

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const page = await convex.query(api.pages.getPublishedPage, { path });

    if (page) {
        return {
            title: page.title,
            description: page.description || "Premium B2B Manufacturing - NatureBoon",
        };
    }

    return {
        title: "NatureBoon",
        description: "Premium B2B Manufacturing - NatureBoon",
    };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    return <PageClient slug={slug} />;
}
