"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LayoutDashboard, FileText, ShoppingBag, Image as ImageIcon, PenTool } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const pages = useQuery(api.pages.listPages) || [];
    const products = useQuery(api.product_mutations.listProducts) || [];
    const blogs = useQuery(api.blogs.listBlogs) || [];
    const inquiries = useQuery(api.inquiries.list) || [];
    const media = useQuery(api.media.listAll) || [];
    const mediaCount = media.length;

    const stats = [
        { label: "Site Pages", value: pages.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-50", description: "Active landing pages", href: "/admin/pages" },
        { label: "Inventory", value: products.length, icon: ShoppingBag, color: "text-[#2BEE6C]", bg: "bg-[#2BEE6C]/10", description: "B2B Product catalog", href: "/admin/products" },
        { label: "Assets", value: mediaCount, icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50", description: "Optimized media items", href: "/admin/media" },
        { label: "Articles", value: blogs.length, icon: PenTool, color: "text-orange-500", bg: "bg-orange-50", description: "Published blog posts", href: "/admin/blogs" },
        { label: "Inquiries", value: inquiries.length, icon: FileText, color: "text-rose-500", bg: "bg-rose-50", description: "Customer leads", href: "/admin/inquiries" },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Platform Control</h1>
                <p className="text-sm text-slate-500 font-medium">Global intelligence and management overview for NatureBoon.</p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                            <p className="text-xs font-medium text-slate-400 pt-1 leading-snug">{stat.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity (Bento Large) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-5 transition-opacity pointer-events-none">
                        <LayoutDashboard size={100} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Activity Pulse</h2>
                            <Link href="/admin/inquiries" className="text-xs font-bold text-nb-green hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {inquiries.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 font-medium">No recent inquiries found.</p>
                                </div>
                            ) : inquiries.slice(0, 5).map((inquiry, i) => (
                                <Link key={inquiry._id} href="/admin/inquiries" className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-pointer">
                                    <div className="hidden sm:flex w-10 h-10 bg-white rounded-lg shadow-sm items-center justify-center text-slate-400 flex-shrink-0">
                                        <div className={`w-2 h-2 rounded-full ${inquiry.status === 'new' ? 'bg-rose-500 animate-pulse' : 'bg-nb-green'}`} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-semibold text-slate-800">
                                            {inquiry.name} <span className="text-slate-400 font-normal">inquired about</span> {inquiry.productName || 'General Inquiry'}
                                        </div>
                                        <div className="text-xs font-medium text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-sm">
                                            {inquiry.message}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0">
                                        <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-1 ${inquiry.status === 'new' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-nb-green/10 text-nb-green'}`}>
                                            {inquiry.status}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-semibold">
                                            {new Date(inquiry.submittedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Bento Tall) */}
                <div className="bg-slate-950 p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-nb-green/5 blur-[80px] -z-0 pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full">
                        <h2 className="text-xl font-bold text-white tracking-tight mb-6 flex-shrink-0">Quick Forge</h2>
                        <div className="flex flex-col gap-3 flex-grow justify-center">
                            {[
                                { name: "Add Media", icon: ImageIcon, href: "/admin/media" },
                                { name: "Write Blog", icon: PenTool, href: "/admin/blogs" },
                                { name: "Sync Catalog", icon: ShoppingBag, href: "/admin/products" },
                            ].map((action) => (
                                <Link
                                    key={action.name}
                                    href={action.href}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-nb-green hover:border-nb-green hover:text-slate-950 transition-all group active:scale-95 text-white"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-slate-950/10">
                                            <action.icon size={20} />
                                        </div>
                                        <span className="font-semibold text-sm tracking-tight">{action.name}</span>
                                    </div>
                                    <span className="font-light opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 group-hover:-translate-y-[2px] transform mr-1 duration-300">↗</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
