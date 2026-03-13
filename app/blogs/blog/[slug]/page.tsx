import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import BlogPostClient from "./BlogPostClient";
import React from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

import { buildMetadata } from "@/lib/seo.metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    let blog = null;
    try {
        blog = await convex.query(api.blogs.getBlogBySlug, { slug });
    } catch (e) {}

    return buildMetadata("/blogs", {
        title: blog?.title ? `${blog.title} | Nature's Boon Blog` : undefined,
        description: blog?.excerpt || undefined,
    });
}

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    let settings = null;
    try {
        settings = await convex.query(api.siteSettings.getSiteSettings);
    } catch (e) {
        console.error("Failed to fetch settings for blog post page", e);
    }
    return <BlogPostClient slug={slug} initialSettings={settings} />;
}
