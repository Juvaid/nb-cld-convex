"use client";

import React, { useState, useEffect } from "react";
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
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingActionHubProps {
    settings: {
        enabled?: boolean;
        position?: "left" | "right";
        vAlign?: "top" | "middle" | "bottom";
        whatsapp?: string;
        phone?: string;
        catalogStorageId?: string;
    };
    whatsappMessage?: string;
}

export function FloatingActionHub({ settings, whatsappMessage }: FloatingActionHubProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !settings?.enabled || pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
        return null;
    }

    const {
        position = "right",
        vAlign = "bottom",
        whatsapp,
        phone,
        catalogStorageId
    } = settings;

    const hasWhatsApp = !!whatsapp;
    const hasPhone = !!phone;
    const hasCatalog = !!catalogStorageId;

    // Construct WhatsApp URL with preset message
    const encodedMessage = encodeURIComponent(whatsappMessage || "Hi, I'd like to enquire about manufacturing services.");
    const whatsappUrl = `https://wa.me/${whatsapp?.replace(/\D/g, '')}?text=${encodedMessage}`;

    const activeActions = [
        hasWhatsApp && {
            id: 'whatsapp',
            icon: <MessageSquare size={20} />,
            label: 'WhatsApp',
            href: whatsappUrl,
            color: 'bg-[#25D366]',
        },
        hasPhone && {
            id: 'phone',
            icon: <Phone size={20} />,
            label: 'Call Us',
            href: `tel:${phone}`,
            color: 'bg-blue-600',
        },
        hasCatalog && {
            id: 'catalog',
            icon: <FileText size={20} />,
            label: 'Catalog',
            href: catalogStorageId?.startsWith('http') ? catalogStorageId : `https://lovely-peccary-641.eu-west-1.convex.site/api/storage/${catalogStorageId}`,
            color: 'bg-nb-green',
        }
    ].filter(Boolean) as any[];

    if (activeActions.length === 0) return null;

    // Alignment classes
    const alignClasses = cn(
        "fixed z-[9999] flex flex-col items-center gap-3 transition-all duration-500",
        position === "left" ? "left-6" : "right-6",
        vAlign === "top" ? "top-24" : vAlign === "middle" ? "top-1/2 -translate-y-1/2" : "bottom-6"
    );

    return (
        <div className={alignClasses}>
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col items-center gap-3">
                        {activeActions.map((action, idx) => (
                            <motion.div
                                key={action.id}
                                initial={{ opacity: 0, scale: 0, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0, y: 20 }}
                                transition={{ delay: idx * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <Link
                                    href={action.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all group relative",
                                        action.color
                                    )}
                                >
                                    {action.icon}
                                    <span className={cn(
                                        "absolute px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl",
                                        position === "right" ? "right-full mr-4" : "left-full ml-4"
                                    )}>
                                        {action.label}
                                        <div className={cn(
                                            "absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent",
                                            position === "right" ? "left-full border-l-slate-900" : "right-full border-r-slate-900"
                                        )} />
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 relative group overflow-hidden",
                    isOpen ? "bg-slate-800 rotate-90" : "bg-nb-green"
                )}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                            className="relative flex items-center justify-center"
                        >
                            <Plus size={28} className="relative z-10" />
                            {!isOpen && (
                                <div className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
}
