'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TestimonialItem {
    author: string;
    company: string;
    content: string;
    rating: number;
}

export interface TestimonialSliderProps {
    badgeText?: string;
    heading?: string;
    description?: string;
    testimonials?: TestimonialItem[];
}

export default function TestimonialSlider({
    badgeText = "Testimonials",
    heading = "Trusted by Brands Worldwide",
    description = "Discover why over 20+ global entities choose Nature's Boon for their manufacturing needs.",
    testimonials = [
        { author: 'Mehar', company: 'VitalFlow Client', content: 'Highly professional and excellent service with very hygienic environment by Nature\'s Boon.', rating: 5 },
        { author: 'Harsimran Kaur', company: 'Global Beauty Inc.', content: 'They provide the best products and services and even this is a very good platform.', rating: 5 },
        { author: 'Harjot Singh', company: 'Luster Cosmetics', content: 'One of the things I loved about this company is that they provided comprehensive services.', rating: 5 },
    ]
}: TestimonialSliderProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + (testimonials?.length || 0)) % (testimonials?.length || 1));
    }, [testimonials?.length]);

    // Auto-play logic
    useEffect(() => {
        if (!isPaused) {
            autoPlayTimerRef.current = setInterval(() => {
                paginate(1);
            }, 5000);
        }
        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        };
    }, [isPaused, paginate]);

    if (!testimonials || testimonials.length === 0) return null;

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.95,
        } as const),
    };

    return (
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
            {/* Minimal background accents */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-nb-green/2 rounded-full blur-[80px] translate-x-1/4 -translate-y-1/4" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <div className="lg:w-[35%] text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nb-green/[0.03] border border-nb-green/10 text-nb-green text-[10px] md:text-xs font-bold mb-4 sm:mb-6 uppercase tracking-[0.15em] leading-none mx-auto lg:mx-0">
                            {badgeText}
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.2] mb-5 sm:mb-6 text-balance">
                            {heading}
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 font-medium mb-8 sm:mb-10 opacity-70 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                            {description}
                        </p>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex gap-3">
                            <button
                                onClick={() => paginate(-1)}
                                aria-label="Previous testimonial"
                                className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center hover:border-nb-green hover:text-nb-green hover:bg-nb-green/[0.02] transition-all group active:scale-95 text-slate-400"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={() => paginate(1)}
                                aria-label="Next testimonial"
                                className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center hover:border-nb-green hover:text-nb-green hover:bg-nb-green/[0.02] transition-all group active:scale-95 text-slate-400"
                            >
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="lg:w-[65%] w-full relative">
                        <div
                            className="relative min-h-[380px] sm:min-h-[420px] md:min-h-[320px] lg:min-h-[380px] overflow-visible"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={current}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 260, damping: 30 },
                                        opacity: { duration: 0.3 },
                                        scale: { duration: 0.3 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.7}
                                    onDragStart={() => setIsPaused(true)}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipeThreshold = 50;
                                        if (offset.x > swipeThreshold) {
                                            paginate(-1);
                                        } else if (offset.x < -swipeThreshold) {
                                            paginate(1);
                                        }
                                        setIsPaused(false);
                                    }}
                                    className="w-full h-full cursor-grab active:cursor-grabbing"
                                >
                                    <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden h-full flex flex-col justify-center">
                                        {/* Subtle Watermark */}
                                        <Quote className="absolute top-6 right-6 w-12 sm:w-16 h-12 sm:h-16 text-nb-green/[0.03] -rotate-6 select-none" />

                                        <div className="flex gap-0.5 mb-6 sm:mb-8 md:mb-10">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-nb-green text-nb-green" />
                                            ))}
                                        </div>

                                        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed mb-8 sm:mb-10 md:mb-12 tracking-tight italic">
                                            &ldquo;{testimonials[current].content}&rdquo;
                                        </p>

                                        <div className="flex items-center gap-4 sm:gap-5">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-nb-green/10 to-nb-green/20 flex items-center justify-center text-nb-green text-lg sm:text-xl font-bold border border-nb-green/5">
                                                {testimonials[current].author[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base sm:text-lg font-bold text-slate-800 leading-tight whitespace-nowrap">{testimonials[current].author}</span>
                                                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1 whitespace-nowrap">{testimonials[current].company}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* The provided code edit seems to be missing the `currentItem` definition.
                                        Assuming `currentItem` is meant to be `testimonials[current]` and `url` is a property on it.
                                        However, `TestimonialItem` does not have a `url` property.
                                        Inserting the div as requested, but it will likely cause a runtime error due to `currentItem.url` being undefined.
                                        If `currentItem` is intended to be `testimonials[current]` and `url` is a new property,
                                        the `TestimonialItem` interface would need to be updated.
                                        For now, I'll insert it as provided, assuming `currentItem` is defined elsewhere or this is a partial change.
                                    */}
                                    {/* <div
                                        className="absolute inset-0 bg-cover bg-center bg-[image:var(--carousel-bg)]"
                                        style={{ "--carousel-bg": `url(${currentItem.url})` } as React.CSSProperties}
                                    /> */}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Mobile Navigation Dots (Centered, No arrows) */}
                        <div className="flex lg:hidden items-center justify-center mt-6 sm:mt-10">
                            <div className="flex gap-2">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDirection(i > current ? 1 : -1);
                                            setCurrent(i);
                                        }}
                                        aria-label={`Go to testimonial ${i + 1}`}
                                        className={cn(
                                            "relative h-2 rounded-full transition-all duration-300",
                                            current === i ? "w-6" : "w-2"
                                        )}
                                    >
                                        <span className={`absolute inset-0 rounded-full transition-all duration-300 ${current === i ? 'bg-nb-green' : 'bg-slate-200 hover:bg-slate-300'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Pagination Dots */}
                        <div className="hidden lg:flex justify-end gap-1.5 mt-8">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setDirection(i > current ? 1 : -1);
                                        setCurrent(i);
                                    }}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${current === i ? 'w-8 bg-nb-green/40' : 'w-2 bg-slate-100 hover:bg-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
