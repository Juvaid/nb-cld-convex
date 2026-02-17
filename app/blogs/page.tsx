"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Calendar, User, ArrowRight, Loader2, PenTool } from "lucide-react";
import Link from "next/link";

export default function BlogsPage() {
    const blogs = useQuery(api.blogs.listBlogs);

    return (
        <ThemeProvider>
            <div className="flex min-h-screen flex-col bg-[#FDFDFD] font-outfit">
                <SiteHeader />
                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="relative py-24 md:py-32 overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900 -z-10" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-20 -z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900 -z-10" />

                        <div className="container mx-auto px-4">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nb-green/20 border border-nb-green/20 text-nb-green text-xs font-black uppercase tracking-[0.2em] mb-6">
                                    <PenTool size={14} />
                                    Nature's Boon Editorial
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                                    Insights into <br />
                                    <span className="text-nb-green">Sustainable</span> Beauty.
                                </h1>
                                <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
                                    Discover the science, craftsmanship, and stories behind India's leading personal care manufacturing.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Blog Feed */}
                    <section className="py-24">
                        <div className="container mx-auto px-4">
                            {!blogs ? (
                                <div className="flex flex-col items-center justify-center py-32">
                                    <Loader2 className="animate-spin text-nb-green mb-4" size={40} />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Curating our latest stories...</p>
                                </div>
                            ) : blogs.length === 0 ? (
                                <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-100 rounded-[40px] p-16 text-center">
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mx-auto mb-8 border border-slate-100 text-slate-300">
                                        <PenTool size={32} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-4">No published stories yet</h2>
                                    <p className="text-slate-500 font-medium mb-8">Our editorial team is busy preparing amazing content for you. Check back soon!</p>
                                    <Link href="/" className="inline-flex items-center gap-2 text-nb-green font-black hover:gap-4 transition-all">
                                        Return Home <ArrowRight size={20} />
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {blogs.map((blog) => (
                                        <Link
                                            key={blog._id}
                                            href={`/blogs/blog/${blog.slug}`}
                                            className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2"
                                        >
                                            <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                                                {blog.coverImage ? (
                                                    <img src={blog.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={blog.title} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                        <PenTool size={48} />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                                                        Article
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-8 flex flex-col flex-grow">
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                                        <User size={12} className="text-nb-green" />
                                                        {blog.author}
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-nb-green" />
                                                        {new Date(blog.publishedAt || blog._creationTime).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-nb-green transition-colors">
                                                    {blog.title}
                                                </h3>
                                                {blog.excerpt && (
                                                    <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-6 leading-relaxed">
                                                        {blog.excerpt}
                                                    </p>
                                                )}
                                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                                    Read Story <ArrowRight size={18} className="text-nb-green" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </main>
                <SiteFooter />
            </div>
        </ThemeProvider>
    );
}
