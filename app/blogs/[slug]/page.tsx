import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import BlogPostClient from "./BlogPostClient";
import { Metadata } from "next";
import { generateBlogMetadata } from "@/lib/generatePageMetadata";
import { BlogRecord } from "@/types";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const blog = await fetchQuery(api.blogs.getBlogBySlug, { slug });
    if (!blog) return { title: "Article Not Found" };
    return generateBlogMetadata(blog as BlogRecord, `/blogs/${slug}`);
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    
    // Preload data for initial SSR and instant client hydration
    const preloadedBlog = await preloadQuery(api.blogs.getBlogBySlug, { slug });
    const preloadedSettings = await preloadQuery(api.siteSettings.getSiteSettings);
    
    return (
        <BlogPostClient
            slug={slug}
            preloadedBlog={preloadedBlog}
            preloadedSettings={preloadedSettings}
        />
    );
}
