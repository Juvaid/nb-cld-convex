"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PuckRenderer } from "@/components/PuckRenderer";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { use } from "react";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = use(params);
    const blog = useQuery(api.blogs.getBlogBySlug, { slug });

    if (blog === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-nb-green animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Unfolding the story...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <h1 className="text-4xl font-black text-slate-900 mb-4 text-center">Story Not Found</h1>
                <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
                    The requested blog post doesn't exist or has been moved.
                </p>
                <Link
                    href="/blogs"
                    className="flex items-center gap-2 bg-nb-green text-slate-900 px-8 py-3 rounded-2xl font-black shadow-lg shadow-nb-green/20 hover:scale-[1.05] transition-all"
                >
                    <ArrowLeft size={20} />
                    Back to Blogs
                </Link>
            </div>
        );
    }

    let parsedData = { content: [], root: { props: { title: blog.title } } };
    try {
        parsedData = JSON.parse(blog.content);
    } catch (e) {
        console.error("Failed to parse blog content", e);
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <PuckRenderer data={parsedData} />
        </div>
    );
}
