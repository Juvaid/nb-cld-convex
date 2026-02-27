"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    X,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Leaf,
    Droplets,
    Atom,
    Package,
    ArrowLeft,
    CheckCircle2,
    Factory,
    Globe2,
    FlaskConical,
    FileCheck2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactForm from "./ContactForm";
import { DocumentList } from "./DocumentList";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";

interface ProductDetailProps {
    slug: string;
    isModal?: boolean;
    onClose?: () => void;
}

export default function ProductDetail({ slug, isModal = false, onClose }: ProductDetailProps) {
    const router = useRouter();
    const product = useQuery(api.products.getBySlug, { slug });
    const [showInquiryForm, setShowInquiryForm] = useState(false);

    const handleInquiry = () => {
        const element = document.getElementById('inquiry-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setShowInquiryForm(true);
    };

    if (product === undefined) {
        return <PageSkeleton />;
    }

    if (product === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
                <div className="text-6xl mb-6">🌿</div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Formulation Unlisted</h1>
                <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
                    The specific product formulation you're looking for might have been updated or moved.
                </p>
                <Link
                    href="/products"
                    className="flex items-center gap-2 bg-nb-green text-slate-900 px-8 py-3 rounded-2xl font-black shadow-lg shadow-nb-green/20 hover:scale-[1.05] transition-all"
                >
                    <ArrowLeft size={20} />
                    Browse Catalog
                </Link>
            </div>
        );
    }

    const technicalSpecs = [
        { label: 'Purity Level', value: '100% Organic Extracts', icon: <Sparkles className="w-5 h-5" /> },
        { label: 'Quality Standard', value: 'GMP & ISO Certified', icon: <ShieldCheck className="w-5 h-5" /> },
        { label: 'Source', value: product.botanicalName || 'Sustainably Farmed', icon: <Leaf className="w-5 h-5" /> },
        { label: 'Process', value: product.extractionMethod || 'Cold Press Extraction', icon: <Droplets className="w-5 h-5" /> },
        { label: 'Active Compounds', value: product.activeCompounds || 'Rich in Antioxidants', icon: <Atom className="w-5 h-5" /> },
        { label: 'Customizable MOQ', value: `${product.moq || 500} Units`, icon: <Package className="w-5 h-5" /> },
    ];

    const complianceSteps = [
        { title: "R&D Validation", desc: "Scientific formulation testing in our state-of-the-art labs.", icon: <FlaskConical className="w-5 h-5" /> },
        { title: "Quality Control", desc: "Multi-stage inspection protocols ensuring zero-defect output.", icon: <FileCheck2 className="w-5 h-5" /> },
        { title: "Global Shipping", desc: "Secure logistics handling for international B2B distributions.", icon: <Globe2 className="w-5 h-5" /> }
    ];

    return (
        <ThemeProvider>
            <div className="bg-background min-h-screen flex flex-col font-sans">
                <SiteHeader />
                <main className="flex-grow pb-20">

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                            {/* LEFT: Image Section (Fixed relative on large screens) */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="aspect-square rounded-[40px] overflow-hidden bg-white border border-slate-900/5 shadow-2xl shadow-slate-200/50 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-nb-green/5 to-transparent opacity-50" />
                                    {product.images && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0] !== "[object Object]" ? (
                                        <img
                                            src={product.images[0].startsWith('http') ? product.images[0] : `/api/storage/${product.images[0]}`}
                                            className="w-full h-full object-cover relative z-10 transition-transform duration-[2s] group-hover:scale-110"
                                            alt={product.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">🌿</div>
                                    )}
                                </div>

                                {product.images && product.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {product.images.slice(1).map((img: string | any, i: number) => (
                                            <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white hover:scale-105 transition-transform cursor-pointer">
                                                <img
                                                    src={typeof img === 'string' && img.startsWith('http') ? img : `/api/storage/${img}`}
                                                    className="w-full h-full object-cover"
                                                    alt={`${product.name} thumbnail ${i + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="p-8 rounded-[32px] bg-slate-900 text-white relative overflow-hidden hidden lg:block">
                                    <div className="relative z-10">
                                        <h4 className="text-nb-green font-black uppercase tracking-[0.2em] text-[10px] mb-4">Manufacturer Trust</h4>
                                        <ul className="space-y-4">
                                            {complianceSteps.map((step, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-nb-green shrink-0">
                                                        {step.icon}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black">{step.title}</div>
                                                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-nb-green/10 rounded-full blur-[60px] -mr-16 -mt-16" />
                                </div>
                            </div>

                            {/* RIGHT: Content Section */}
                            <div className="lg:col-span-7 space-y-12">
                                {/* Header Info */}
                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <span className="px-4 py-1.5 bg-nb-green/10 text-nb-green text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-nb-green/20">
                                            {product.tags?.[0] || 'Exclusive Formulation'}
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-900/5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-nb-green animate-pulse" />
                                            B2B Verified Catalog
                                        </div>
                                    </div>

                                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-center gap-4 text-slate-400">
                                        <span className="text-xs font-black uppercase tracking-widest border-r border-slate-200 pr-4">SKU: {product.sku || 'N/A'}</span>
                                        <span className="text-xs font-black uppercase tracking-widest">Scientific Grade Output</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="text-nb-green" size={20} />
                                        Product Overview
                                    </h3>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Technical Specs Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {technicalSpecs.map((spec, idx) => (
                                        <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-900/5 hover:border-nb-green/30 transition-all hover:shadow-xl hover:shadow-nb-green/5 group flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-nb-green/5 flex items-center justify-center text-nb-green group-hover:scale-110 transition-transform shrink-0">
                                                {spec.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{spec.label}</h4>
                                                <p className="text-sm font-bold text-slate-900">{spec.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Catalogs Section */}
                                {product.documents && product.documents.length > 0 && (
                                    <div className="p-8 rounded-[32px] bg-white border border-slate-900/5 shadow-xl shadow-slate-200/50">
                                        <DocumentList documents={product.documents} title="Technical Data Sheets & Catalogs" />
                                    </div>
                                )}

                                {/* Mobile Step Recap */}
                                <div className="p-6 rounded-[24px] bg-slate-900 text-white lg:hidden">
                                    <h4 className="text-nb-green font-black uppercase tracking-[0.2em] text-[10px] mb-4">Our Manufacturing Standards</h4>
                                    <div className="space-y-4">
                                        {complianceSteps.map((step, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-nb-green shrink-0">
                                                    {step.icon}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black">{step.title}</div>
                                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Inquiry Form Section */}
                                <div id="inquiry-section" className="scroll-mt-24">
                                    <div className="p-8 sm:p-12 rounded-[40px] bg-white border border-slate-900/5 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                                    <Factory size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-slate-900">Custom B2B Solutions</h2>
                                                    <p className="text-slate-500 text-sm font-bold">Inquire for Bulk & Private Label Pricing</p>
                                                </div>
                                            </div>

                                            <ContactForm
                                                compact={true}
                                                productId={product._id}
                                                productName={product.name}
                                                productCategory={product.tags?.[0]}
                                                initialMessage={`I'm interested in wholesale options for ${product.name}. Please provide a technical quote and MOQ details for B2B distribution.`}
                                            />
                                        </div>
                                        {/* Background Decorative Circle */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-nb-green/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </main>
                <SiteFooter />
            </div>
        </ThemeProvider>
    );
}
