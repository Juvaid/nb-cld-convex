import React from "react";
import { FileText, Download, ExternalLink, Package } from "lucide-react";
import { sharedFields } from "../fields/shared";

export const DownloadCenterBlock = ({ 
    title = "Technical Resources & Catalogs",
    description = "Download our latest product catalogs, manufacturing brochures, and technical specifications.",
    items = [],
    ...props
}: any) => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-4">
                        {title}
                    </h2>
                    <p className="text-slate-600 font-medium">{description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any, idx: number) => (
                        <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col p-8 rounded-[32px] bg-white border border-slate-100 hover:border-nb-green/20 hover:shadow-2xl hover:shadow-nb-green/5 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-nb-green/5 flex items-center justify-center text-nb-green group-hover:bg-nb-green group-hover:text-white transition-all duration-500 border border-nb-green/10">
                                    <FileText size={28} />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-slate-900 group-hover:text-nb-green transition-colors">{item.name}</h4>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                        {item.fileSize || "PDF Document"}
                                    </span>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
                                {item.description}
                            </p>

                            <div className="flex items-center gap-2 text-nb-green text-sm font-bold">
                                <span>Download Now</span>
                                <Download size={16} className="group-hover:translate-y-1 transition-transform" />
                            </div>

                            {/* Decorative Background Icon */}
                            <FileText className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const DownloadCenterBlockConfig = {
    fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.name || "Download Item",
            arrayFields: {
                name: { type: "text" },
                description: { type: "textarea" },
                url: { type: "text", label: "Download URL (Storage ID or Link)" },
                fileSize: { type: "text", label: "File Size (e.g. 2.4 MB)" }
            }
        },
        ...sharedFields
    },
    defaultProps: {
        title: "Download Center",
        description: "Access our comprehensive library of technical documentation and product catalogs.",
        items: [
            { name: "Full Product Catalog 2026", description: "Our complete range of personal care and Ayurvedic formulations.", url: "#", fileSize: "12.4 MB" },
            { name: "Manufacturing Capabilities", description: "Detailed overview of our production scale, machinery, and R&D facility.", url: "#", fileSize: "4.8 MB" },
            { name: "Private Label Guide", description: "Step-by-step guide to launching your brand with Nature's Boon.", url: "#", fileSize: "3.2 MB" },
        ]
    },
    render: (props: any) => <DownloadCenterBlock {...props} />
};
