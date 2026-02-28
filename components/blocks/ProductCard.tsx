"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCategory } from '@/lib/default-theme';
import { useRef, useState, useEffect } from 'react';

export default function ProductCard({ category }: { category: ProductCategory }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Filter valid image URLs
    const images = (category.images || []).filter(
        img => typeof img === 'string' && img !== "[object Object]"
    );

    const hasMultipleImages = images.length > 1;

    // Track scroll position to update dots
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const width = scrollContainerRef.current.clientWidth;
            const newIndex = Math.round(scrollLeft / width);
            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        }
    };

    // Scroll to specific image index
    const scrollToImage = (index: number, e?: React.MouseEvent) => {
        e?.preventDefault(); // Prevent navigating the outer link if button clicked
        e?.stopPropagation();
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
            setActiveIndex(index);
        }
    };

    return (
        <div className="group relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-white border border-slate-900/5 hover:shadow-2xl hover:shadow-nb-green/10 transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 flex flex-col h-full">

            {/* Image Slider Area (Relative context for arrows/dots) */}
            <div className="relative h-48 sm:h-64 bg-white overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-nb-green-soft/10 to-nb-green-deep/10 opacity-50 pointer-events-none z-10" />

                {images.length > 0 ? (
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x"
                    >
                        {images.map((imgUrl, idx) => (
                            <Link
                                key={idx}
                                href={`/products/${category.slug}`}
                                className="relative flex-shrink-0 w-full h-full snap-start snap-always"
                            >
                                <Image
                                    src={imgUrl.startsWith('http') ? imgUrl : `/api/storage/${imgUrl}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt={`${category.name} - Image ${idx + 1}`}
                                />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Link href={`/products/${category.slug}`} className="absolute inset-0 flex items-center justify-center">
                        <div className="relative text-5xl sm:text-6xl opacity-20 group-hover:opacity-40 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">🌿</div>
                    </Link>
                )}

                {/* Category tag */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 pointer-events-none">
                    <div className="bg-white/40 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-nb-green flex items-center gap-1 sm:gap-1.5 border border-white/40 shadow-sm">
                        <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                        Natural
                    </div>
                </div>

                {/* Desktop Arrow Controls */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={(e) => scrollToImage(Math.max(0, activeIndex - 1), e)}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-white flex items-center justify-center text-slate-700 hover:text-nb-green hover:bg-white transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 disabled:opacity-0 disabled:cursor-not-allowed`}
                            disabled={activeIndex === 0}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => scrollToImage(Math.min(images.length - 1, activeIndex + 1), e)}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-white flex items-center justify-center text-slate-700 hover:text-nb-green hover:bg-white transition-all opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 disabled:opacity-0 disabled:cursor-not-allowed`}
                            disabled={activeIndex === images.length - 1}
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}

                {/* Pagination Dots */}
                {hasMultipleImages && (
                    <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5 pointer-events-none">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => scrollToImage(idx, e)}
                                className={`h-1.5 rounded-full transition-all pointer-events-auto shadow-sm ${idx === activeIndex
                                    ? "w-4 bg-white"
                                    : "w-1.5 bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Main Clickable Content Area */}
            <Link href={`/products/${category.slug}`} className="flex-1 flex flex-col p-8 sm:p-10">
                <h3 className="font-black text-xl sm:text-2xl text-slate-900 mb-1 group-hover:text-nb-green transition-colors leading-tight">
                    {category.name}
                </h3>
                {(category as any).sku && (
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        SKU: {(category as any).sku}
                    </div>
                )}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 sm:mb-8 font-medium line-clamp-2 opacity-80 flex-1 hidden sm:block">
                    {category.description}
                </p>
                <div
                    className="mt-auto inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 group-hover:text-nb-green transition-colors py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-900/5 group-hover:bg-nb-green/5 w-max"
                >
                    Learn More
                    <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 translate-y-[1px] group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            {/* Fixed CTA at bottom */}
            <div className="px-8 pb-8 sm:px-10 sm:pb-10 pt-0 shrink-0">
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-[10px] font-black text-white bg-gradient-to-r from-nb-green-soft to-nb-green-deep px-4 py-3 sm:py-2.5 rounded-full hover:shadow-lg hover:shadow-nb-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full justify-center uppercase tracking-widest relative overflow-hidden group/btn"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10">Inquire for Bulk</span>
                </Link>
            </div>
        </div>
    );
}
