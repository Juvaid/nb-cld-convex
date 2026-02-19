"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Filter, X, ChevronDown, Package } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProductItem {
    name: string;
    usp: string;
    slug: string;
    sku?: string;
    images?: string[];
}

export interface ProductCategoryData {
    name: string;
    slug: string;
    description: string;
    products: ProductItem[];
}

export interface ProductBrowserProps {
    categories?: ProductCategoryData[];
    useDynamicData?: boolean;
}

export default function ProductBrowser({ categories: initialCategories = [], useDynamicData = false }: ProductBrowserProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dbCategories = useQuery(api.categories.list);
    const dbProducts = useQuery(api.products.listAll, { status: "active" });

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
                    images: p.images
                }))
        })).filter(cat => cat.products.length > 0);
    }

    // Filter by search query
    const filteredCategories = searchQuery.trim() === ""
        ? displayCategories
        : displayCategories.map(cat => ({
            ...cat,
            products: cat.products.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.usp.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.products.length > 0);

    if (!displayCategories || displayCategories.length === 0) {
        if (shouldShowDynamic && (!dbCategories || !dbProducts)) {
            return (
                <div className="py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nb-green mx-auto mb-4" />
                    <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Catalog...</div>
                </div>
            );
        }
        return <div className="py-20 text-center text-slate-500">No products configured.</div>;
    }

    const categories = filteredCategories;

    return (
        <>
            {/* Category filters */}
            <section className="sticky top-[80px] z-40 bg-white/90 backdrop-blur-xl border-b border-slate-900/5 py-3 md:py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center justify-between gap-4 md:justify-start">
                            {/* Mobile: Filter Toggle */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
                                >
                                    {isFilterOpen ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                                    {isFilterOpen ? "Close" : "Filter"}
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* Desktop: Horizontal Categories */}
                            <div className="hidden md:flex flex-wrap items-center gap-3">
                                {displayCategories.map((cat) => (
                                    <a
                                        key={cat.slug}
                                        href={`#${cat.slug}`}
                                        className="px-5 py-2.5 text-sm font-bold rounded-full border border-slate-900/5 hover:border-nb-green hover:bg-nb-green/5 hover:text-nb-green transition-all text-slate-600 bg-slate-50"
                                    >
                                        {cat.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-sm md:max-w-xs group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-nb-green transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search range..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-900/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-nb-green/10 bg-slate-50 focus:bg-white transition-all font-medium"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 transition-colors"
                                    title="Clear search"
                                >
                                    <X className="w-3.5 h-3.5" />
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
                                className="overflow-hidden md:hidden"
                            >
                                <div className="grid grid-cols-1 gap-2 pt-6 pb-2">
                                    {displayCategories.map((cat) => (
                                        <a
                                            key={cat.slug}
                                            href={`#${cat.slug}`}
                                            onClick={() => setIsFilterOpen(false)}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-900/5 text-slate-900 font-bold hover:bg-white hover:border-nb-green transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-nb-green shadow-sm border border-slate-900/5">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                {cat.name}
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-nb-green group-hover:translate-x-1 transition-all" />
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Product categories */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto space-y-12 px-4">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.slug} id={cat.slug} className="scroll-mt-40">
                                <div className="mb-8 border-b border-slate-900/5 pb-4">
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">{cat.name}</h2>
                                    <p className="text-slate-500 mt-2 max-w-3xl font-medium">{cat.description}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {(cat.products || []).map((product, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/products/${product.slug}`}
                                            className="group rounded-[32px] border border-slate-900/5 bg-white hover:shadow-2xl hover:shadow-nb-green/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
                                        >
                                            <div className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden h-64 sm:h-auto">
                                                {product.images && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0] !== "[object Object]" ? (
                                                    <img
                                                        src={product.images[0].startsWith('http') ? product.images[0] : `/api/storage/${product.images[0]}`}
                                                        className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-1000"
                                                        alt={product.name}
                                                    />
                                                ) : (
                                                    <span className="text-4xl opacity-30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">🌿</span>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-br from-nb-green-soft/10 to-nb-green-deep/10 opacity-50" />
                                            </div>
                                            <div className="p-6 sm:p-7 flex flex-col flex-1">
                                                <div className="flex-1">
                                                    {product.usp && (
                                                        <span className="inline-block px-3 py-1 text-[10px] font-black text-nb-green bg-nb-green/5 rounded-full mb-3 tracking-widest uppercase border border-nb-green/10">
                                                            {product.usp}
                                                        </span>
                                                    )}
                                                    <h3 className="text-lg font-black text-slate-900 mb-1 line-clamp-2 leading-snug">
                                                        {product.name}
                                                    </h3>
                                                    {product.sku && (
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                                            SKU: {product.sku}
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className="inline-flex items-center h-12 gap-2 text-sm font-black text-white bg-slate-900 px-6 rounded-2xl hover:bg-gradient-to-r hover:from-nb-green hover:to-nb-green-deep hover:shadow-xl hover:shadow-nb-green/20 transition-all w-full justify-center group/btn"
                                                >
                                                    Details
                                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
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
            </section>
        </>
    );
}
