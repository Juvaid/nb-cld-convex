"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Layout, Image as ImageIcon, Package, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ImagePicker } from "@/components/ImagePicker";
import { cn } from "@/lib/utils";
import { MegaMenuConfig } from "@/components/MegaMenu";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface MegaMenuConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: MegaMenuConfig) => void;
    initialConfig?: MegaMenuConfig;
}

export function MegaMenuConfigModal({ isOpen, onClose, onSave, initialConfig }: MegaMenuConfigModalProps) {
    const products = useQuery(api.products.listNames) || [];
    
    const [config, setConfig] = useState<MegaMenuConfig>(initialConfig || {
        enabled: false,
        type: "categories",
        customColumns: []
    });

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);

    if (!isOpen) return null;

    const handleAddColumn = () => {
        const newCols = config.customColumns || [];
        setConfig({
            ...config,
            customColumns: [...newCols, { heading: "New Column", items: [] }]
        });
    };

    const handleAddItem = (colIdx: number) => {
        const newCols = [...(config.customColumns || [])];
        newCols[colIdx].items.push({ label: "New Item", href: "/", description: "" });
        setConfig({ ...config, customColumns: newCols });
    };

    const handleUpdateItem = (colIdx: number, itemIdx: number, field: string, value: string) => {
        const newCols = [...(config.customColumns || [])];
        newCols[colIdx].items[itemIdx] = { ...newCols[colIdx].items[itemIdx], [field]: value };
        setConfig({ ...config, customColumns: newCols });
    };

    const handleRemoveItem = (colIdx: number, itemIdx: number) => {
        const newCols = [...(config.customColumns || [])];
        newCols[colIdx].items.splice(itemIdx, 1);
        setConfig({ ...config, customColumns: newCols });
    };

    const handleRemoveColumn = (colIdx: number) => {
        const newCols = [...(config.customColumns || [])];
        newCols.splice(colIdx, 1);
        setConfig({ ...config, customColumns: newCols });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Layout className="w-5 h-5 text-nb-green" />
                            Mega Menu Configuration
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">Design the rich dropdown experience for this navigation node.</p>
                    </div>
                    <button onClick={onClose} title="Close Modal" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Core Status */}
                    <div className="flex items-center justify-between p-6 bg-nb-green/5 rounded-3xl border border-nb-green/10">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", config.enabled ? "bg-nb-green text-white" : "bg-white text-slate-300")}>
                                <Layout size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Enable Dropdown</h4>
                                <p className="text-xs text-slate-500 font-medium">Toggle the rich mega menu for this link.</p>
                            </div>
                        </div>
                        <Button 
                            variant={config.enabled ? "primary" : "outline"}
                            size="sm"
                            className={cn("h-10 px-6 rounded-xl font-bold", !config.enabled && "opacity-50")}
                            onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                        >
                            {config.enabled ? "ACTIVE" : "INACTIVE"}
                        </Button>
                    </div>

                    {config.enabled && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            {/* Type Selector */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Dropdown Mode</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: "categories", label: "Catalog Grid", desc: "Auto Categories & Products", icon: <Package size={20} /> },
                                        { id: "page-preview", label: "Page Highlight", desc: "Hero Image & Description", icon: <ImageIcon size={20} /> },
                                        { id: "custom", label: "Custom Layout", desc: "Manual Links & Columns", icon: <FileText size={20} /> }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setConfig({ ...config, type: type.id as any })}
                                            className={cn(
                                                "p-4 rounded-3xl border-2 text-left transition-all group",
                                                config.type === type.id 
                                                    ? "border-nb-green bg-nb-green/5 ring-4 ring-nb-green/10" 
                                                    : "border-slate-100 bg-white hover:border-slate-200"
                                            )}
                                        >
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", config.type === type.id ? "bg-nb-green text-white" : "bg-slate-100 text-slate-400")}>
                                                {type.icon}
                                            </div>
                                            <h5 className="font-bold text-slate-900 text-sm">{type.label}</h5>
                                            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">{type.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contextual Config */}
                            <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100">
                                {config.type === "categories" && (
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-slate-900 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-nb-green" /> Catalog Settings
                                        </h5>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Featured Product Sidebar</label>
                                            <select 
                                                value={config.featuredProductSlug || ""}
                                                onChange={(e) => setConfig({ ...config, featuredProductSlug: e.target.value })}
                                                className="w-full h-12 px-4 rounded-xl border-slate-200 text-sm font-medium focus:ring-nb-green"
                                                title="Select Featured Product"
                                            >
                                                <option value="">None (Show Explore Catalog)</option>
                                                {products.map(p => (
                                                    <option key={p._id} value={p.slug}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {config.type === "page-preview" && (
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-slate-900 flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-nb-green" /> Hero Configuration
                                        </h5>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Featured Image</label>
                                            <ImagePicker 
                                                value={config.featuredImage || ""}
                                                onChange={(val) => setConfig({ ...config, featuredImage: val })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {config.type === "custom" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-bold text-slate-900 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-nb-green" /> Column Builder
                                            </h5>
                                            <Button size="sm" variant="outline" onClick={handleAddColumn} className="h-8 rounded-lg text-[10px] font-black uppercase">
                                                <Plus size={14} className="mr-1" /> Add Column
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {config.customColumns?.map((col, cIdx) => (
                                                <div key={cIdx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <input 
                                                            className="text-xs font-black uppercase tracking-widest text-nb-green border-none bg-transparent p-0 focus:ring-0 w-full"
                                                            value={col.heading}
                                                            placeholder="Column Heading"
                                                            title="Column Heading"
                                                            onChange={(e) => {
                                                                const newCols = [...(config.customColumns || [])];
                                                                newCols[cIdx].heading = e.target.value;
                                                                setConfig({ ...config, customColumns: newCols });
                                                            }}
                                                        />
                                                        <button 
                                                            onClick={() => handleRemoveColumn(cIdx)} 
                                                            className="text-slate-300 hover:text-rose-500"
                                                            title="Remove Column"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {col.items.map((item, iIdx) => (
                                                            <div key={iIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                                                                <div className="flex-1 space-y-1">
                                                                    <Input 
                                                                        className="h-6 text-[10px] font-bold border-none bg-transparent p-0"
                                                                        value={item.label}
                                                                        placeholder="Label"
                                                                        onChange={(e) => handleUpdateItem(cIdx, iIdx, "label", e.target.value)}
                                                                    />
                                                                    <Input 
                                                                        className="h-5 text-[9px] text-slate-500 border-none bg-transparent p-0"
                                                                        value={item.href}
                                                                        placeholder="URL"
                                                                        onChange={(e) => handleUpdateItem(cIdx, iIdx, "href", e.target.value)}
                                                                    />
                                                                </div>
                                                                <button 
                                                                    onClick={() => handleRemoveItem(cIdx, iIdx)} 
                                                                    className="text-slate-300 hover:text-rose-500 p-1"
                                                                    title="Remove Item"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button 
                                                            onClick={() => handleAddItem(cIdx)}
                                                            className="w-full py-2 rounded-xl border border-dashed border-slate-200 text-slate-400 hover:text-nb-green hover:border-nb-green/30 transition-all text-[10px] font-bold"
                                                        >
                                                            + Add Link
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-xl px-8">Cancel</Button>
                    <Button onClick={() => { onSave(config); onClose(); }} className="rounded-xl px-12 font-bold shadow-lg">Apply Configuration</Button>
                </div>
            </div>
        </div>
    );
}

function Sparkles(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
