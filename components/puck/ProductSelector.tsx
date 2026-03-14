"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

interface ProductSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function ProductSelector({ value, onChange }: ProductSelectorProps) {
    const isClient = typeof window !== "undefined";
    const products = useQuery(api.products.listNames, isClient ? undefined : "skip");

    if (!isClient || products === undefined) {
        return (
            <div className="flex items-center gap-2 p-3 text-slate-500 bg-slate-50 rounded-lg text-sm italic">
                <Loader2 className="w-4 h-4 animate-spin" />
                Syncing with Convex database...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="p-3 text-amber-600 bg-amber-50 rounded-lg text-xs font-bold border border-amber-100">
                No products found in inventory.
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                title="Select a product"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green transition-all cursor-pointer"
            >
                <option value="" disabled>Select a product...</option>
                {products.map((product) => (
                    <option key={product._id} value={product._id}>
                        {product.name}
                    </option>
                ))}
            </select>
            {value && (
                <div className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-nb-green animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected: {products.find(p => p._id === value)?.name}</span>
                </div>
            )}
        </div>
    );
}
