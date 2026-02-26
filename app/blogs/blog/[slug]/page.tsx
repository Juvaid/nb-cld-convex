"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PuckRenderer } from "@/components/PuckRenderer";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-nb-green transition-colors mb-8 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Articles
                </Link>
            </div>
            <PuckRenderer data={parsedData} />
            <div className="max-w-4xl mx-auto px-4 py-20 border-t border-slate-900/5">
                <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-4">Interested in these insights?</h2>
                        <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto">
                            Connect with our expert team for detailed technical discussions and customized formulation support.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-nb-green text-slate-900 px-10 py-4 rounded-2xl font-black shadow-xl shadow-nb-green/20 hover:scale-[1.05] transition-all"
                        >
                            Discuss Your Project
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                    {/* Abstract background decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-nb-green/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-nb-green-deep/10 rounded-full blur-[100px] -ml-32 -mb-32" />
                </div>
            </div>
        </div>
    );
}
