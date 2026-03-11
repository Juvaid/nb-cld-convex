"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Star, ArrowRight, ExternalLink, CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GoogleReview {
    author_name: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description: string;
    text: string;
    verified?: boolean;
}

export interface GoogleReviewsProps {
    businessName?: string;
    reviews?: GoogleReview[];
    totalRating?: number;
    totalReviews?: number;
    googleMapsUrl?: string;
    backgroundColor?: "white" | "slate-50" | "sage-green" | "soft-gray" | "transparent";
    badgeText?: string;
    textAlign?: "left" | "center" | "right";
}

const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.09H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.91l3.66-2.8z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.09l3.66 2.84c.87-2.6 3.3-4.55 6.16-4.55z" fill="#EA4335" />
    </svg>
);

export function GoogleReviews({
    businessName = "Nature's Boon",
    reviews = [],
    totalRating = 5.0,
    totalReviews = 9,
    googleMapsUrl = "https://maps.app.goo.gl/DHC2D3T28ZRsn7Jx7",
    backgroundColor = "white",
    badgeText = "Most Trusted Manufacturer",
    textAlign = "left"
}: GoogleReviewsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [cardsToShow, setCardsToShow] = useState(3);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    // Dynamic cards to show logic
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setCardsToShow(3);
            else if (window.innerWidth >= 640) setCardsToShow(2);
            else setCardsToShow(1);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const gap = 24; // Fixed gap in pixels

    const next = useCallback(() => {
        if (reviews.length === 0) return;
        const maxIndex = Math.max(0, reviews.length - cardsToShow);
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [reviews.length, cardsToShow]);

    useEffect(() => {
        if (!isPaused && reviews.length > cardsToShow) {
            const timer = setInterval(next, 5000);
            return () => clearInterval(timer);
        }
    }, [isPaused, next, reviews.length, cardsToShow]);

    const handleDragEnd = (event: any, info: any) => {
        const threshold = 50;
        const width = containerRef.current?.offsetWidth || 0;

        if (info.offset.x < -threshold) {
            const maxIndex = Math.max(0, reviews.length - cardsToShow);
            setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
        } else if (info.offset.x > threshold) {
            setCurrentIndex((prev) => Math.max(0, prev - 1));
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="py-12 bg-slate-50 text-center rounded-2xl m-4 border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Please add Google Reviews in the sidebar.</p>
            </div>
        );
    }

    const bgColors = {
        "white": "bg-white",
        "slate-50": "bg-slate-50",
        "sage-green": "bg-green-50",
        "soft-gray": "bg-slate-100",
        "transparent": "bg-transparent"
    };

    const alignmentClasses = {
        left: "text-left items-start lg:items-end lg:flex-row lg:justify-between",
        center: "text-center items-center lg:items-center flex-col justify-center",
        right: "text-right items-end lg:items-end lg:flex-row-reverse lg:justify-between"
    };

    const textAlignClass = textAlign === "center" ? "text-center mx-auto" : textAlign === "right" ? "text-right ml-auto" : "text-left";

    // Helper to get image URL (handles storage IDs)
    const getImageUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) {
            return url;
        }
        return `/api/storage/${url}`;
    };

    return (
        <section className={cn("w-full py-16 px-4 md:py-20 lg:py-24 overflow-hidden relative", bgColors[backgroundColor])}>
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-nb-green/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-nb-green/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className={cn("flex flex-col gap-8 mb-12 sm:mb-16", alignmentClasses[textAlign])}>
                    <div className={cn("flex-1", textAlignClass)}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-4 sm:mb-6",
                                textAlign === "center" ? "mx-auto" : textAlign === "right" ? "ml-auto" : ""
                            )}
                        >
                            <GoogleLogo />
                            <div className="w-px h-3 bg-slate-200 mx-1" />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Verified Reviews</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-[1.2] mb-4 sm:mb-5"
                        >
                            Real Stories from <br className="hidden sm:block" />
                            <span className="text-nb-green">Verified Excellence.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={cn(
                                "text-[14px] sm:text-[15px] text-slate-500 font-medium max-w-xl leading-relaxed",
                                textAlign === "center" ? "mx-auto" : textAlign === "right" ? "ml-auto" : ""
                            )}
                        >
                            Join hundreds of premium brands that trust Nature's Boon for high-quality cosmetics manufacturing.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="hidden sm:block flex-shrink-0"
                    >
                        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-premium flex flex-col items-center text-center w-full max-w-[220px]">
                            <div className="text-4xl font-black text-slate-900 mb-0.5 leading-none">{totalReviews}</div>
                            <div className="text-[9px] font-black text-nb-green uppercase tracking-[0.15em] mb-4">{badgeText}</div>
                            <div className="flex -space-x-1.5 mb-5">
                                {reviews.slice(0, 5).map((r, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-50 ring-2 ring-slate-50/50">
                                        <img
                                            src={getImageUrl(r.profile_photo_url) || `https://ui-avatars.com/api/?name=${r.author_name}&background=random`}
                                            alt={r.author_name}
                                            className="w-full h-full object-cover rounded-full"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                ))}
                            </div>
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group w-full flex items-center justify-center gap-1.5 bg-slate-900 text-white px-5 py-3 rounded-full font-black text-[10px] hover:bg-nb-green transition-all shadow-lg shadow-slate-100 uppercase tracking-widest"
                            >
                                VIEW ALL REVIEWS
                                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </div>

                <div
                    className="relative group/slider"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef}>
                        <motion.div
                            className="flex"
                            style={{
                                x,
                                gap: `${gap}px`
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDragEnd}
                            animate={{
                                x: `calc(-${currentIndex} * ((100% - ${(cardsToShow - 1) * gap}px) / ${cardsToShow} + ${gap}px))`
                            }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 120
                            }}
                        >
                            {reviews.map((review, idx) => (
                                <div
                                    key={`${review.author_name}-${idx}`}
                                    className="flex-shrink-0 flex flex-col h-full bg-white rounded-[1.25rem] p-7 sm:p-9 border border-slate-100/80 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.03)] hover:shadow-premium transition-all duration-500 overflow-hidden relative group/card select-none"
                                    style={{
                                        width: `calc((100% - ${(cardsToShow - 1) * gap}px) / ${cardsToShow})`,
                                        minHeight: "340px"
                                    }}
                                >
                                    <Quote className="absolute -top-1 -right-1 w-14 h-14 text-slate-50/50 pointer-events-none group-hover/card:text-nb-green/5 transition-colors" />

                                    <div className="flex items-center justify-between mb-5 relative z-10">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} className={cn("fill-yellow-400 text-yellow-400", i >= review.rating && "opacity-20")} />
                                            ))}
                                        </div>
                                        {review.verified !== false && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-nb-green/10 text-nb-green text-[9px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={10} />
                                                Verified
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative z-10 grow mb-8">
                                        <p className="text-slate-600 text-[14px] sm:text-[15px] font-medium leading-relaxed line-clamp-5">
                                            "{review.text || "Professional team and excellent quality. Highly recommended for contract manufacturing."}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 pt-5 border-t border-slate-50 relative z-10 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 p-0.5 border border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
                                            {review.profile_photo_url ? (
                                                <img
                                                    src={getImageUrl(review.profile_photo_url)}
                                                    alt={review.author_name}
                                                    className="w-full h-full object-cover rounded-full"
                                                    referrerPolicy="no-referrer"
                                                    draggable={false}
                                                />
                                            ) : (
                                                <span className="text-nb-green font-black text-sm">{review.author_name?.[0] || "U"}</span>
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-slate-900 text-[12px] sm:text-[13px] leading-tight mb-0.5 truncate">{review.author_name}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{review.relative_time_description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="flex justify-center items-center mt-10">
                        <div className="flex gap-2">
                            {Array.from({ length: Math.max(0, reviews.length - cardsToShow + 1) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        currentIndex === i ? "w-10 bg-nb-green" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                                    )}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
