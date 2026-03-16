"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowRight, Package } from "lucide-react";

export interface MegaMenuConfig {
    enabled: boolean;
    type: "categories" | "custom" | "page-preview";
    featuredProductSlug?: string;
    featuredImage?: string;
    customColumns?: {
        heading: string;
        items: { label: string; href: string; description?: string }[];
    }[];
}

interface MegaMenuProps {
    config: MegaMenuConfig;
    isOpen: boolean;
    onClose: () => void;
}

export function MegaMenu({ config, isOpen, onClose }: MegaMenuProps) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
        >
            <div className="p-8">
                {config.type === "categories" && <CategoryMegaMenu featuredProductSlug={config.featuredProductSlug} />}
                {config.type === "page-preview" && <PagePreviewMenu config={config} />}
                {config.type === "custom" && <CustomColumnMenu config={config} />}
            </div>
        </motion.div>
    );
}

function CategoryMegaMenu({ featuredProductSlug }: { featuredProductSlug?: string }) {
    const categories = useQuery(api.categories.list);
    const productsLite = useQuery(api.products.listLite, { status: "active" });
    const featuredProduct = useQuery(api.products.getBySlug, featuredProductSlug ? { slug: featuredProductSlug } : "skip");

    const isLoading = !categories || !productsLite;

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    // Calculate product counts per category
    const categoryStats = categories.map((cat) => {
        const count = productsLite.filter((p) => p.categoryId === cat._id).length;
        return { ...cat, count };
    });

    return (
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 grid grid-cols-2 gap-4">
                {categoryStats.map((cat) => (
                    <Link
                        key={cat._id}
                        href={`/products?category=${cat._id}`}
                        className="group p-4 rounded-2xl bg-slate-50/50 hover:bg-nb-green/5 border border-transparent hover:border-nb-green/20 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-nb-green group-hover:scale-110 transition-transform">
                                {cat.image ? (
                                    <Image 
                                        src={cat.image.startsWith('http') ? cat.image : `/api/storage/${cat.image}`}
                                        alt={cat.name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                ) : (
                                    <Package size={24} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-nb-green transition-colors">{cat.name}</h4>
                                <p className="text-xs text-slate-500 font-medium">{cat.count} products</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="border-l border-slate-100 pl-8">
                {featuredProduct ? (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured Product</h4>
                        <Link href={`/products/${featuredProduct.slug}`} className="block group">
                            <div className="aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden relative mb-4">
                                {featuredProduct.images?.[0] && (
                                    <Image
                                        src={featuredProduct.images[0].startsWith('http') ? featuredProduct.images[0] : `/api/storage/${featuredProduct.images[0]}`}
                                        alt={featuredProduct.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                            </div>
                            <h5 className="font-bold text-slate-900 group-hover:text-nb-green transition-colors">{featuredProduct.name}</h5>
                            <span className="text-nb-green text-xs font-bold flex items-center gap-1 mt-1">
                                View product <ArrowRight size={12} />
                            </span>
                        </Link>
                    </div>
                ) : (
                    <div className="h-full flex flex-col justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Explore our full catalog</p>
                        <Link href="/products" className="text-nb-green text-xs font-black mt-2 hover:underline">
                            Browse All
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function PagePreviewMenu({ config }: { config: MegaMenuConfig }) {
    return (
        <div className="grid grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Discover More</h3>
                <p className="text-slate-500 leading-relaxed">
                    Explore our detailed services, manufacturing capabilities, and quality standards that set us apart in the industry.
                </p>
                <Link href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-nb-green text-white rounded-full font-bold text-sm hover:shadow-lg transition-all hover:-translate-y-1">
                    Get Started <ChevronRight size={16} />
                </Link>
            </div>
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 shadow-2xl border-4 border-white">
                {config.featuredImage && (
                    <Image 
                        src={config.featuredImage.startsWith('http') ? config.featuredImage : `/api/storage/${config.featuredImage}`}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                )}
            </div>
        </div>
    );
}

function CustomColumnMenu({ config }: { config: MegaMenuConfig }) {
    return (
        <div className="grid grid-cols-3 gap-8">
            {config.customColumns?.map((col, idx) => (
                <div key={idx} className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{col.heading}</h4>
                    <div className="flex flex-col gap-1">
                        {col.items.map((item, i) => (
                            <Link 
                                key={i} 
                                href={item.href}
                                className="group py-2 flex flex-col"
                            >
                                <span className="font-bold text-slate-900 group-hover:text-nb-green transition-colors">{item.label}</span>
                                {item.description && (
                                    <span className="text-[10px] text-slate-500 font-medium">{item.description}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
