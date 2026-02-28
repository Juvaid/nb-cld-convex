"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Search, PenTool, Loader2, Eye, Trash2, Globe, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BlogsAdmin() {
    const blogs = useQuery(api.blogs.listAll);
    const updateBlog = useMutation(api.blogs.updateBlog);
    const deleteBlog = useMutation(api.blogs.deleteBlog);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const filteredBlogs = blogs?.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleToggleStatus = async (blog: any) => {
        setIsProcessing(blog._id);
        const newStatus = blog.status === "published" ? "draft" : "published";
        try {
            await updateBlog({
                id: blog._id,
                status: newStatus
            });
        } catch (error) {
            console.error("Failed to toggle blog status:", error);
        } finally {
            setIsProcessing(null);
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        setIsProcessing(id);
        try {
            await deleteBlog({ id });
        } catch (error) {
            console.error("Failed to delete blog:", error);
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Blog System</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Create and manage your nature-focused stories.</p>
                </div>

                <Link
                    href="/admin/blogs/new"
                    className="flex items-center justify-center gap-2 bg-nb-green text-white px-4 h-10 flex-shrink-0 rounded-xl font-semibold shadow-sm hover:bg-nb-green/90 transition-all focus:ring-2 focus:ring-nb-green focus:ring-offset-2"
                >
                    <Plus size={18} />
                    Create New Post
                </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nb-green transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                    />
                </div>
            </div>

            {!blogs ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Loader2 className="animate-spin text-nb-green mb-4" size={32} />
                    <p className="text-slate-500 font-semibold text-sm">Loading Blog Content...</p>
                </div>
            ) : filteredBlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <PenTool className="text-slate-300 mb-4" size={48} />
                    <p className="text-slate-600 font-medium">
                        {searchQuery ? `No posts matching "${searchQuery}"` : "No blog posts yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {filteredBlogs.map((blog) => (
                            <div key={blog._id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                                <Link href={`/admin/blogs/${blog._id}`} className="flex items-center gap-4 flex-1">
                                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 border border-slate-200 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                        {blog.coverImage ? (
                                            <img src={blog.coverImage} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <PenTool size={20} />
                                        )}
                                    </div>
                                    <div className="min-w-0 pr-4">
                                        <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-nb-green transition-colors truncate">{blog.title}</h3>
                                        <div className="flex items-center flex-wrap gap-2">
                                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${blog.status === 'published' ? 'bg-nb-green/10 text-nb-green' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {blog.status}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium truncate">By {blog.author}</span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <button
                                        onClick={() => handleToggleStatus(blog)}
                                        disabled={isProcessing === blog._id}
                                        className={`p-2 rounded-lg transition-all shadow-sm border ${blog.status === 'published'
                                            ? 'text-nb-green bg-nb-green/5 border-nb-green/20 hover:bg-nb-green/10'
                                            : 'text-slate-400 bg-white border-slate-200 hover:text-nb-green hover:border-nb-green/30 hover:bg-nb-green/5'
                                            }`}
                                        title={blog.status === 'published' ? "Set to Draft" : "Publish Story"}
                                    >
                                        {isProcessing === blog._id ? <Loader2 size={16} className="animate-spin" /> : (blog.status === 'published' ? <Globe size={16} /> : <Lock size={16} />)}
                                    </button>
                                    <Link
                                        href={`/blogs/blog/${blog.slug}`}
                                        target="_blank"
                                        className="p-2 text-slate-400 bg-white border border-slate-200 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-all shadow-sm"
                                        title="View Public Post"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        disabled={isProcessing === blog._id}
                                        className="p-2 text-slate-400 bg-white border border-slate-200 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 rounded-lg transition-all shadow-sm disabled:opacity-50"
                                        title="Delete Post"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                <p className="text-slate-500 font-medium text-sm">
                    {blogs ? `Found ${filteredBlogs.length} nature-focused articles.` : "Loading..."}
                </p>
            </div>
        </div>
    );
}
