"use client";

import React from "react";
import Image from "next/image";
import { ComponentConfig } from "@puckeditor/core";
import { sharedFields } from "../fields/shared";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImagePicker } from "@/components/ImagePicker";
import { ProductSelector } from "../ProductSelector";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";

export interface ProductShowcaseProps {
    heading: string;
    subheading: string;
    featuredProduct: {
        productId?: string;
        title?: string;
        description?: string;
        image?: string;
        link?: string;
    };
    gridProducts: {
        itemData?: {
            productId?: string;
            title?: string;
            image?: string;
            link?: string;
        };
        // We still support flattened fields from legacy data to prevent UI breaks
        productId?: string;
        title?: string;
        image?: string;
        link?: string;
    }[];
    viewAllLink: string;
    viewAllText: string;
    paddingTop?: string;
    paddingBottom?: string;
}

export const ProductShowcaseBlock = ({
    heading,
    subheading,
    featuredProduct: manualFeatured,
    gridProducts: manualGrid,
    viewAllLink,
    viewAllText,
    paddingTop = "py-24",
    paddingBottom = "pb-24",
}: ProductShowcaseProps) => {
    const products = useQuery(api.products.listAll, { status: "active" });

    // Helper to merge manual data with dynamic product data
    const getProductData = (manual: any, isFeatured = false) => {
        let result = { ...manual };

        if (manual?.productId && products) {
            const dbProduct = products.find((p) => p._id === manual.productId);
            if (dbProduct) {
                const dbImg = dbProduct.images?.[0] as string | undefined;
                result = {
                    ...manual,
                    title: dbProduct.name || manual.title,
                    description: isFeatured ? (dbProduct.usp || manual.description) : undefined,
                    image: (dbImg !== "[object Object]" && dbImg) ? dbImg : manual.image,
                    link: `/products/${dbProduct.slug}`,
                };
            }
        }

        if (result.image && typeof result.image === "string" && !result.image.startsWith('http') && !result.image.startsWith('/api/storage/')) {
            result.image = `/api/storage/${result.image}`;
        }

        return result;
    };

    const featuredProduct = getProductData(manualFeatured, true);
    // Since we wrapped Grid Products properties into `itemData` to avoid Puck configuration limitations
    const gridProducts = manualGrid.map(p => getProductData((p as any).itemData || p));

    return (
        <section className={`w-full bg-slate-50 px-6 ${paddingTop} ${paddingBottom}`}>
            <div className="max-w-7xl mx-auto flex flex-col">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                            {heading}
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 font-medium">
                            {subheading}
                        </p>
                    </div>
                    <Link
                        href={viewAllLink || "#"}
                        className="group inline-flex items-center gap-2 text-[#15803d]/80 font-black uppercase tracking-widest text-sm hover:text-[#15803d] transition-colors"
                    >
                        {viewAllText}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Featured Product Area */}
                    <div className="lg:col-span-7 group flex flex-col rounded-[32px] overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-premium-xl transition-all duration-500 hover:-translate-y-1">
                        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[400px] overflow-hidden bg-slate-100">
                            {featuredProduct.image && (
                                <img
                                    src={featuredProduct.image}
                                    alt={featuredProduct.title || "Featured Product"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent opacity-60" />
                            <div className="absolute top-6 left-6 bg-nb-green text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                Featured
                            </div>
                        </div>
                        <div className="p-8 md:p-12 flex flex-col flex-1 justify-between bg-white relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                                    {featuredProduct.title}
                                </h3>
                                {(featuredProduct.description || manualFeatured.description) && (
                                    <p className="text-slate-600 font-medium leading-relaxed mb-8 max-w-lg">
                                        {featuredProduct.description || manualFeatured.description}
                                    </p>
                                )}
                            </div>
                            <Link href={featuredProduct.link || "#"}>
                                <Button variant="primary" size="md">
                                    Explore Formulation
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* 4 Item Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-8">
                        {gridProducts.slice(0, 4).map((product, idx) => (
                            <Link
                                key={idx}
                                href={product.link || "#"}
                                className="group flex flex-col rounded-[24px] overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-premium transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.title || "Product"}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                </div>
                                <div className="p-5">
                                    <h4 className="text-base font-bold text-slate-900 tracking-tight line-clamp-2 group-hover:text-nb-green transition-colors">
                                        {product.title}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export const ProductShowcaseBlockConfig: ComponentConfig<ProductShowcaseProps> = {
    fields: {
        heading: { type: "text" },
        subheading: { type: "textarea" },
        featuredProduct: {
            type: "custom",
            label: "Featured Product Settings",
            render: ({ value, onChange }: { value: any; onChange: (val: any) => void }) => {
                const isCustom = !value?.productId;
                return (
                    <div className="space-y-4">
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Select Database Product</label>
                            <ProductSelector
                                value={value?.productId || ""}
                                onChange={(pid) => onChange({ ...value, productId: pid })}
                            />
                        </div>

                        {isCustom && (
                            <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Or Use Manual Content</div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Title</label>
                                    <input
                                        type="text"
                                        title="Title"
                                        placeholder="Custom Title"
                                        value={value?.title || ""}
                                        onChange={(e) => onChange({ ...value, title: e.target.value })}
                                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Description</label>
                                    <textarea
                                        title="Description"
                                        placeholder="Custom Description"
                                        value={value?.description || ""}
                                        onChange={(e) => onChange({ ...value, description: e.target.value })}
                                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">ImageUpload</label>
                                    <ImagePicker
                                        value={value?.image || ""}
                                        onChange={(img) => onChange({ ...value, image: img })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Link</label>
                                    <input
                                        type="text"
                                        title="Link"
                                        placeholder="e.g. /products/custom"
                                        value={value?.link || ""}
                                        onChange={(e) => onChange({ ...value, link: e.target.value })}
                                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        },
        gridProducts: {
            type: "array",
            getItemSummary: (item) => item.title || item.productId || "Grid Product",
            arrayFields: {
                // We use a custom object field structure inside the array
                itemData: {
                    type: "custom",
                    label: "Product Configuration",
                    render: ({ value, onChange }: { value: any; onChange: (val: any) => void }) => {
                        const isCustom = !value?.productId;
                        return (
                            <div className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Select Database Product</label>
                                    <ProductSelector
                                        value={value?.productId || ""}
                                        onChange={(pid) => onChange({ ...value, productId: pid })}
                                    />
                                </div>

                                {isCustom && (
                                    <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Or Use Manual Content</div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Title</label>
                                            <input
                                                type="text"
                                                title="Title"
                                                placeholder="Custom Title"
                                                value={value?.title || ""}
                                                onChange={(e) => onChange({ ...value, title: e.target.value })}
                                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Image Upload</label>
                                            <ImagePicker
                                                value={value?.image || ""}
                                                onChange={(img) => onChange({ ...value, image: img })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Link</label>
                                            <input
                                                type="text"
                                                title="Link"
                                                placeholder="e.g. /products/custom"
                                                value={value?.link || ""}
                                                onChange={(e) => onChange({ ...value, link: e.target.value })}
                                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                }
            }
        },
        viewAllLink: { type: "text" },
        viewAllText: { type: "text" },
        ...sharedFields,
    },

    defaultProps: {
        heading: "Featured Formulations",
        subheading: "Discover our most popular private label collections, formulated with clinical-grade active ingredients and sustainable botanicals.",
        featuredProduct: {
            title: "Advanced Peptide Anti-Aging Complex",
            description: "A transformative serum combining matrixyl 3000, hyaluronic acid, and botanical stem cells to visibly reduce fine lines and restore youthful elasticity.",
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
            link: "/products/advanced-peptide-complex"
        },
        gridProducts: [
            {
                title: "Vitamin C Brightening Tonic",
                image: "https://images.unsplash.com/photo-1608248593842-8021c6a8b5cc?q=80&w=800&auto=format&fit=crop",
                link: "/products/vit-c-tonic"
            },
            {
                title: "Botanical Cleansing Oil",
                image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
                link: "/products/cleansing-oil"
            },
            {
                title: "Ceramide Barrier Repair",
                image: "https://images.unsplash.com/photo-1556228720-192b61cc801a?q=80&w=800&auto=format&fit=crop",
                link: "/products/barrier-repair"
            },
            {
                title: "AHA/BHA Resurfacing Mask",
                image: "https://images.unsplash.com/photo-1570194065650-d99fb4b8ceb0?q=80&w=800&auto=format&fit=crop",
                link: "/products/resurfacing-mask"
            }
        ],
        viewAllText: "View All Products",
        viewAllLink: "/products",
    },
    render: (props) => <ProductShowcaseBlock {...props} />,
};
