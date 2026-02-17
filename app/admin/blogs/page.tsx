"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Search, PenTool, Loader2, MoreVertical, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function BlogsAdmin() {
    const blogs = useQuery(api.blogs.listAll); // Assuming this will be created
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBlogs = blogs?.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6 font-outfit">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog System</h1>
                    <p className="text-slate-500 font-medium">Create and manage your nature-focused stories.</p>
                </div>

                <Link
                    href="/admin/blogs/new"
                    className="flex items-center gap-2 bg-nb-green text-slate-900 px-6 py-2.5 rounded-xl font-black shadow-lg shadow-nb-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus size={20} />
                    Create New Post
                </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green focus:bg-white transition-all font-medium"
                    />
                </div>
            </div>

            {!blogs ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Loader2 className="animate-spin text-nb-green mb-4" size={40} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Blog Content...</p>
                </div>
            ) : filteredBlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                    <PenTool className="text-slate-100 mb-4" size={60} />
                    <p className="text-slate-500 font-black">
                        {searchQuery ? `No posts matching "${searchQuery}"` : "No blog posts yet."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredBlogs.map((blog) => (
                        <div key={blog._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 border border-slate-100 overflow-hidden">
                                    {blog.coverImage ? (
                                        <img src={blog.coverImage} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <PenTool size={24} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-nb-green transition-colors">{blog.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${blog.status === 'published' ? 'bg-nb-green/10 text-nb-green' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {blog.status}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium italic">By {blog.author}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2.5 text-slate-900 bg-white border border-slate-200 hover:text-nb-green hover:bg-nb-green/5 hover:border-nb-green/20 rounded-xl transition-all shadow-sm" title="View Post">
                                    <Eye size={20} />
                                </button>
                                <button className="p-2.5 text-slate-900 bg-white border border-slate-200 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all shadow-sm" title="Delete Post">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-nb-green/5 border border-nb-green/10 rounded-3xl p-8 text-center ring-1 ring-nb-green/20">
                <p className="text-slate-500 font-bold text-sm">
                    Blog system is in early scaffolding phase.
                    {blogs ? ` Found ${filteredBlogs.length} articles.` : ""}
                </p>
            </div>
        </div>
    );
}
