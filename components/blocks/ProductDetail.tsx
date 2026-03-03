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
import { useState, useRef, useEffect } from "react";
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
    initialProduct?: any;
    showHeaderFooter?: boolean;
    showSpecs?: boolean;
    showTrust?: boolean;
}

export default function ProductDetail({
    slug,
    isModal = false,
    onClose,
    initialProduct,
    showHeaderFooter = false,
    showSpecs = true,
    showTrust = true
}: ProductDetailProps) {
    const router = useRouter();
    const liveProduct = useQuery(api.products.getBySlug, { slug });
    const product = liveProduct !== undefined ? liveProduct : initialProduct;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const width = scrollContainerRef.current.clientWidth;
            const newIndex = Math.round(scrollLeft / width);
            if (newIndex !== activeImageIndex) {
                setActiveImageIndex(newIndex);
            }
        }
    };

    const handleInquiry = () => {
        setIsDrawerOpen(true);
    };

    if (product === undefined) {
        return (
            <div className="min-h-screen bg-[var(--nb-colors-background)] flex items-center justify-center">
                <div className="animate-pulse text-nb-green font-bold">Loading Product...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[var(--nb-colors-background)] flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
                <Link href="/products" className="text-nb-green hover:underline">Back to Catalog</Link>
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

    const images = (product.images || []).filter((img: any) => typeof img === 'string' && img !== "[object Object]");
    const hasMultipleImages = images.length > 1;

    const scrollToImage = (index: number) => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
            setActiveImageIndex(index);
        }
    };

    const content = (
        <div className="bg-[var(--nb-colors-background)] min-h-screen flex flex-col font-sans">
            {showHeaderFooter && <SiteHeader />}
            <main className={`flex-grow ${showHeaderFooter ? 'pb-24 md:pb-20' : 'pb-12'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                        {/* LEFT: Image Section */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="aspect-[4/5] sm:aspect-square rounded-[32px] sm:rounded-[40px] overflow-hidden bg-white border border-slate-900/5 shadow-2xl shadow-slate-200/50 relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-nb-green/5 to-transparent opacity-50 z-0 pointer-events-none" />

                                {images.length > 0 ? (
                                    <div
                                        ref={scrollContainerRef}
                                        onScroll={handleScroll}
                                        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x"
                                    >
                                        {images.map((img: string, i: number) => (
                                            <div key={i} className="relative flex-shrink-0 w-full h-full snap-start snap-always">
                                                <img
                                                    src={img.startsWith('http') ? img : `/api/storage/${img}`}
                                                    className="w-full h-full object-cover relative z-10 transition-transform duration-[2s]"
                                                    alt={`${product.name} - Image ${i + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">🌿</div>
                                )}

                                {hasMultipleImages && (
                                    <>
                                        <button
                                            onClick={(e) => { e.preventDefault(); scrollToImage(Math.max(0, activeImageIndex - 1)); }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-white flex items-center justify-center text-slate-700 hover:text-nb-green hover:bg-white transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 disabled:opacity-0 disabled:cursor-not-allowed"
                                            disabled={activeImageIndex === 0}
                                            aria-label="Previous image"
                                            title="Previous image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6" /></svg>
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); scrollToImage(Math.min(images.length - 1, activeImageIndex + 1)); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-white flex items-center justify-center text-slate-700 hover:text-nb-green hover:bg-white transition-all opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 disabled:opacity-0 disabled:cursor-not-allowed"
                                            disabled={activeImageIndex === images.length - 1}
                                            aria-label="Next image"
                                            title="Next image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {hasMultipleImages && (
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4 px-1 pb-1 overflow-x-auto scrollbar-none snap-x snap-mandatory">
                                    {images.map((img: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => scrollToImage(i)}
                                            className={`snap-start relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${i === activeImageIndex
                                                ? 'border-nb-green shadow-premium scale-[1.02]'
                                                : 'border-transparent hover:border-slate-200 opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={img.startsWith('http') ? img : `/api/storage/${img}`}
                                                className="w-full h-full object-cover"
                                                alt={`Thumbnail ${i + 1}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {showTrust && (
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
                            )}
                        </div>

                        {/* RIGHT: Content Section */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 bg-nb-green/10 text-nb-green text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-nb-green/20">
                                        {product.tags?.[0] || 'Exclusive Formulation'}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-nb-green bg-nb-green/5 px-2.5 py-1 rounded-full border border-nb-green/10">
                                        <div className="h-1.5 w-1.5 rounded-full bg-nb-green animate-pulse" />
                                        B2B Verified
                                    </div>
                                </div>

                                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-3 text-slate-400">
                                    <span className="text-[10px] font-black uppercase tracking-widest border-r border-slate-200 pr-3">SKU: {product.sku || 'N/A'}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Scientific Grade Output</span>
                                </div>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="text-nb-green" size={18} />
                                    Product Overview
                                </h3>
                                <p className="text-md sm:text-lg text-slate-600 leading-relaxed font-medium">
                                    {product.description}
                                </p>
                            </div>

                            <div className="hidden md:block">
                                <button
                                    onClick={handleInquiry}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-nb-green rounded-full hover:shadow-xl hover:shadow-nb-green/30 transition-all hover:-translate-y-0.5 relative overflow-hidden group/btn"
                                >
                                    {/* Premium Sheen Effect */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        <div className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] -translate-x-[150%] group-hover/btn:animate-premium-sheen" />
                                    </div>

                                    <span className="relative z-10">Inquire Now</span>
                                    <ArrowRight className="w-5 h-5 relative z-10" />
                                </button>
                            </div>

                            {showSpecs && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    {technicalSpecs.map((spec, idx) => (
                                        <div key={idx} className="p-5 rounded-[24px] bg-white border border-slate-100 hover:border-nb-green/30 transition-all hover:shadow-xl hover:shadow-nb-green/5 group flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-nb-green/5 flex items-center justify-center text-nb-green group-hover:scale-110 transition-transform shrink-0 shadow-sm border border-nb-green/10">
                                                {spec.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase text-nb-green/60 tracking-[0.2em] mb-1">{spec.label}</h4>
                                                <p className="text-xs sm:text-sm font-bold text-slate-900">{spec.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {product.documents && product.documents.length > 0 && (
                                <div className="p-8 rounded-[32px] bg-white border border-slate-900/5 shadow-xl shadow-slate-200/50">
                                    <DocumentList documents={product.documents} title="Technical Data Sheets & Catalogs" />
                                </div>
                            )}

                            {showTrust && (
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
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-40">
                <button
                    onClick={handleInquiry}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-nb-green rounded-full shadow-lg shadow-nb-green/30 relative overflow-hidden group/btn"
                >
                    {/* Premium Sheen Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] -translate-x-[150%] group-hover/btn:animate-premium-sheen" />
                    </div>

                    <span className="relative z-10">Inquire Now</span>
                    <ArrowRight className="w-5 h-5 relative z-10" />
                </button>
            </div>

            <div
                className={`fixed inset-0 z-50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsDrawerOpen(false)}
                />
                <div
                    className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-nb-green border border-slate-200">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 leading-tight">B2B Inquiry</h2>
                                    <p className="text-nb-green text-xs font-bold uppercase tracking-wider">{product.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                                title="Close Dialog"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <ContactForm
                            compact={true}
                            productId={product._id}
                            productName={product.name}
                            productCategory={product.tags?.[0]}
                            initialMessage={`I'm interested in wholesale options for ${product.name}. Please provide a technical quote and MOQ details for B2B distribution.`}
                        />
                    </div>
                </div>
            </div>

            {showHeaderFooter && <SiteFooter />}
        </div>
    );

    if (isModal) {
        return (
            <ThemeProvider>
                {content}
            </ThemeProvider>
        );
    }

    return content;
}
