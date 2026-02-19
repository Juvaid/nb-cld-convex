"use client";

import React, { useState } from "react";
import { Check, Search, Type } from "lucide-react";

const GOOGLE_FONTS = [
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Playfair Display", value: "'Playfair Display'" },
    { name: "Montserrat", value: "Montserrat" },
    { name: "Open Sans", value: "'Open Sans'" },
    { name: "Lato", value: "Lato" },
    { name: "Poppins", value: "Poppins" },
    { name: "Merriweather", value: "Merriweather" },
    { name: "Oswald", value: "Oswald" },
    { name: "Raleway", value: "Raleway" },
    { name: "Lora", value: "Lora" },
    { name: "Work Sans", value: "'Work Sans'" },
    { name: "Outfit", value: "Outfit" },
    { name: "Plus Jakarta Sans", value: "'Plus Jakarta Sans'" },
    { name: "Space Grotesk", value: "'Space Grotesk'" },
    { name: "Fraunces", value: "Fraunces" },
    { name: "Cormorant Garamond", value: "'Cormorant Garamond'" },
];

interface FontPickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function FontPicker({ value, onChange, label }: FontPickerProps) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredFonts = GOOGLE_FONTS.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedFont = GOOGLE_FONTS.find((f) => f.value === value) || { name: value, value };

    return (
        <div className="space-y-2 relative">
            {label && <label className="text-sm font-medium leading-none">{label}</label>}

            <div
                className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg cursor-pointer hover:bg-nb-green/5 hover:border-nb-green/30 transition-all group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-white border border-slate-100 shadow-sm text-slate-400 group-hover:text-nb-green transition-colors">
                        <Type className="w-3.5 h-3.5" />
                    </div>
                    <span
                        className="truncate font-bold text-slate-700"
                        style={{ fontFamily: "var(--selected-font)" } as React.CSSProperties}
                    >
                        <style dangerouslySetInnerHTML={{ __html: `:root { --selected-font: ${value.includes("'") ? value : `'${value}'`}, sans-serif; }` }} />
                        {selectedFont.name}
                    </span>
                </div>
                <Search className="w-4 h-4 text-slate-300 group-hover:text-nb-green transition-colors shrink-0" />
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-xl shadow-2xl z-50 max-h-[300px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2 border-bottom">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    autoFocus
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-nb-green/20 outline-none"
                                    placeholder="Search fonts..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                            {filteredFonts.length > 0 ? (
                                filteredFonts.map((font) => (
                                    <button
                                        key={font.value}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg hover:bg-nb-green/5 transition-colors group ${value === font.value ? "bg-nb-green/10 text-nb-green font-bold" : "text-slate-600"
                                            }`}
                                        onClick={() => {
                                            onChange(font.value);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        <span
                                            style={{ fontFamily: "var(--font-item)" } as React.CSSProperties & { "--font-item": string }}
                                            className="font-preview"
                                        >
                                            <style dangerouslySetInnerHTML={{ __html: `.font-preview-${font.value.replace(/['\s]/g, '')} { --font-item: ${font.value.includes("'") ? font.value : `'${font.value}'`}, sans-serif; }` }} />
                                            {font.name}
                                        </span>
                                        {value === font.value && <Check className="w-4 h-4" />}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-slate-400">
                                    No fonts found
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
