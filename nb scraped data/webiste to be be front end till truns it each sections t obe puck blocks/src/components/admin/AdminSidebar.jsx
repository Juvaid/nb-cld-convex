'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, FileText, Package, Wrench,
    Download, LogOut, Leaf, Menu, X, MessageSquare,
    Image, Paintbrush
} from 'lucide-react';

const sidebarLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/content', icon: FileText, label: 'Content' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/services', icon: Wrench, label: 'Services' },
    { href: '/admin/media', icon: Image, label: 'Media' },
    { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
    { href: '/admin/settings', icon: Paintbrush, label: 'Theme Editor' },
    { href: '/admin/export', icon: Download, label: 'Export' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-primary-dark text-white shadow-lg"
                aria-label="Toggle sidebar"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-dark text-white z-40 transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6">
                    <Link href="/admin" className="flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-sm">Nature&apos;s Boon</span>
                            <span className="block text-[10px] text-white/40 -mt-0.5">CMS Admin</span>
                        </div>
                    </Link>

                    <nav className="space-y-1">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Back to Site
                    </Link>
                </div>
            </aside>
        </>
    );
}
