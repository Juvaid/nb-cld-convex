import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import BlogPostClient from "./BlogPostClient";
import React from "react";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const blog = await convex.query(api.blogs.getBlogBySlug, { slug });
        if (blog) {
            const title = `${blog.title} | NatureBoon Blog`;
            const description = blog.excerpt || `Read ${blog.title} from the NatureBoon team.`;
            const imageUrl = blog.coverImage || undefined;

            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    type: "article",
                    siteName: "NatureBoon",
                    ...(imageUrl && { images: [{ url: imageUrl }] }),
                }
            };
        }
    } catch { /* fall through to defaults */ }

    return {
        title: "Blog | NatureBoon",
        description: "Insights and stories from the world of personal care manufacturing.",
    };
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
