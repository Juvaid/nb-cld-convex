"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Phone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.603 6.02L0 24l6.135-1.61a11.758 11.758 0 005.91 1.583h.005c6.637 0 12.05-5.417 12.05-12.053a11.83 11.83 0 00-3.41-8.517z" />
    </svg>
);

export const FloatingWidget = () => {
    if (typeof window === "undefined") return null;
    const pathname = usePathname();
    const settings = useQuery(api.siteSettings.getSiteSettings);

    // Hide on admin and editor pages
    const isHiddenPath = pathname?.startsWith("/admin") || pathname?.startsWith("/puck");

    const widgetConfig = settings?.floating_widget || {
        enabled: false,
        position: "right",
        vAlign: "bottom", // new field: top, middle, bottom
        whatsapp: "",
        phone: "",
        catalogStorageId: "",
    };

    if (!widgetConfig.enabled || isHiddenPath) return null;

    const items = [
        {
            icon: <WhatsAppIcon className="w-5 h-5 md:w-8 md:h-8" />,
            label: "WhatsApp",
            href: `https://wa.me/${widgetConfig.whatsapp?.replace(/\D/g, "")}`,
            show: !!widgetConfig.whatsapp,
            color: "bg-[#25D366]",
            hoverColor: "hover:bg-[#128C7E]",
        },
        {
            icon: <Phone className="w-5 h-5 md:w-8 md:h-8" />,
            label: "Call Us",
            href: `tel:${widgetConfig.phone?.replace(/\D/g, "")}`,
            show: !!widgetConfig.phone,
            color: "bg-blue-600",
            hoverColor: "hover:bg-blue-700",
        },
        {
            icon: <FileText className="w-5 h-5 md:w-8 md:h-8" />,
            label: "Catalog",
            href: widgetConfig.catalogStorageId ? (widgetConfig.catalogStorageId.startsWith('http') ? widgetConfig.catalogStorageId : `/api/storage/${widgetConfig.catalogStorageId}`) : "#",
            show: !!widgetConfig.catalogStorageId && widgetConfig.catalogStorageId.trim() !== "",
            color: "bg-nb-green",
            hoverColor: "hover:bg-nb-green/90",
            download: true,
        },
    ].filter(item => item.show);

    if (items.length === 0) return null;

    const verticalClass =
        widgetConfig.vAlign === "top" ? "top-20" :
            widgetConfig.vAlign === "middle" ? "top-1/2 -translate-y-1/2" :
                "bottom-8";

    return (
        <div
            className={cn(
                "fixed z-[10001] flex flex-col gap-4 animate-fade-in-up md:gap-5 transition-all duration-500",
                verticalClass,
                widgetConfig.position === "left" ? "left-6" : "right-6"
            )}
        >
            {items.map((item, idx) => (
                <div key={idx} className="group relative">
                    {/* Tooltip */}
                    <div
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-2xl border border-white/10 translate-x-2",
                            widgetConfig.position === "left"
                                ? "left-full ml-4"
                                : "right-full mr-4 -translate-x-2"
                        )}
                    >
                        {item.label}
                        {/* Triangle decorator */}
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 border-6",
                            widgetConfig.position === "left"
                                ? "right-full border-r-slate-900 border-t-transparent border-b-transparent border-l-transparent"
                                : "left-full border-l-slate-900 border-t-transparent border-b-transparent border-r-transparent"
                        )} />
                    </div>

                    <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={item.download}
                        className={cn(
                            "w-11 h-11 md:w-16 md:h-16 rounded-[18px] md:rounded-[22px] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-all duration-300 ring-2 md:ring-4 ring-white/20 hover:ring-white/40",
                            item.color,
                            item.hoverColor
                        )}
                    >
                        {item.icon}
                    </a>
                </div>
            ))}
        </div>
    );
};
