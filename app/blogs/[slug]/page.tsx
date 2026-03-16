import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import BlogPostClient from "./BlogPostClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await fetchQuery(api.blogs.getBlogBySlug, { slug });
    if (!blog) return { title: "Article Not Found" };
    
    return {
        title: blog.title,
        description: blog.excerpt,
        openGraph: {
            images: blog.coverImage ? [blog.coverImage] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
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
