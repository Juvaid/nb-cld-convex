"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, ArrowRight, Sparkles, ShoppingCart, ArrowLeft } from "lucide-react";
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
        <div className={`bg-white ${isModal ? 'rounded-t-[32px] sm:rounded-[40px] overflow-hidden' : 'min-h-screen py-20 sm:py-32'}`}>
            <div className={`mx-auto ${isModal ? 'max-w-5xl px-0 sm:px-6 py-0 sm:py-12' : 'max-w-6xl px-4 sm:px-6'}`}>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${isModal ? 'gap-0 md:gap-12 lg:gap-16' : 'gap-8 sm:gap-12 lg:gap-20'}`}>
                    {/* Media Gallery */}
                    <div className={`${isModal ? 'p-0 sm:p-0' : 'space-y-4 sm:space-y-6'}`}>
                        <div className={`aspect-square sm:aspect-[4/5] md:aspect-square overflow-hidden bg-slate-50 relative group ${isModal ? 'rounded-none sm:rounded-[32px]' : 'rounded-[32px] sm:rounded-[40px] border border-slate-900/5'}`}>
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
                            <div className="grid grid-cols-4 gap-3 mt-4 sm:mt-6">
                                {product.images.slice(1).map((img, i) => (
                                    <div key={i} className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden border border-slate-900/5 bg-slate-50">
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
                    <div className={`flex flex-col justify-center ${isModal ? 'p-6 sm:p-0' : ''}`}>
                        {showInquiryForm ? (
                            <div className="animate-fade-in">
                                <button
                                    onClick={() => setShowInquiryForm(false)}
                                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm"
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
                            <div className="mb-6 sm:mb-8">
                                <span className="inline-block px-3 py-1 text-[8px] sm:text-[10px] font-black tracking-widest uppercase bg-nb-green/10 text-nb-green rounded-full mb-3">
                                    {product.tags?.[0] || 'Personal Care'}
                                </span>
                                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 text-sm sm:text-base text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-nb-green" />
                                        In Stock
                                    </div>
                                    {product.sku && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-200" />
                                            SKU: {product.sku}
                                        </div>
                                    )}
                                </div>

                                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                                    {product.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
                                    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-[28px] bg-slate-50 border border-slate-900/5 hover:border-nb-green/20 transition-colors">
                                        <h4 className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Purity</h4>
                                        <p className="text-sm sm:text-base font-bold text-slate-900">100% Organic Extracts</p>
                                    </div>
                                    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-[28px] bg-slate-50 border border-slate-900/5 hover:border-nb-green/20 transition-colors">
                                        <h4 className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Standard</h4>
                                        <p className="text-sm sm:text-base font-bold text-slate-900">GMP & ISO Certified</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <button
                                        onClick={handleInquiry}
                                        className="w-full inline-flex items-center justify-center gap-3 h-14 sm:h-16 rounded-2xl sm:rounded-[24px] bg-nb-green text-white text-sm sm:text-base font-black hover:bg-nb-green/90 transition-all shadow-xl shadow-nb-green/20 group"
                                    >
                                        Inquire for Bulk
                                        <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    {!isModal && (
                                        <Link
                                            href="/products"
                                            className="w-full inline-flex items-center justify-center h-14 sm:h-16 px-8 rounded-2xl sm:rounded-[24px] border-2 border-slate-900 text-slate-900 text-sm sm:text-base font-black hover:bg-slate-900 hover:text-white transition-all"
                                        >
                                            Back
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
