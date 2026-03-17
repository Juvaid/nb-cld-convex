"use client";

import { cn } from "@/lib/utils";

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
    return (
        <div className={cn("relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all", className)}>
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 cursor-pointer border-none"
                aria-label="Choose color"
                title="Choose color"
            />
        </div>
    );
}
