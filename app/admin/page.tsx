"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LayoutDashboard, FileText, ShoppingBag, Image as ImageIcon, PenTool } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const pages = useQuery(api.pages.listPages) || [];
    const products = useQuery(api.product_mutations.listProducts) || [];
    const blogs = useQuery(api.blogs.listBlogs) || [];
    const mediaCount = 279;

    const stats = [
        { label: "Site Pages", value: pages.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-50", description: "Active landing pages" },
        { label: "Inventory", value: products.length, icon: ShoppingBag, color: "text-[#2BEE6C]", bg: "bg-[#2BEE6C]/10", description: "B2B Product catalog" },
        { label: "Assets", value: mediaCount, icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50", description: "Optimized media items" },
        { label: "Articles", value: blogs.length, icon: PenTool, color: "text-orange-500", bg: "bg-orange-50", description: "Published blog posts" },
    ];

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Platform Control</h1>
                <p className="text-slate-500 font-medium">Global intelligence and management overview for NatureBoon.</p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={28} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                            <p className="text-xs font-bold text-slate-400 pt-2">{stat.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity (Bento Large) */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <LayoutDashboard size={120} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">System Activity Pulse</h2>
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-lg hover:border-nb-green/20 transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                                        <div className="w-2 h-2 rounded-full bg-nb-green" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-black text-slate-800">System initialization completed</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Event • 2h ago</div>
                                    </div>
                                    <div className="text-[10px] font-black text-nb-green uppercase">Verified</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Bento Tall) */}
                <div className="bg-[#0F172A] p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-nb-green/5 blur-[100px] -z-0" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-white tracking-tight mb-8">Quick Forge</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { name: "New Page", icon: FileText, href: "/admin/editor?new=true" },
                                { name: "Add Media", icon: ImageIcon, href: "/admin/media" },
                                { name: "Write Blog", icon: PenTool, href: "/admin/blogs" },
                                { name: "Sync Catalog", icon: ShoppingBag, href: "/admin/products" },
                            ].map((action) => (
                                <Link
                                    key={action.name}
                                    href={action.href}
                                    className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#2BEE6C] hover:text-slate-900 transition-all group active:scale-95"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-slate-900/10">
                                            <action.icon size={20} />
                                        </div>
                                        <span className="font-black text-sm tracking-tight">{action.name}</span>
                                    </div>
                                    <span className="text-xl font-light opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
