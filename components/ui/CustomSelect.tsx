"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomSelectOption {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: CustomSelectOption[];
    placeholder?: string;
    label?: string;
    className?: string;
}

export function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    label,
    className
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Reset search when opening/closing
    useEffect(() => {
        if (!isOpen) setSearchTerm("");
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative min-w-[240px]", className)} ref={containerRef}>
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl transition-all duration-200",
                    "hover:border-nb-green/50 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-nb-green/10 focus:border-nb-green",
                    isOpen && "border-nb-green ring-4 ring-nb-green/10"
                )}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {selectedOption ? (
                        <>
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-nb-green/10 text-nb-green flex items-center justify-center">
                                {selectedOption.icon || <Layout size={16} />}
                            </div>
                            <div className="flex flex-col items-start truncate text-left">
                                <span className="text-xs font-bold text-slate-700 truncate w-full">
                                    {selectedOption.label}
                                </span>
                                {selectedOption.description && (
                                    <span className="text-[10px] text-slate-400 font-medium truncate w-full">
                                        {selectedOption.description}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <span className="text-sm text-slate-400 font-medium px-1">
                            {placeholder}
                        </span>
                    )}
                </div>
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2",
                        isOpen && "rotate-180 text-nb-green"
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[400px]">
                    <div className="p-2 border-b border-slate-50 sticky top-0 bg-white z-10">
                        <input
                            type="text"
                            placeholder="Search pages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-nb-green focus:ring-2 focus:ring-nb-green/10 placeholder:text-slate-400"
                            autoFocus
                        />
                    </div>
                    <div className="p-1.5 space-y-0.5 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-xs font-medium text-slate-400">No pages found</p>
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group",
                                        option.value === value
                                            ? "bg-nb-green/5 text-nb-green"
                                            : "hover:bg-slate-50 text-slate-600"
                                    )}
                                >
                                    <div className={cn(
                                        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        option.value === value
                                            ? "bg-nb-green text-white shadow-sm shadow-nb-green/20"
                                            : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-nb-green group-hover:shadow-sm"
                                    )}>
                                        {option.icon || <Layout size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={cn(
                                            "text-xs font-bold truncate transition-colors",
                                            option.value === value ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                                        )}>
                                            {option.label}
                                        </div>
                                        {option.description && (
                                            <div className="text-[10px] text-slate-400 truncate font-medium">
                                                {option.description}
                                            </div>
                                        )}
                                    </div>
                                    {option.value === value && (
                                        <Check size={14} className="text-nb-green flex-shrink-0" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
