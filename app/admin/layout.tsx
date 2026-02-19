"use client";

import {
    LayoutDashboard,
    FileText,
    Package,
    Image as ImageIcon,
    Settings,
    LogOut,
    PenTool,
    Layout,
    Mail,
    Globe
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Visual Editor", href: "/admin/editor", icon: Layout },
    { name: "Pages", href: "/admin/pages", icon: FileText },
    { name: "Blogs", href: "/admin/blogs", icon: PenTool },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();
    const isEditor = pathname?.includes("/admin/editor");

    // Protect route
    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-nb-green/30 border-t-nb-green rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Verifying Security Access...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    if (isEditor) {
        return <div className="min-h-screen bg-white">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="w-72 bg-[#0F172A] flex flex-col sticky top-0 h-screen shadow-[20px_0_40px_rgba(0,0,0,0.02)] overflow-y-auto">
                <div className="p-8">
                    <div className="font-black text-2xl tracking-tighter text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2BEE6C] rounded-2xl shadow-[0_8px_16px_rgba(43,238,108,0.2)] flex items-center justify-center">
                            <PenTool size={20} className="text-slate-900" />
                        </div>
                        NatureBoon
                    </div>
                </div>

                <div className="px-4 mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-4 opacity-50">Main Menu</div>
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all relative overflow-hidden active:scale-[0.98] ${isActive
                                        ? "bg-slate-800 text-[#2BEE6C]"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-[#2BEE6C]"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${isActive ? "scale-110" : ""}`} />
                                    {item.name}
                                    <div className={`absolute right-2 w-1.5 h-1.5 rounded-full bg-[#2BEE6C] transition-transform ${isActive ? "scale-100" : "scale-0 group-hover:scale-100"}`} />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800/50">
                    <div className="bg-slate-800/30 rounded-[24px] p-4 border border-slate-800/50 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-nb-green/20 border border-nb-green/20 flex items-center justify-center font-black text-nb-green">
                                {user.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-black text-white">{user.name}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.role} Access</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-black text-rose-400 rounded-2xl hover:bg-rose-500/10 hover:text-rose-300 transition-all active:scale-[0.98]"
                    >
                        <LogOut className="w-5 h-5" />
                        System Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nb-green" />
                        <span className="text-sm font-black text-slate-900 tracking-tight uppercase">Overview Dashboard</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server Status</span>
                            <span className="text-xs font-bold text-nb-green">Live & Synchronized</span>
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <Link href="/" className="text-xs font-black text-slate-900 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
                            View Website
                        </Link>
                    </div>
                </header>

                <div className="flex-grow overflow-auto bg-[#F8FAFC]">
                    <div className="p-10 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
