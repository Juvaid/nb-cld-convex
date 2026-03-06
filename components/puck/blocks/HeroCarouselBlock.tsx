"use client";

import React, { useState, useEffect } from "react";
import { ComponentConfig } from "@puckeditor/core";
import { ImagePicker } from "@/components/ImagePicker";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface HeroCarouselSlide {
    image: string;
    mobileImage?: string;
    overlayOpacity: number;
    align: "left" | "center" | "right";
    tagline?: string;
    title?: string;
    description?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
}

export interface HeroCarouselProps {
    autoPlay: boolean;
    interval: number;
    animationType: "fade" | "slideHorizontal" | "slideVertical" | "zoom" | "blur";
    slides: HeroCarouselSlide[];
}

const animationVariants = {
    fade: {
        initial: { opacity: 0, scale: 1.05 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 }
    },
    slideHorizontal: {
        initial: (direction: number) => ({ opacity: 0, x: direction > 0 ? "100%" : "-100%" }),
        animate: { opacity: 1, x: 0 },
        exit: (direction: number) => ({ opacity: 0, x: direction < 0 ? "100%" : "-100%" })
    },
    slideVertical: {
        initial: (direction: number) => ({ opacity: 0, y: direction > 0 ? "100%" : "-100%" }),
        animate: { opacity: 1, y: 0 },
        exit: (direction: number) => ({ opacity: 0, y: direction < 0 ? "100%" : "-100%" })
    },
    zoom: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.1 }
    },
    blur: {
        initial: { opacity: 0, filter: "blur(20px)" },
        animate: { opacity: 1, filter: "blur(0px)" },
        exit: { opacity: 0, filter: "blur(20px)" }
    }
};

export const HeroCarouselBlock = ({ autoPlay, interval, animationType = "fade", slides }: HeroCarouselProps) => {
    const [[currentIndex, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        setPage([currentIndex + newDirection, newDirection]);
    };

    const setIndex = (index: number) => {
        setPage([index, index > currentIndex ? 1 : -1]);
    };

    useEffect(() => {
        if (!autoPlay || !slides || slides.length <= 1) return;
        const timer = setInterval(() => {
            // Disable auto-slide on mobile screens (less than 640px)
            if (typeof window !== "undefined" && window.innerWidth < 640) {
                return;
            }
            paginate(1);
        }, interval || 5000);
        return () => clearInterval(timer);
    }, [autoPlay, interval, slides, currentIndex]);

    const activeIndex = ((currentIndex % slides.length) + slides.length) % slides.length;

    if (!slides || slides.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-100 text-slate-500 rounded-xl m-4 border-2 border-dashed border-slate-300">
                Hero Carousel: Please add slides in the sidebar.
            </div>
        );
    }

    const slide = slides[activeIndex];
    const alignClass = slide.align === "center" ? "items-center text-center mx-auto" : slide.align === "right" ? "items-end text-right ml-auto" : "items-start text-left mr-auto";
    const contentWidthClass = slide.align === "center" ? "max-w-3xl xl:max-w-4xl" : "max-w-xl xl:max-w-2xl";

    return (
        <div className="relative w-full h-[45vh] min-h-[380px] md:h-[45vh] md:min-h-[400px] 2xl:max-h-[600px] overflow-hidden group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={animationVariants[animationType] || animationVariants.fade}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {slide.image && (
                        <picture>
                            {slide.mobileImage && (
                                <source media="(max-width: 640px)" srcSet={slide.mobileImage.startsWith("http") ? slide.mobileImage : `/api/storage/${slide.mobileImage}`} />
                            )}
                            <img
                                src={slide.image.startsWith("http") ? slide.image : `/api/storage/${slide.image}`}
                                alt={slide.title || "Hero background"}
                                className="absolute inset-0 w-full h-full object-cover origin-center"
                            />
                        </picture>
                    )}
                    {/* eslint-disable-next-line react/forbid-dom-props */}
                    <div
                        className="absolute inset-0 bg-black transition-opacity duration-300"
                        style={{ opacity: (slide.overlayOpacity || 50) / 100 }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pointer-events-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`flex flex-col ${alignClass} ${contentWidthClass}`}
                        >
                            {slide.tagline && (
                                <span className="mb-4 inline-block px-4 py-1.5 text-xs md:text-sm font-black text-nb-green bg-nb-green/10 rounded-full tracking-widest uppercase border border-nb-green/20 backdrop-blur-sm">
                                    {slide.tagline}
                                </span>
                            )}

                            {slide.title && (
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 md:mb-6 tracking-tight drop-shadow-lg">
                                    {slide.title}
                                </h1>
                            )}

                            {slide.description && (
                                <p className="text-sm sm:text-base md:text-lg text-slate-200 font-medium leading-relaxed mb-6 md:mb-8 drop-shadow max-w-xl">
                                    {slide.description}
                                </p>
                            )}

                            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto ${slide.align === "center" ? "justify-center mx-auto" : slide.align === "right" ? "justify-end ml-auto" : "justify-start mr-auto"}`}>
                                {slide.primaryCtaText && slide.primaryCtaLink && (
                                    <Link href={slide.primaryCtaLink} className="w-full sm:w-auto">
                                        <Button variant="primary" size="md" className="rounded-full w-full sm:w-auto shadow-lg">
                                            {slide.primaryCtaText}
                                        </Button>
                                    </Link>
                                )}
                                {slide.secondaryCtaText && slide.secondaryCtaLink && (
                                    <Link href={slide.secondaryCtaLink} className="w-full sm:w-auto">
                                        <Button variant="glass" size="md" className="rounded-full w-full sm:w-auto shadow-lg">
                                            {slide.secondaryCtaText}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => paginate(-1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 z-20 pointer-events-auto"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 z-20 pointer-events-auto"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20 pointer-events-auto">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-8 bg-nb-green" : "w-2 bg-white/40 hover:bg-white/60"}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export const HeroCarouselBlockConfig: ComponentConfig<HeroCarouselProps> = {
    fields: {
        autoPlay: {
            type: "radio",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        interval: {
            type: "number",
            label: "Interval (ms)",
        },
        animationType: {
            type: "select",
            label: "Animation Style",
            options: [
                { label: "Fade & Soft Scale", value: "fade" },
                { label: "Horizontal Slide", value: "slideHorizontal" },
                { label: "Vertical Slide", value: "slideVertical" },
                { label: "Zoom Focus", value: "zoom" },
                { label: "Cinematic Blur", value: "blur" },
            ]
        },
        slides: {
            type: "array",
            getItemSummary: (item) => item.title || "Slide",
            arrayFields: {
                image: {
                    type: "custom",
                    label: "Desktop Image",
                    render: ({ value, onChange }: any) => (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500 font-medium">✨ Ideal Resolution: 1920x1080 (16:9 Landscape)</span>
                            <ImagePicker value={value} onChange={onChange} />
                        </div>
                    ),
                },
                mobileImage: {
                    type: "custom",
                    label: "Mobile Image (Optional)",
                    render: ({ value, onChange }: any) => (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500 font-medium whitespace-break-spaces">
                                ✨ Ideal Resolution: 1080x1920 (9:16 Portrait)
                                <br />
                                Leave blank to automatically center-crop the desktop image.
                            </span>
                            <ImagePicker value={value} onChange={onChange} />
                        </div>
                    ),
                },
                overlayOpacity: {
                    type: "number",
                    label: "Overlay Opacity (%)",
                },
                align: {
                    type: "select",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                    ],
                },
                tagline: { type: "text" },
                title: { type: "text" },
                description: { type: "textarea" },
                primaryCtaText: { type: "text" },
                primaryCtaLink: { type: "text" },
                secondaryCtaText: { type: "text" },
                secondaryCtaLink: { type: "text" },
            },
        },
    },
    defaultProps: {
        autoPlay: true,
        interval: 5000,
        animationType: "slideHorizontal",
        slides: [
            {
                image: "",
                mobileImage: "",
                overlayOpacity: 50,
                align: "left",
                tagline: "NEW ARRIVALS",
                title: "Premium Formulations",
                description: "Discover our latest B2B high-grade formulas.",
                primaryCtaText: "View Collection",
                primaryCtaLink: "/products",
            },
        ],
    },
    render: (props) => <HeroCarouselBlock {...props} />,
};
