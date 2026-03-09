'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface ImageCarouselItem {
    url: string;
    alt: string;
    title?: string;
    subtitle?: string;
}

export interface ImageCarouselProps {
    items?: ImageCarouselItem[];
    autoPlay?: boolean;
    interval?: number;
    showControls?: boolean;
    showDots?: boolean;
}

export default function ImageCarousel({
    items = [
        { url: "", alt: "Feature 1", title: "Premium Manufacturing", subtitle: "World-class facilities for your brand" },
        { url: "", alt: "Feature 2", title: "Global Export", subtitle: "Reaching clients across 20+ countries" },
    ],
    autoPlay = true,
    interval = 5000,
    showControls = true,
    showDots = true
}: ImageCarouselProps) {
    // Filter out any undefined/null items to prevent crashes
    const safeItems = (items || []).filter((item): item is ImageCarouselItem => !!item && typeof item === 'object');

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + (safeItems.length || 0)) % (safeItems.length || 1));
    }, [safeItems.length]);

    useEffect(() => {
        if (autoPlay && !isPaused && safeItems.length > 1) {
            timerRef.current = setInterval(() => paginate(1), interval);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [autoPlay, isPaused, safeItems.length, interval, paginate]);

    if (safeItems.length === 0) return null;

    const currentItem = safeItems[current] || safeItems[0];
    if (!currentItem) return null;

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.1,
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
            scale: 0.9,
        }),
    };

    return (
        <section
            className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-slate-900"
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
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 },
                        scale: { duration: 0.7 }
                    }}
                    className="absolute inset-0"
                >
                    {currentItem.url ? (
                        <Image
                            src={currentItem.url}
                            alt={currentItem.alt || "Carousel image"}
                            fill
                            priority={current === 0} // prioritize LCP for the first image
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <span className="text-slate-700 font-bold uppercase tracking-widest text-sm italic">Image Placeholder</span>
                        </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Content - Positioned lower on mobile */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end md:justify-center text-center p-6 sm:p-12 pb-20 sm:pb-32 md:pb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {currentItem.subtitle && (
                                <span className="inline-block text-nb-green font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3 sm:mb-4">
                                    {currentItem.subtitle}
                                </span>
                            )}
                            {currentItem.title && (
                                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight max-w-4xl mx-auto">
                                    {currentItem.title}
                                </h2>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            {showControls && safeItems.length > 1 && (
                <>
                    <button
                        onClick={() => paginate(-1)}
                        aria-label="Previous slide"
                        title="Previous slide"
                        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        aria-label="Next slide"
                        title="Next slide"
                        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
                    >
                        <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
                    </button>
                </>
            )}

            {/* Dots */}
            {showDots && safeItems.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {safeItems.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > current ? 1 : -1);
                                setCurrent(i);
                            }}
                            title={`Go to slide ${i + 1}`}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-500 ${current === i ? 'w-8 bg-nb-green' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
