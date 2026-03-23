"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    MessageSquare,
    Phone,
    Download,
    X,
    Plus,
    ChevronUp,
    ChevronDown,
    FileText,
    Search,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

interface FloatingActionHubProps {
    settings: {
        enabled?: boolean;
        position?: "left" | "right";
        vAlign?: "top" | "middle" | "bottom";
        whatsapp?: string;
        phone?: string;
        catalogStorageId?: string; // Legacy
        catalogs?: { name: string; storageId: string }[];
        guidedMessages?: { label: string; link: string }[];
        popupDelay?: number;
        enableSearch?: boolean;
        isDismissible?: boolean;
    };
    whatsappMessage?: string;
}

export function FloatingActionHub({ settings, whatsappMessage }: FloatingActionHubProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    // @ts-ignore - search api is generated during build
    const searchResults = useQuery(api.search?.globalSearch || "skip" as any, { query: searchQuery });

    useEffect(() => {
        setMounted(true);
        // Popup delay
        const delay = (settings?.popupDelay || 0) * 1000;
        const timer = setTimeout(() => {
            if (!isDismissed) setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [settings?.popupDelay, isDismissed]);

    // Track dismissal in session storage to remember across page navs in same session
    useEffect(() => {
        const dismissed = sessionStorage.getItem("widget_dismissed");
        if (dismissed) setIsDismissed(true);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        sessionStorage.setItem("widget_dismissed", "true");
    };

    if (!mounted || !settings?.enabled || pathname?.startsWith("/admin") || pathname?.startsWith("/login") || !isVisible) {
        return null;
    }

    const {
        position = "right",
        vAlign = "bottom",
        whatsapp,
        phone,
        catalogs = [],
        guidedMessages = []
    } = settings;

    const hasWhatsApp = !!whatsapp;
    const hasPhone = !!phone;

    const encodedMessage = encodeURIComponent(whatsappMessage || "Hi, I'd like to enquire about manufacturing services.");
    const whatsappUrl = `https://wa.me/${whatsapp?.replace(/\D/g, '')}?text=${encodedMessage}`;

    const alignClasses = cn(
        "fixed z-[9999] flex flex-col items-center gap-3 transition-all duration-500",
        position === "left" ? "left-6" : "right-6",
        vAlign === "top" ? "top-24" : vAlign === "middle" ? "top-1/2 -translate-y-1/2" : "bottom-6"
    );

    return (
        <motion.div
            className={alignClasses}
            drag={settings.isDismissible ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 100) {
                    handleDismiss();
                }
            }}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: position === "right" ? "bottom right" : "bottom left" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn(
                            "w-[min(90vw,380px)] bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden flex flex-col mb-4",
                            position === "right" ? "origin-bottom-right" : "origin-bottom-left",
                            "max-sm:fixed max-sm:bottom-24 max-sm:left-4 max-sm:right-4 max-sm:w-auto max-sm:max-h-[70vh]"
                        )}
                    >
                        {/* Header */}
                        <div className="bg-nb-green p-6 text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-nb-green/20 pointer-events-none" />
                            <div className="flex justify-between items-center relative z-10">
                                <div>
                                    <h3 className="font-black text-xl tracking-tight leading-none mb-1">Support Nest</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search Area */}
                        {settings.enableSearch && (
                            <div className="p-4 border-b border-slate-50 bg-white/50">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-nb-green transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search for anything..."
                                        className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl py-3 pl-11 pr-10 text-sm font-bold focus:ring-4 focus:ring-nb-green/10 focus:border-nb-green/20 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery("")}
                                            title="Clear search"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Search Results */}
                                <AnimatePresence>
                                    {searchQuery.length >= 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-3 space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-none"
                                        >
                                            {searchResults?.map((res: any, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <Link
                                                        href={res.href}
                                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all group"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 relative border border-slate-100">
                                                            {res.image ? (
                                                                <Image src={res.image.startsWith('http') ? res.image : `/api/storage/${res.image}`} alt={res.title} fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <ImageIcon size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <p className="text-[11px] font-black text-slate-900 truncate">{res.title}</p>
                                                            <p className="text-[9px] font-black text-nb-green uppercase tracking-widest">{res.type}</p>
                                                        </div>
                                                        <ArrowRight size={14} className="text-slate-200 group-hover:text-nb-green group-hover:translate-x-1 transition-all" />
                                                    </Link>
                                                </motion.div>
                                            ))}
                                            {searchResults?.length === 0 && (
                                                <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 rounded-xl mt-2">No results found</p>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto max-h-[450px] scrollbar-none overscroll-contain">
                            {/* Guided Messages */}
                            {guidedMessages.length > 0 && (
                                <div className="p-6 pb-2 space-y-2">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Popular Topics</h4>
                                    {guidedMessages.map((msg, idx) => (
                                        <Link
                                            key={idx}
                                            href={msg.link}
                                            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/40 border border-slate-100 hover:border-nb-green/30 hover:shadow-lg hover:shadow-nb-green/5 transition-all group active:scale-[0.98]"
                                        >
                                            <span className="text-[11px] font-bold text-slate-700">{msg.label}</span>
                                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-nb-green/10 group-hover:text-nb-green transition-all">
                                                <ArrowRight size={14} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="p-6 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Direct Contact</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {hasWhatsApp && (
                                        <Link href={whatsappUrl} target="_blank" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/10 hover:bg-[#25D366]/10 transition-all group active:scale-95">
                                            <div className="p-3 bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white rounded-xl shadow-lg shadow-[#25D366]/20 mb-3 group-hover:scale-110 transition-transform">
                                                <WhatsAppIcon size={20} />
                                            </div>
                                            <span className="text-[10px] font-black text-[#128C7E] uppercase tracking-widest">WhatsApp</span>
                                        </Link>
                                    )}
                                    {hasPhone && (
                                        <Link href={`tel:${phone}`} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-100/50 transition-all group active:scale-95">
                                            <div className="p-3 bg-gradient-to-tr from-blue-700 to-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 mb-3 group-hover:scale-110 transition-transform">
                                                <Phone size={18} />
                                            </div>
                                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Call Us</span>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Catalogs */}
                            {catalogs.length > 0 && (
                                <div className="px-6 pb-6 space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Catalogs & Downloads</h4>
                                    <div className="space-y-2.5">
                                        {catalogs.map((cat, idx) => {
                                            const isExternal = cat.storageId.startsWith('http') || cat.storageId.startsWith('www');
                                            const href = isExternal 
                                                ? (cat.storageId.startsWith('www') ? `https://${cat.storageId}` : cat.storageId)
                                                : `/api/storage/${cat.storageId}`;
                                            
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 border border-slate-100 hover:bg-nb-green/5 hover:border-nb-green/20 hover:shadow-md transition-all group active:scale-[0.98]"
                                                >
                                                    <div className="p-2.5 bg-nb-green text-white rounded-xl shadow-lg shadow-nb-green/10 group-hover:scale-110 transition-transform">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <span className="text-[11px] font-black text-slate-700 truncate block">{cat.name}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                                            {isExternal ? 'Browse Online' : 'PDF Download'}
                                                        </span>
                                                    </div>
                                                    <Download size={14} className="text-slate-300 group-hover:text-nb-green transition-colors" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Contact Bubbles */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="flex flex-col gap-3 mb-2"
                    >
                        {hasWhatsApp && (
                            <motion.a
                                href={whatsappUrl}
                                target="_blank"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-14 h-14 bg-white text-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.2)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.3)] transition-all border-2 border-[#25D366]/10 relative group/wa"
                                title="WhatsApp Us"
                            >
                                <div className="absolute inset-0 bg-[#25D366]/5 rounded-full animate-pulse group-hover/wa:animate-none" />
                                <WhatsAppIcon size={28} />
                            </motion.a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative group">
                {/* Dismiss Hint on Mobile */}
                {settings.isDismissible && isVisible && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: position === "right" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            "hidden md:block absolute top-[22px] px-3 py-1 bg-slate-900/10 backdrop-blur-md rounded-full text-[8px] font-black text-slate-600 uppercase tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity",
                            position === "right" ? "right-full mr-4" : "left-full ml-4"
                        )}
                    >
                        Swipe away
                    </motion.div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    title={isOpen ? "Close Support Nest" : "Open Support Nest"}
                    className={cn(
                        "w-14 h-14 !rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-500 relative group overflow-hidden bg-white border-2 border-white/80 ring-4 ring-nb-green/10 p-0.5 aspect-square shrink-0 flex-none",
                        isOpen ? "rotate-180 !bg-slate-900 !ring-slate-900/10 shadow-none border-slate-800" : "hover:ring-nb-green/30 hover:scale-105 active:scale-95 hover:shadow-[0_15px_35px_rgba(22,163,74,0.2)]"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            >
                                <X size={24} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, scale: 0.2 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.2 }}
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-nb-green/30 via-transparent to-nb-green/10 animate-pulse rounded-full" />
                                <div className="relative w-[85%] h-[85%]">
                                    <Image
                                        src="/images/support-mascot.png"
                                        alt="Support Mascot"
                                        fill
                                        className="object-cover rounded-full"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.div>
    );
}

const ImageIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);
