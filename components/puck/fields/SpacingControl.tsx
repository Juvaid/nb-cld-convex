"use client";

import { cn } from "@/lib/utils";

const spacingOptions = [
    { label: "None", value: "0" },
    { label: "XS", value: "4" },
    { label: "S", value: "8" },
    { label: "M", value: "12" },
    { label: "L", value: "16" },
    { label: "XL", value: "24" },
    { label: "XXL", value: "32" },
];

interface SpacingControlProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function SpacingControl({ value, onChange, label }: SpacingControlProps) {
    return (
        <div className="space-y-3">
            {label && <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</div>}
            <div className="flex p-1 bg-slate-100/50 rounded-xl border border-slate-200">
                {spacingOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex-1 py-2 text-[10px] font-black rounded-lg transition-all",
                            value === option.value
                                ? "bg-white text-nb-green shadow-sm ring-1 ring-slate-200/50 scale-105 z-10"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                        title={`${option.label} (${option.value} units)`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <div className="flex justify-between px-1">
                <div className="h-1 w-0.5 bg-slate-200 rounded-full" />
                <div className="h-1 w-0.5 bg-slate-200 rounded-full" />
                <div className="h-1 w-0.5 bg-slate-200 rounded-full" />
                <div className="h-1 w-0.5 bg-slate-200 rounded-full" />
                <div className="h-1 w-0.5 bg-slate-100 rounded-full" />
                <div className="h-1 w-0.5 bg-slate-100 rounded-full" />
            </div>
        </div>
    );
}
