"use client";

import { cn } from "@/lib/utils";
import { Check, Pipette } from "lucide-react";

const brandPalette = [
    { name: "Emerald (Primary)", value: "#2bee6c" },
    { name: "Navy (Secondary)", value: "#0f172a" },
    { name: "Sage Green", value: "#22c55e" },
    { name: "Slate Dark", value: "#1e293b" },
    { name: "Slate Light", value: "#f8fafc" },
    { name: "White", value: "#ffffff" },
    { name: "Transparent", value: "transparent" },
];

interface VisualColorPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function VisualColorPicker({ value, onChange }: VisualColorPickerProps) {
    return (
        <div className="space-y-3 p-1">
            <div className="grid grid-cols-7 gap-2">
                {brandPalette.map((color) => (
                    <button
                        key={color.value}
                        onClick={() => onChange(color.value)}
                        className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all relative group flex items-center justify-center",
                            `[--btn-bg:${color.value === "transparent" ? "white" : color.value}] bg-[var(--btn-bg)]`,
                            value === color.value ? "border-nb-green scale-110 shadow-lg" : "border-slate-200 hover:border-slate-300",
                            color.value === "transparent" ? "overflow-hidden" : ""
                        )}
                        title={color.name}
                    >
                        {color.value === "transparent" && (
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_50%,#ccc_50%,#ccc_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
                        )}
                        {value === color.value && (
                            <Check className={cn("w-4 h-4 z-10", color.value === "#ffffff" || color.value === "#f8fafc" || color.value === "transparent" ? "text-slate-900" : "text-white")} strokeWidth={4} />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm shrink-0">
                    <input
                        type="color"
                        value={value === "transparent" ? "#ffffff" : value}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 cursor-pointer border-none"
                        title="Custom Color"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/5">
                        <Pipette size={14} className="text-slate-600" />
                    </div>
                </div>
                <div className="flex-grow">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-600 focus:outline-none focus:border-nb-green transition-all"
                        placeholder="#HEX"
                    />
                </div>
            </div>
        </div>
    );
}
