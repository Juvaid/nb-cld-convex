import { fetchQuery } from "convex/nextjs";
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
    const blog = await fetchQuery(api.blogs.getBlogBySlug, { slug });
    const settings = await fetchQuery(api.siteSettings.getSiteSettings);
    return (
        <BlogPostClient
            slug={slug}
            initialBlog={blog}
            initialSettings={settings}
        />
    );
}
