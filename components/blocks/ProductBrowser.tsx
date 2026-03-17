"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Filter, X, ChevronDown, Package } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { DocumentList } from './DocumentList';
import { Skeleton } from '@/components/ui/Skeleton';

export interface ProductItem {
    name: string;
    usp: string;
    slug: string;
    sku?: string;
    images?: string[];
    moq?: number;
    pricingTiers?: { minQty: number; price: number }[];
}

export interface ProductCategoryData {
    name: string;
    slug: string;
    description: string;
    products: ProductItem[];
    documents?: { name: string; storageId: string }[];
}

export interface ProductBrowserProps {
    categories?: ProductCategoryData[];
    useDynamicData?: boolean;
    initialDbCategories?: any[];
    initialDbProducts?: any[];
}

export default function ProductBrowser({ categories: initialCategories = [], useDynamicData = false, initialDbCategories, initialDbProducts, ...props }: ProductBrowserProps & Record<string, any>) {
    const id = props.id;
    const dataBlock = props["data-block"];
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch live data, but fallback to initialDb data if provided for SSR/SEO
    const liveCategories = useQuery(api.categories.list);
    const liveProducts = useQuery(api.products.listAll, { status: "active" });

    const dbCategories = liveCategories !== undefined ? liveCategories : initialDbCategories;
    const dbProducts = liveProducts !== undefined ? liveProducts : initialDbProducts;

    // Use dynamic data if requested or if initialCategories is empty
    const shouldShowDynamic = useDynamicData || initialCategories.length === 0;

    let displayCategories: ProductCategoryData[] = initialCategories;

    if (shouldShowDynamic && dbCategories && dbProducts) {
        displayCategories = dbCategories.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            products: dbProducts
                .filter(p => p.categoryId === cat._id)
                .map(p => ({
                    name: p.name,
                    usp: p.usp || "",
                    slug: p.slug,
                    sku: p.sku,
                    images: p.images,
                    moq: p.moq,
                    pricingTiers: p.pricingTiers
                })),
            documents: (cat as any).meta?.documents
        })).filter(cat => cat.products.length > 0);
    }

    // Filter by search query using rich text tokenization
    const searchTokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const filteredCategories = searchTokens.length === 0
        ? displayCategories
        : displayCategories.map(cat => {
            const matchingProducts = cat.products.filter(p => {
                // Combine all searchable fields for rich search
                const searchableText = [
                    cat.name,
                    cat.description,
                    p.name,
                    p.usp || "",
                    p.sku || ""
                ].join(" ").toLowerCase();

                // Check if ALL search tokens are present in the combined text
                return searchTokens.every(token => searchableText.includes(token));
            });
            return {
                ...cat,
                products: matchingProducts
            };
        }).filter(cat => cat.products.length > 0);
    if (!displayCategories || displayCategories.length === 0) {
        if (shouldShowDynamic && (!dbCategories || !dbProducts)) {
            return (
                <section id={id} data-block={dataBlock} aria-label="Product catalog skeleton" className="py-20 max-w-7xl mx-auto px-4 w-full">
                    {/* Header Skeleton */}
                    <div className="flex items-center gap-4 mb-8">
                        <Skeleton className="w-1/4 h-10" />
                        <Skeleton className="flex-1 h-10 rounded-xl" />
                    </div>
                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <Skeleton key={i} className="w-full h-64 sm:h-80 rounded-2xl md:rounded-[32px]" />
                        ))}
                    </div>
                </section>
            );
        }
        return <section id={id} data-block={dataBlock} aria-label="Product catalog empty" className="py-20 text-center text-slate-500">No products configured.</section>;
    }

    const categories = filteredCategories;

    return (
        <section id={id} data-block={dataBlock} aria-label="Product catalog">
            {/* Category filters */}
            <div
                className="sticky top-[56px] md:top-[80px] z-40 bg-white/95 backdrop-blur-xl border-b border-slate-900/5 !py-0 !p-0"
            >
                {/* Main Bar */}
                <div className="max-w-7xl mx-auto px-4 h-12 md:h-14 flex items-center justify-between gap-4 overflow-hidden">
                    {/* Left: Filter Toggle (Mobile Only) / Categories (Desktop) */}
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Mobile: Filter Toggle */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-all"
                                title={isFilterOpen ? "Close filters" : "Open filters"}
                            >
                                {isFilterOpen ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Desktop: Categories */}
                        <div className="hidden lg:flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                            {displayCategories.map((cat) => (
                                <a
                                    key={cat.slug}
                                    href={`#${cat.slug}`}
                                    className="px-3 py-1.5 text-[11px] font-bold rounded-full border border-slate-900/5 hover:border-nb-green hover:bg-nb-green/5 hover:text-nb-green transition-all text-slate-600 bg-slate-50 whitespace-nowrap"
                                >
                                    {cat.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: Search Bar */}
                    <div className="relative flex-1 max-w-[280px] sm:max-w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-nb-green transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-8 pr-3 py-2 text-[10px] md:text-xs border border-slate-900/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-nb-green/10 bg-slate-50 focus:bg-white transition-all font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 transition-colors"
                                title="Clear search"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile: Animated Category Menu */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden lg:hidden bg-white border-t border-slate-50"
                        >
                            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 gap-2">
                                {displayCategories.map((cat) => (
                                    <a
                                        key={cat.slug}
                                        href={`#${cat.slug}`}
                                        onClick={() => setIsFilterOpen(false)}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-900/5 text-slate-900 text-sm font-bold hover:bg-white hover:border-nb-green transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-nb-green shadow-sm border border-slate-900/5">
                                                <Package className="w-3.5 h-3.5" />
                                            </div>
                                            {cat.name}
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-nb-green group-hover:translate-x-1 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Product categories */}
            <section className="py-2 md:py-8 bg-transparent">
                <div className="max-w-7xl mx-auto space-y-12 px-4">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.slug} id={cat.slug} className="scroll-mt-40">
                                <div className="mb-2 md:mb-4 border-b border-slate-900/5 pb-1 md:pb-2">
                                    <h2 className="text-lg md:text-2xl font-black text-slate-900">{cat.name}</h2>
                                    <p className="text-slate-500 mt-0.5 max-w-3xl text-[11px] md:text-sm font-medium">{cat.description}</p>
                                    {cat.documents && cat.documents.length > 0 && (
                                        <div className="mt-4 max-w-md">
                                            <DocumentList documents={cat.documents} title="Download Catalog" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                    {(cat.products || []).map((product, idx) => {
                                        const sharedClass = "group rounded-[28px] border border-slate-100 bg-white hover:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-2 overflow-hidden flex flex-col";
                                        const inner = (
                                            <>
                                                <div className="aspect-square bg-[#F9FAFB] flex items-center justify-center relative overflow-hidden">
                                                    {product.images && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0] !== "[object Object]" ? (
                                                        <Image
                                                            src={product.images[0].startsWith('http') ? product.images[0] : `/api/storage/${product.images[0]}`}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover relative z-10 group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                        />
                                                    ) : (
                                                        <span className="text-3xl opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 font-serif italic text-nb-green">NB</span>
                                                    )}
                                                    
                                                    {/* Floating USP Badge */}
                                                    {product.usp && (
                                                        <div className="absolute top-2 left-2 z-30">
                                                            <span className="backdrop-blur-sm bg-white/90 text-nb-green text-[7px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-nb-green/5 shadow-sm">
                                                                {product.usp}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/5 opacity-40 z-20" />
                                                </div>
                                                <div className="p-3 sm:p-4 flex flex-col flex-1 items-center text-center">
                                                    <div className="flex-1 w-full flex flex-col items-center">
                                                        <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-0.5 line-clamp-1 leading-tight tracking-tight uppercase group-hover:text-nb-green transition-colors duration-500">
                                                            {product.name}
                                                        </h3>
                                                        
                                                        <div className="flex items-center justify-center gap-1.5 mb-2.5">
                                                            {product.moq && (
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                    Min. {product.moq}
                                                                </span>
                                                            )}
                                                            {product.sku && (
                                                                <span className="text-[8px] font-medium text-slate-300 uppercase tracking-widest">
                                                                    • {product.sku}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {product.pricingTiers && product.pricingTiers.length > 0 && (
                                                            <div className="mb-3.5 flex flex-col items-center">
                                                                <span className="text-[10px] sm:text-xs font-black text-nb-green">
                                                                    ₹{product.pricingTiers[0].price}
                                                                </span>
                                                                <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Wholesale</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div
                                                        className="flex items-center h-8 sm:h-9 gap-1.5 text-[9px] font-bold text-white bg-slate-900 px-4 rounded-full hover:bg-nb-green transition-all duration-500 w-fit justify-center group/btn relative overflow-hidden shadow-lg shadow-slate-900/10"
                                                    >
                                                        <span className="relative z-10 uppercase tracking-[0.15em]">Explore</span>
                                                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-500 relative z-10" />
                                                    </div>
                                                </div>

                                            </>
                                        );
                                        return product.slug
                                            ? <Link key={product.slug} href={`/products/${product.slug}`} className={sharedClass}>{inner}</Link>
                                            : <div key={`no-slug-${idx}`} className={sharedClass + " cursor-default"}>{inner}</div>;
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div className="text-5xl mb-6">🔍</div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">No matching formulations</h3>
                            <p className="text-slate-500">Try adjusting your search terms or browse categories</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-6 text-nb-green font-black hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>
            </section >
        </section>
    );
}
