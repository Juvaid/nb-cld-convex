import React from "react";
import Image from "next/image";
import { ComponentConfig } from "@puckeditor/core";
import { sharedFields } from "../fields/shared";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface ProductShowcaseProps {
    heading: string;
    subheading: string;
    featuredProduct: {
        title: string;
        description: string;
        image: string;
        link: string;
    };
    gridProducts: {
        title: string;
        image: string;
        link: string;
    }[];
    viewAllLink: string;
    viewAllText: string;
    paddingTop?: string;
    paddingBottom?: string;
}

export const ProductShowcaseBlock = ({
    heading,
    subheading,
    featuredProduct,
    gridProducts,
    viewAllLink,
    viewAllText,
    paddingTop = "py-24",
    paddingBottom = "pb-24",
}: ProductShowcaseProps) => {
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
                        href={viewAllLink}
                        className="group inline-flex items-center gap-2 text-nb-green-900 font-black uppercase tracking-widest text-sm hover:text-nb-green transition-colors"
                    >
                        {viewAllText}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Featured Product Area */}
                    <div className="lg:col-span-7 group flex flex-col rounded-[32px] overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-nb-green/30 hover:shadow-[0_20px_40px_rgba(43,238,108,0.1)] transition-all duration-500">
                        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[400px] overflow-hidden bg-slate-100">
                            {featuredProduct.image && (
                                <Image
                                    src={featuredProduct.image}
                                    alt={featuredProduct.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
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
                                <p className="text-slate-600 font-medium leading-relaxed mb-8 max-w-lg">
                                    {featuredProduct.description}
                                </p>
                            </div>
                            <Link
                                href={featuredProduct.link}
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-nb-green hover:text-slate-900 transition-colors self-start"
                            >
                                Explore Formulation
                            </Link>
                        </div>
                    </div>

                    {/* 4 Item Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-8">
                        {gridProducts.slice(0, 4).map((product, idx) => (
                            <Link
                                key={idx}
                                href={product.link}
                                className="group flex flex-col rounded-[24px] overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 hover:border-nb-green/30 transition-all duration-300"
                            >
                                <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                                    {product.image && (
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            sizes="(max-width: 1024px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
            type: "object",
            objectFields: {
                title: { type: "text" },
                description: { type: "textarea" },
                image: { type: "text", label: "Image URL (Unsplash/Convex)" },
                link: { type: "text" }
            }
        },
        gridProducts: {
            type: "array",
            getItemSummary: (item) => item.title || "Grid Product",
            arrayFields: {
                title: { type: "text" },
                image: { type: "text", label: "Image URL (Unsplash/Convex)" },
                link: { type: "text" }
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
