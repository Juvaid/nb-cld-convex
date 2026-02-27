"use client";

import { FileText, Download, ExternalLink } from "lucide-react";

interface Document {
    name: string;
    storageId: string;
}

interface DocumentListProps {
    documents: Document[];
    title?: string;
}

export function DocumentList({ documents, title = "Technical Documents" }: DocumentListProps) {
    if (!documents || documents.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                <FileText size={16} className="text-nb-green" />
                {title}
            </h3>
            <div className="grid grid-cols-1 gap-3">
                {documents.map((doc, idx) => (
                    <a
                        key={idx}
                        href={`/api/storage/${doc.storageId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-900/5 hover:border-nb-green/20 hover:shadow-lg hover:shadow-nb-green/5 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-nb-green/5 flex items-center justify-center text-nb-green group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 line-clamp-1">{doc.name}</span>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">PDF Catalog</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-nb-green group-hover:text-white transition-all">
                                <Download size={14} />
                            </div>
                            <ExternalLink size={14} className="text-slate-200 group-hover:text-nb-green transition-colors" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
