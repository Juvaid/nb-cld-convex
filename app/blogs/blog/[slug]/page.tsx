import { Metadata } from 'next';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import BlogPostClient from './BlogPostClient';
import React from 'react';
import { generateArticleJsonLd, generateBaseMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let blog: any = null;
  let settings: any = null;
  
  try {
    [blog, settings] = await Promise.all([
      fetchQuery(api.blogs.getBlogBySlug, { slug }),
      fetchQuery(api.siteSettings.getSiteSettings)
    ]);
  } catch (e) {}

  const baseMetadata = generateBaseMetadata(settings);
  if (!blog) return baseMetadata;

  return {
    ...baseMetadata,
    title: blog.title,
    description: blog.excerpt || undefined,
    openGraph: {
      ...baseMetadata.openGraph,
      title: blog.title,
      description: blog.excerpt || undefined,
    },
  };
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let initialBlog = null;
  try {
    initialBlog = await fetchQuery(api.blogs.getBlogBySlug, { slug });
  } catch (e) {
    console.error('Failed to fetch blog post on server', e);
  }

  let settings = null;
  try {
    settings = await fetchQuery(api.siteSettings.getSiteSettings);
  } catch (e) {
    console.error('Failed to fetch settings for blog post page', e);
  }

  const jsonLd = initialBlog ? generateArticleJsonLd(initialBlog) : {};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient
        slug={slug}
        initialBlog={initialBlog}
        initialSettings={settings}
      />
    </>
  );
}
