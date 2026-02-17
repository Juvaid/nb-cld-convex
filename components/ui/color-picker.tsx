"use client";

import { Input } from "./input";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative w-10 h-10 rounded-md overflow-hidden border border-input">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 cursor-pointer border-none"
                    aria-label="Choose color"
                    title="Choose color"
                />
            </div>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 font-mono uppercase"
                maxLength={7}
            />
        </div>
    );
}
