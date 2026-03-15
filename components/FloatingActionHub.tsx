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
import Image from "next/image";

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
            icon: <WhatsAppIcon size={24} />,
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

            {/* Support Mascot & Tooltip */}
            {!isOpen && (
                <motion.div 
                    initial={{ opacity: 0, x: position === "right" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                        "absolute bottom-20 flex flex-col items-center pointer-events-none select-none",
                        position === "right" ? "right-0 items-end" : "left-0 items-start"
                    )}
                >
                    <motion.div
                        animate={{ 
                            y: [0, -10, 0],
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative"
                    >
                        <div className={cn(
                            "bg-white border border-slate-100 shadow-2xl rounded-2xl px-4 py-2 mb-4 relative",
                            position === "right" ? "mr-2" : "ml-2"
                        )}>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest whitespace-nowrap">
                                Need help? Contact us here
                            </p>
                            <div className={cn(
                                "absolute -bottom-2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white",
                                position === "right" ? "right-6" : "left-6"
                            )} />
                        </div>
                        
                        <div className={cn(
                            "w-20 h-20 relative bg-white rounded-full overflow-hidden",
                            position === "right" ? "mr-[-10px]" : "ml-[-10px]"
                        )}>
                            <Image 
                                src="/images/support-mascot.png" 
                                alt="Support Mascot"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
