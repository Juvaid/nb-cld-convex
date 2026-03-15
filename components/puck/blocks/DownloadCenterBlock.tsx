import React from "react";
import { FileText, Download, ExternalLink, Package, ShieldCheck, Zap, Layers, Globe } from "lucide-react";
import { sharedFields } from "../fields/shared";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const IconMap: Record<string, any> = {
    file: FileText,
    package: Package,
    shield: ShieldCheck,
    zap: Zap,
    layers: Layers,
    globe: Globe,
};

export const DownloadCenterBlock = ({ 
    title = "Technical Resources & Catalogs",
    description = "Download our latest product catalogs, manufacturing brochures, and technical specifications.",
    items = [],
    columns = "3",
    ...props
}: any) => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nb-green/20 to-transparent" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-nb-green/5 rounded-full blur-3xl" />
            
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-6"
                    >
                        {title}
                    </motion.h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">{description}</p>
                </div>

                <div className={cn(
                    "grid gap-8",
                    columns === "2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}>
                    {items.map((item: any, idx: number) => {
                        const Icon = IconMap[item.icon || "file"] || FileText;
                        return (
                            <a
                                key={idx}
                                href={item.url?.startsWith('http') || item.url?.startsWith('#') ? item.url : `https://lovely-peccary-641.eu-west-1.convex.site/api/storage/${item.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col p-10 rounded-[40px] bg-white border border-slate-100 hover:border-nb-green/30 hover:shadow-[0_30px_60px_-15px_rgba(30,58,138,0.1)] transition-all duration-700 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-16 h-16 rounded-[22px] bg-nb-green/5 flex items-center justify-center text-nb-green group-hover:bg-nb-green group-hover:text-white transition-all duration-500 shadow-sm border border-nb-green/10">
                                        <Icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-xl text-slate-900 group-hover:text-nb-green transition-colors leading-tight">{item.name}</h4>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">
                                            {item.fileSize || "PDF DOCUMENT"}
                                        </span>
                                    </div>
                                </div>
                                
                                <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-grow text-sm">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3 text-nb-green text-sm font-black uppercase tracking-widest">
                                        <span>Access Files</span>
                                        <div className="w-8 h-8 rounded-full bg-nb-green/10 flex items-center justify-center group-hover:bg-nb-green group-hover:text-white transition-all duration-500">
                                            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                                        </div>
                                    </div>
                                    {item.category && (
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-tighter">
                                            {item.category}
                                        </span>
                                    )}
                                </div>

                                {/* Abstract Background Detail */}
                                <Icon className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-700 group-hover:rotate-12" />
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export const DownloadCenterBlockConfig = {
    fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        columns: {
            type: "select",
            options: [
                { label: "2 Columns", value: "2" },
                { label: "3 Columns", value: "3" },
            ]
        },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.name || "Download Item",
            arrayFields: {
                name: { type: "text" },
                description: { type: "textarea" },
                url: { type: "text", label: "Download URL (Storage ID or Link)" },
                fileSize: { type: "text", label: "File Size (e.g. 2.4 MB)" },
                category: { type: "text", label: "Category Label (Optional)" },
                icon: {
                    type: "select",
                    options: [
                        { label: "File", value: "file" },
                        { label: "Package", value: "package" },
                        { label: "Shield", value: "shield" },
                        { label: "Zap", value: "zap" },
                        { label: "Layers", value: "layers" },
                        { label: "Globe", value: "globe" },
                    ]
                }
            }
        },
        ...sharedFields
    },
    defaultProps: {
        title: "Download Center",
        description: "Access our comprehensive library of technical documentation and product catalogs.",
        columns: "3",
        items: [
            { name: "Full Product Catalog 2026", description: "Our complete range of personal care and Ayurvedic formulations.", url: "#", fileSize: "12.4 MB", icon: "package", category: "Catalog" },
            { name: "Manufacturing Capabilities", description: "Detailed overview of our production scale, machinery, and R&D facility.", url: "#", fileSize: "4.8 MB", icon: "shield", category: "Technical" },
            { name: "Private Label Guide", description: "Step-by-step guide to launching your brand with Nature's Boon.", url: "#", fileSize: "3.2 MB", icon: "layers", category: "Guide" },
        ]
    },
    render: (props: any) => <DownloadCenterBlock {...props} />
};
