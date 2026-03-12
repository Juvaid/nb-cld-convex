"use client";

import {
    LayoutDashboard,
    FileText,
    Package,
    Image as ImageIcon,
    Settings,
    LogOut,
    PenTool,
    Palette,
    Layout,
    Mail,
    Globe
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/lib/auth-context";

const coreItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
];

const contentItems = [
    { name: "Pages", href: "/admin/pages", icon: FileText },
    { name: "Visual Editor", href: "/admin/editor", icon: Layout },
    { name: "Blogs", href: "/admin/blogs", icon: PenTool },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
];

const commerceItems = [
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
];

const systemItems = [
    { name: "Theme & Design", href: "/admin/theme", icon: Palette },
    { name: "General Settings", href: "/admin/settings", icon: Settings },
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
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 flex flex-col sticky top-0 h-screen border-r border-slate-800 overflow-y-auto shrink-0">
                <div className="p-6">
                    <div className="font-bold text-xl tracking-tight text-white flex items-center gap-3">
                        <div className="w-8 h-8 bg-nb-green rounded-lg shadow-sm flex items-center justify-center">
                            <PenTool size={16} className="text-slate-900" />
                        </div>
                        Nature's Boon
                    </div>
                </div>

                <div className="px-3 flex-1 overflow-y-auto">
                    <nav className="space-y-6 pt-2 pb-6">
                        <div className="space-y-1">
                            {coreItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative ${isActive
                                            ? "bg-slate-800/80 text-white"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">Content Management</div>
                            <div className="space-y-1">
                                {contentItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative ${isActive
                                                ? "bg-slate-800/80 text-white"
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">B2B Commerce</div>
                            <div className="space-y-1">
                                {commerceItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative ${isActive
                                                ? "bg-slate-800/80 text-white"
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">Site Configuration</div>
                            <div className="space-y-1">
                                {systemItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative ${isActive
                                                ? "bg-slate-800/80 text-white"
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-slate-800 hover:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-3 p-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-nb-green/20 text-nb-green flex items-center justify-center font-bold text-sm shrink-0">
                            {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                            <div className="text-sm font-medium text-white truncate">{user.name}</div>
                            <div className="text-xs text-slate-400 truncate">{user.role} access</div>
                        </div>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800/50 hover:text-rose-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col h-screen overflow-hidden min-w-0">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-nb-green" />
                        <span className="text-sm font-semibold text-slate-800">Admin Dashboard</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Server</span>
                            <span className="text-xs font-semibold text-nb-green">Live & Syncing</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <Link href="/" className="text-xs font-medium text-slate-700 px-3 py-1.5 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                            View Site
                        </Link>
                    </div>
                </header>

                <div className="flex-grow overflow-auto bg-slate-50">
                    <div className="p-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
