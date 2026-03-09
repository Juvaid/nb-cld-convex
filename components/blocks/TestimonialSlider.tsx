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
    avatar?: string;
}

export interface TestimonialSliderProps {
    badgeText?: string;
    heading?: string;
    description?: string;
    testimonials?: TestimonialItem[];
    layout?: 'split' | 'centered';
    animationType?: 'spring' | 'fade' | 'slide';
    themeColor?: string;
}

export default function TestimonialSlider({
    badgeText = "Testimonials",
    heading = "Trusted by Brands Worldwide",
    description = "Discover why over 20+ global entities choose Nature's Boon for their manufacturing needs.",
    layout = 'split',
    animationType = 'spring',
    themeColor = '#15803d', // nb-green
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
        enter: (direction: number) => {
            if (animationType === 'fade') return { opacity: 0, scale: 0.98 };
            if (animationType === 'slide') return { x: direction > 0 ? '50%' : '-50%', opacity: 0 };
            return {
                x: direction > 0 ? '100%' : '-100%',
                opacity: 0,
                scale: 0.95,
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => {
            if (animationType === 'fade') return { opacity: 0, scale: 0.98, zIndex: 0 };
            if (animationType === 'slide') return { x: direction < 0 ? '50%' : '-50%', opacity: 0, zIndex: 0 };
            return {
                zIndex: 0,
                x: direction < 0 ? '100%' : '-100%',
                opacity: 0,
                scale: 0.95,
            } as const;
        },
    };

    const springTransition = { type: "spring", stiffness: 260, damping: 30 } as const;
    const easeTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] } as const;
    const activeTransition = animationType === 'spring' ? springTransition : easeTransition;

    return (
        <div className="py-24 bg-white relative overflow-hidden">
            {/* Soft decorative glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-[0.08]" style={{ backgroundColor: themeColor }} />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-[0.08]" style={{ backgroundColor: themeColor }} />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className={cn(
                    "flex flex-col gap-10 lg:gap-16",
                    layout === 'split' ? "lg:flex-row items-center" : "items-center text-center"
                )}>
                    <div className={cn(
                        "w-full",
                        layout === 'split' ? "lg:w-[35%] text-center lg:text-left" : "max-w-3xl mx-auto"
                    )}>
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] md:text-xs font-bold mb-6 uppercase tracking-[0.2em] leading-none transition-colors"
                            style={{
                                color: themeColor,
                                backgroundColor: `${themeColor}0D`,
                                borderColor: `${themeColor}1A`
                            }}
                        >
                            {badgeText}
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 text-balance">
                            {heading}
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 font-medium mb-10 max-w-sm mx-auto leading-relaxed opacity-90 lg:max-w-md" style={layout === 'centered' ? { marginLeft: 'auto', marginRight: 'auto' } : {}}>
                            {description}
                        </p>

                        {/* Desktop Navigation (Left for split, hidden for centered since it usually has dots below) */}
                        {layout === 'split' && (
                            <div className="hidden lg:flex gap-4">
                                <button
                                    onClick={() => paginate(-1)}
                                    aria-label="Previous testimonial"
                                    className="w-12 h-12 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-center transition-all group active:scale-95 text-slate-400 hover:shadow-md"
                                    style={{ '--hover-color': themeColor } as any}
                                >
                                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                                <button
                                    onClick={() => paginate(1)}
                                    aria-label="Next testimonial"
                                    className="w-12 h-12 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-center transition-all group active:scale-95 text-slate-400 hover:shadow-md"
                                >
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={cn(
                        "w-full relative",
                        layout === 'split' ? "lg:w-[65%]" : "max-w-4xl mx-auto"
                    )}>
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
                                    transition={activeTransition}
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
                                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 md:p-14 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden h-full flex flex-col justify-center group/card transition-all duration-500 hover:shadow-[0_40px_90px_-20px_rgba(21,128,61,0.12)]">
                                        {/* Subtle Watermark */}
                                        <Quote className="absolute top-10 right-10 w-20 h-20 -rotate-12 select-none group-hover/card:rotate-0 transition-transform duration-700 opacity-[0.04]" style={{ color: themeColor }} />

                                        <div className="flex gap-1 mb-8">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4" style={{ fill: themeColor, color: themeColor }} />
                                            ))}
                                        </div>

                                        <p className={cn(
                                            "font-bold text-slate-800 leading-[1.5] mb-12 tracking-tight italic",
                                            layout === 'centered' ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl md:text-3xl"
                                        )}>
                                            &ldquo;{testimonials[current]?.content || "No content provided."}&rdquo;
                                        </p>

                                        <div className={cn("flex items-center gap-5", layout === 'centered' && "justify-center")}>
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden border transition-all duration-300 group-hover/card:scale-110 shadow-sm" style={{ backgroundColor: `${themeColor}0D`, borderColor: `${themeColor}1A` }}>
                                                {testimonials[current]?.avatar ? (
                                                    <img src={testimonials[current].avatar} alt={testimonials[current].author || "Avatar"} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl sm:text-2xl font-black" style={{ color: themeColor }}>
                                                        {testimonials[current]?.author?.[0] || "?"}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={cn("flex flex-col", layout === 'centered' ? "text-left" : "")}>
                                                <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{testimonials[current]?.author || "Anonymous"}</span>
                                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1.5 opacity-80" style={{ color: themeColor }}>{testimonials[current]?.company || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Dots */}
                        <div className={cn(
                            "flex items-center mt-10",
                            layout === 'split' ? "lg:justify-end justify-center" : "justify-center"
                        )}>
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
                                            current === i ? "w-8" : "w-2"
                                        )}
                                    >
                                        <span
                                            className="absolute inset-0 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: current === i ? themeColor : '#f1f5f9',
                                                opacity: current === i ? 1 : 0.8
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
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
        </div>
    );
}
