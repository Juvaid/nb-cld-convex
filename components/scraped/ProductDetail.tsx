"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, ArrowRight, Sparkles, ShieldCheck, Leaf, Droplets, Atom, Package, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactForm from "./ContactForm";

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
        setShowInquiryForm(true);
    };

    if (product === undefined) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nb-green" />
            </div>
        );
    }

    if (product === null) {
        return (
            <div className="p-20 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
                <Link href="/products" className="text-nb-green font-bold hover:underline">
                    Back to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className={`bg-white ${isModal ? 'rounded-t-[32px] sm:rounded-[32px] overflow-hidden' : 'min-h-screen py-20 sm:py-32'}`}>
            <div className={`mx-auto ${isModal ? 'max-w-5xl px-0 sm:px-8 py-0 sm:py-8' : 'max-w-6xl px-4 sm:px-6'}`}>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${isModal ? 'gap-0 md:gap-10 lg:gap-14' : 'gap-8 sm:gap-12 lg:gap-20'}`}>
                    {/* Media Gallery */}
                    <div className={`${isModal ? 'p-0 sm:p-0' : 'space-y-4 sm:space-y-6'} relative`}>
                        <div className={`aspect-video sm:aspect-[4/5] md:aspect-square overflow-hidden bg-slate-50 relative group ${isModal ? 'rounded-none sm:rounded-[24px]' : 'rounded-[32px] sm:rounded-[40px] border border-slate-900/5'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-nb-green/5 to-nb-green-light/5 opacity-50" />
                            {product.images && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0] !== "[object Object]" ? (
                                <img
                                    src={product.images[0].startsWith('http') ? product.images[0] : `/api/storage/${product.images[0]}`}
                                    className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                                    alt={product.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl sm:text-7xl opacity-20">🌿</div>
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className={`grid grid-cols-4 gap-2 sm:gap-3 ${isModal ? 'mt-3 sm:mt-4 p-4 sm:p-0 pb-0' : 'mt-4 sm:mt-6'}`}>
                                {product.images.slice(1).map((img: string | any, i: number) => (
                                    <div key={i} className={`aspect-square rounded-xl overflow-hidden border border-slate-900/5 bg-slate-50 ${isModal ? 'sm:rounded-xl' : 'sm:rounded-2xl'}`}>
                                        <img
                                            src={typeof img === 'string' && img.startsWith('http') ? img : `/api/storage/${img}`}
                                            className="w-full h-full object-cover"
                                            alt={`${product.name} ${i + 2}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details/Form Area */}
                    <div className={`flex flex-col justify-center ${isModal ? 'p-5 sm:p-0' : ''}`}>
                        {showInquiryForm ? (
                            <div className="animate-fade-in relative z-20">
                                <button
                                    onClick={() => setShowInquiryForm(false)}
                                    className="mb-4 sm:mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to details
                                </button>
                                <div className="mb-4">
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Bulk Inquiry</h2>
                                    <p className="text-slate-500 text-sm font-medium">Please provide your details for {product.name}</p>
                                </div>
                                <ContactForm
                                    compact={true}
                                    productId={product._id}
                                    productName={product.name}
                                    productCategory={product.tags?.[0]}
                                    initialMessage={`I am interested in bulk inquiry for ${product.name}. Please provide more details.`}
                                    onSuccess={() => {
                                        if (isModal && onClose) {
                                            setTimeout(onClose, 2000);
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div>
                                    <button
                                        onClick={onClose}
                                        className="sm:hidden -mr-2 p-2 text-slate-400 hover:text-slate-900 rounded-full bg-slate-50 border border-slate-900/5 transition-colors absolute right-5 top-5 z-50"
                                        aria-label="Close"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <span className="inline-flex items-center px-4 py-1.5 text-[9px] font-black tracking-wider uppercase bg-nb-green/5 text-nb-green rounded-full border border-nb-green/10 whitespace-nowrap">
                                            {product.tags?.[0] || 'Personal Care'}
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-900/5 whitespace-nowrap">
                                            <span className="relative flex h-2 w-2 flex-shrink-0">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nb-green opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-nb-green shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                            </span>
                                            In Stock
                                        </div>
                                    </div>

                                    <h1 className={`${isModal ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'} font-black text-slate-900 mb-2 leading-[1.1] tracking-tight`}>
                                        {product.name}
                                    </h1>

                                    {product.sku && (
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                            SKU: {product.sku}
                                        </div>
                                    )}
                                </div>

                                <p className={`${isModal ? 'text-sm sm:text-base' : 'text-base sm:text-lg'} text-slate-600 leading-relaxed font-medium`}>
                                    {product.description}
                                </p>

                                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isModal ? 'gap-2 md:gap-3' : 'gap-3 md:gap-4'}`}>
                                    {[
                                        { label: 'Purity', value: '100% Organic Extracts', icon: <Sparkles className="w-3.5 h-3.5" /> },
                                        { label: 'Standard', value: 'GMP & ISO Certified', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                                        ...(product.botanicalName ? [{ label: 'Source', value: product.botanicalName, icon: <Leaf className="w-3.5 h-3.5" /> }] : []),
                                        ...(product.extractionMethod ? [{ label: 'Process', value: product.extractionMethod, icon: <Droplets className="w-3.5 h-3.5" /> }] : []),
                                        ...(product.activeCompounds ? [{ label: 'Active', value: product.activeCompounds, icon: <Atom className="w-3.5 h-3.5" /> }] : []),
                                        ...(product.moq ? [{ label: 'MOQ', value: `${product.moq} Units`, icon: <Package className="w-3.5 h-3.5" /> }] : []),
                                    ].map((feature, idx) => (
                                        <div key={idx} className="p-3 sm:px-4 sm:py-3.5 rounded-[20px] bg-slate-50/30 ring-1 ring-inset ring-slate-900/5 hover:ring-nb-green/20 transition-all hover:bg-white hover:shadow-md hover:shadow-nb-green/5 group/card flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white ring-1 ring-inset ring-slate-900/5 flex items-center justify-center text-nb-green shadow-sm group-hover/card:scale-105 transition-transform">
                                                {feature.icon}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <h4 className="text-[8px] font-black uppercase text-slate-400 tracking-[0.15em] leading-none mb-0.5">{feature.label}</h4>
                                                <p className="text-sm font-bold text-slate-900 leading-tight truncate">{feature.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={`flex flex-col gap-3 w-full ${isModal ? 'pt-2' : 'pt-4'}`}>
                                    <button
                                        onClick={handleInquiry}
                                        className={`w-full inline-flex items-center justify-center gap-3 ${isModal ? 'h-14 rounded-2xl' : 'h-16 rounded-[24px]'} bg-nb-green text-white text-base font-black hover:bg-nb-green-soft hover:shadow-2xl hover:shadow-nb-green/20 transition-all group`}
                                    >
                                        Inquire for Bulk
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    {!isModal && (
                                        <Link
                                            href="/products"
                                            className="w-full inline-flex items-center justify-center h-16 px-8 rounded-[24px] border-2 border-slate-900 text-slate-900 text-base font-black hover:bg-slate-900 hover:text-white transition-all underline-none"
                                        >
                                            Back to Catalog
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
