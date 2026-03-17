"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewBlogPage() {
    const router = useRouter();
    const { token } = useAuth();
    const createDraft = useMutation(api.blogs.createDraft);
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        setSlug(generateSlug(val));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !slug) return;

        setIsCreating(true);
        try {
            const blogId = await createDraft({
                title,
                slug,
                token: token ?? undefined,
            });
            router.push(`/admin/blogs/${blogId}`);
        } catch (error) {
            console.error("Failed to create blog draft:", error);
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 font-outfit">
            <Link
                href="/admin/blogs"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-nb-green transition-colors mb-8 font-bold"
            >
                <ArrowLeft size={18} />
                Back to Blog System
            </Link>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create New Post</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Enter a catchy title for your nature-focused story.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Article Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="e.g., The Secret Benefits of Aloe Vera"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-nb-green/10 focus:border-nb-green focus:bg-white transition-all text-lg font-bold text-slate-900"
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="slug-input" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">URL Slug</label>
                        <div className="flex items-center gap-2 px-6 py-4 bg-slate-100 rounded-2xl border border-slate-200">
                            <span className="text-slate-400 font-bold text-sm italic">.../blogs/blog/</span>
                            <input
                                id="slug-input"
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="article-slug"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 p-0"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold italic ml-1">Slugs are used in the article's web address.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isCreating || !title}
                        className="w-full flex items-center justify-center gap-3 bg-nb-green text-slate-900 py-5 rounded-2xl font-black text-lg shadow-lg shadow-nb-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isCreating ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <Plus size={24} />
                                Initialize Draft Post
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
