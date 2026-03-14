import { Metadata } from 'next';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import BlogPostClient from './BlogPostClient';
import React from 'react';
import { generateBlogMetadata } from '@/lib/generatePageMetadata';
import { BlogRecord } from '@/types';

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const blog = await fetchQuery(api.blogs.getBlogBySlug, { slug: params.slug });
    if (!blog) {
        return {};
    }
    return generateBlogMetadata(blog as BlogRecord, `/blogs/blog/${params.slug}`);
}

interface BlogPostPageProps {
    params: { slug: string };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = params;

    const initialBlog = await fetchQuery(api.blogs.getBlogBySlug, { slug });

    return (
        <BlogPostClient
            slug={slug}
            initialBlog={initialBlog}
        />
    );
}
