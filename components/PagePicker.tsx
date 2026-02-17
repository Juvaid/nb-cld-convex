"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Link as LinkIcon, ChevronDown } from "lucide-react";

interface PagePickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function PagePicker({ value, onChange }: PagePickerProps) {
    const pages = useQuery(api.pages.listPages);

    if (!pages) {
        return (
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider">Syncing Pages...</span>
            </div>
        );
    }

    return (
        <div className="relative group">
            <select
                title="Select a page"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-nb-green/10 focus:border-nb-green font-bold text-sm appearance-none cursor-pointer transition-all hover:border-slate-300"
            >
                <option value="">Choose a destination...</option>
                <optgroup label="Core Pages">
                    <option value="/">Home Page</option>
                </optgroup>
                <optgroup label="Created Pages">
                    {pages
                        .filter(p => p.path !== "/")
                        .map((page) => (
                            <option key={page._id} value={page.path}>
                                {page.title} ({page.path})
                            </option>
                        ))}
                </optgroup>
            </select>

            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-nb-green transition-colors">
                <LinkIcon size={16} />
            </div>

            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-slate-400 transition-colors">
                <ChevronDown size={18} />
            </div>
        </div>
    );
}
