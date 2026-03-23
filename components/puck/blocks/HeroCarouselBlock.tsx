"use client";

import React, { useState, useEffect } from "react";
import { ComponentConfig } from "@puckeditor/core";
import { ImagePicker } from "@/components/ImagePicker";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { sharedFields } from "../fields/shared";

export interface HeroCarouselSlide {
    image: string;
    mobileImage?: string;
    video?: string;
    mobileVideo?: string;
    videoMuted?: boolean;
    videoLoop?: boolean;
    videoAutoPlay?: boolean;
    overlayOpacity: number;
    align: "left" | "center" | "right";
    tagline?: string;
    title?: string;
    description?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    bannerLink?: string;
    ctaPositioning?: "relative" | "fixed";
    mobileVerticalAlign?: "top" | "center" | "bottom";
}

export interface HeroCarouselProps {
    useDesignSystem?: boolean;
    autoPlay: boolean;
    interval: number;
    hideArrows?: boolean;
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

export const HeroCarouselBlock = ({ useDesignSystem = true, autoPlay, interval, hideArrows = false, animationType = "fade", slides }: HeroCarouselProps) => {
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

    if (!slides || slides.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-100 text-slate-500 rounded-xl m-4 border-2 border-dashed border-slate-300">
                Hero Carousel: Please add slides in the sidebar.
            </div>
        );
    }

    const activeIndex = ((currentIndex % slides.length) + slides.length) % slides.length;
    const slide = slides[activeIndex];

    if (!slide) {
        return (
            <div className="py-20 text-center bg-slate-50 text-slate-400 rounded-xl m-4 border-2 border-dashed border-slate-200">
                Invalid Slide Data
            </div>
        );
    }

    const alignClass = slide.align === "center" ? "items-center text-center mx-auto" : slide.align === "right" ? "items-end text-right ml-auto" : "items-start text-left mr-auto";
    const contentWidthClass = slide.align === "center" ? "max-w-3xl xl:max-w-4xl" : "max-w-xl xl:max-w-2xl";

    const verticalAlignClass = slide.mobileVerticalAlign === "top"
        ? "justify-start pt-12 md:justify-center md:pt-0"
        : slide.mobileVerticalAlign === "center"
            ? "justify-center"
            : "justify-end pb-14 md:justify-center md:pb-0"; // default to bottom with adjusted padding

    return (
        <div className="w-full bg-transparent p-0 m-0">
            {/* Wrapper with side margins (reduced for edge-to-edge feel) */}
            <div className="mx-auto max-w-[1920px] px-0 md:px-4 lg:px-6 relative">

                {/* Navigation Arrows Removed per User Request */}


                {/* The card itself - adjusted aspect ratios for more panoramic feel */}
                <div className="relative w-full aspect-square md:aspect-[21/8] xl:aspect-[25/8] min-h-[300px] xl:min-h-[450px] rounded-none md:rounded-[2.5rem] overflow-hidden group shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            variants={animationVariants[animationType] || animationVariants.fade}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500;
                                if (offset.x > 100 || (swipe && offset.x > 0)) {
                                    paginate(-1);
                                } else if (offset.x < -100 || (swipe && offset.x < 0)) {
                                    paginate(1);
                                }
                            }}
                            className="absolute inset-0 cursor-grab active:cursor-grabbing"
                        >
                            {/* Video Support */}
                            {slide.mobileVideo && (
                                <div className="block sm:hidden absolute inset-0 z-0">
                                    <video
                                        src={slide.mobileVideo?.startsWith("http") ? slide.mobileVideo : (slide.mobileVideo ? `/api/storage/${slide.mobileVideo}` : "")}
                                        poster={slide.mobileImage ? (slide.mobileImage.startsWith("http") ? slide.mobileImage : `/api/storage/${slide.mobileImage}`) : (slide.image?.startsWith("http") ? slide.image : (slide.image ? `/api/storage/${slide.image}` : ""))}
                                        autoPlay={slide.videoAutoPlay ?? true}
                                        muted={slide.videoMuted ?? true}
                                        loop={slide.videoLoop ?? true}
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            {slide.video && (
                                <div className={`absolute inset-0 z-0 ${slide.mobileVideo ? "hidden sm:block" : "block"}`}>
                                    <video
                                        src={slide.video?.startsWith("http") ? slide.video : (slide.video ? `/api/storage/${slide.video}` : "")}
                                        poster={slide.image?.startsWith("http") ? slide.image : (slide.image ? `/api/storage/${slide.image}` : "")}
                                        autoPlay={slide.videoAutoPlay ?? true}
                                        muted={slide.videoMuted ?? true}
                                        loop={slide.videoLoop ?? true}
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Image Fallback/Background (Visible only if video is NOT present or failing) */}
                            {slide.image && !slide.video && !slide.mobileVideo && (
                                <>
                                    {/* Mobile Image (Visible only on small screens) */}
                                    {slide.mobileImage && (
                                        <div className="block sm:hidden absolute inset-0">
                                            <Image
                                                src={slide.mobileImage?.startsWith("http") ? slide.mobileImage : (slide.mobileImage ? `/api/storage/${slide.mobileImage}` : "/favicon.ico")}
                                                alt={slide.title || "Hero mobile background"}
                                                fill
                                                className="object-cover origin-center"
                                                priority={activeIndex === 0}
                                                sizes="(max-width: 640px) 100vw, 0px"
                                            />
                                        </div>
                                    )}
                                    {/* Desktop Image (Hidden on small screens IF mobile image exists) */}
                                    <div className={`absolute inset-0 ${slide.mobileImage ? 'hidden sm:block' : 'block'}`}>
                                        <Image
                                            src={slide.image?.startsWith("http") ? slide.image : (slide.image ? `/api/storage/${slide.image}` : "/favicon.ico")}
                                            alt={slide.title || "Hero background"}
                                            fill
                                            className="object-cover origin-center"
                                            priority={activeIndex === 0}
                                            sizes={slide.mobileImage ? "(max-width: 640px) 0px, 100vw" : "100vw"}
                                        />
                                    </div>
                                </>
                            )}
                            {/* eslint-disable-next-line react/forbid-dom-props */}
                            <style suppressHydrationWarning>{`
                                .hero-overlay-${activeIndex} {
                                    opacity: ${(slide.overlayOpacity || 50) / 100};
                                }
                            `}</style>
                            <div className={`absolute inset-0 bg-black transition-opacity duration-300 hero-overlay-${activeIndex}`} />
                            {slide.bannerLink && (
                                <Link href={slide.bannerLink} className="absolute inset-0 z-[5]" aria-label={slide.title || "Banner link"} />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="w-full h-full relative pointer-events-auto">
                            <div
                                key={activeIndex}
                                className={`absolute inset-0 flex flex-col px-6 sm:px-10 lg:px-16 ${alignClass} ${contentWidthClass} ${verticalAlignClass}`}
                            >
                                <div className="w-full max-w-full pb-4 sm:pb-0">
                                    {slide.tagline && (
                                        useDesignSystem ? (
                                            <Typography variant="detail" color="nb-green" uppercase className="mb-4 inline-block px-4 py-1.5 bg-nb-green/10 rounded-full border border-nb-green/20 backdrop-blur-sm">
                                                {slide.tagline}
                                            </Typography>
                                        ) : (
                                            <span className="mb-4 inline-block px-4 py-1.5 bg-nb-green/10 text-nb-green text-[10px] font-black uppercase tracking-widest rounded-full border border-nb-green/20 backdrop-blur-sm">
                                                {slide.tagline}
                                            </span>
                                        )
                                    )}

                                    {slide.title && (
                                        useDesignSystem ? (
                                            <Typography variant="h1" color="white" className="mb-4 md:mb-6 drop-shadow-lg">
                                                {slide.title}
                                            </Typography>
                                        ) : (
                                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg leading-[1.1]">
                                                {slide.title}
                                            </h1>
                                        )
                                    )}

                                    {slide.description && (
                                        useDesignSystem ? (
                                            <Typography variant="body" color="slate-400" weight="medium" className="text-slate-200 drop-shadow-md max-w-xl text-sm sm:text-base md:text-lg leading-relaxed">
                                                {slide.description}
                                            </Typography>
                                        ) : (
                                            <p className="text-base md:text-xl text-slate-200 drop-shadow-md max-w-xl font-medium leading-relaxed">
                                                {slide.description}
                                            </p>
                                        )
                                    )}
                                </div>

                                <div className={cn(
                                    "flex flex-row flex-wrap gap-2 sm:gap-4",
                                    slide.ctaPositioning === "fixed"
                                        ? "absolute bottom-12 md:bottom-16 lg:bottom-20 left-0 right-0 px-6 sm:px-10 lg:px-16"
                                        : "relative mt-4 md:mt-8",
                                    slide.align === "center" ? "justify-center" : slide.align === "right" ? "justify-end" : "justify-start"
                                )}>
                                    {(slide.primaryCtaText || slide.primaryCtaLink) && (
                                        <Link href={slide.primaryCtaLink || "/contact"} className="inline-block">
                                            <Button variant="primary" className="rounded-full shadow-lg px-4 py-2 sm:py-3 sm:px-8 h-9 sm:h-11 text-[12px] sm:text-sm whitespace-nowrap">
                                                {slide.primaryCtaText || "Contact us"}
                                            </Button>
                                        </Link>
                                    )}
                                    {slide.secondaryCtaText && slide.secondaryCtaLink && (
                                        <Link href={slide.secondaryCtaLink} className="inline-block">
                                            <Button variant="glass" className="rounded-full shadow-lg px-4 py-2 sm:py-3 sm:px-8 h-9 sm:h-11 text-[12px] sm:text-sm whitespace-nowrap">
                                                {slide.secondaryCtaText}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots (centered at bottom) */}
                    {slides.length > 1 && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30 pointer-events-auto">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setIndex(idx)}
                                    className={`rounded-full transition-all duration-300 ${idx === activeIndex ? "w-6 h-1.5 sm:w-8 sm:h-2 bg-nb-green" : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 hover:bg-white/60"}`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const HeroCarouselBlockConfig: ComponentConfig<HeroCarouselProps> = {
    fields: {
        useDesignSystem: sharedFields.useDesignSystem,
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
                            <span className="text-xs text-slate-500 font-medium">✨ Ideal Resolution: 2100x900 (21:9 UltraWide)</span>
                            <ImagePicker value={value} onChange={onChange} />
                        </div>
                    ),
                },
                mobileImage: {
                    type: "custom",
                    label: "Mobile Image (Fallback)",
                    render: ({ value, onChange }: any) => (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500 font-medium whitespace-break-spaces">
                                ✨ Ideal Resolution: 1080x1080 (1:1 Square)
                                <br />
                                Used as fallback and video poster on mobile.
                            </span>
                            <ImagePicker value={value} onChange={onChange} />
                        </div>
                    ),
                },
                video: {
                    type: "custom",
                    label: "Desktop Video",
                    render: ({ value, onChange }: any) => (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500 font-medium">✨ Preferred: MP4/WebM with optimized bitrate</span>
                            <ImagePicker value={value} onChange={onChange} />
                        </div>
                    ),
                },
                mobileVideo: {
                    type: "custom",
                    label: "Mobile Video (Optional)",
                    render: ({ value, onChange }: any) => (
                        <div className="flex flex-col gap-2">
                            <ImagePicker value={value} onChange={onChange} />
                        </div>
                    ),
                },
                videoAutoPlay: {
                    type: "radio",
                    label: "Video Auto Play",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
                videoMuted: {
                    type: "radio",
                    label: "Video Muted",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
                videoLoop: {
                    type: "radio",
                    label: "Video Loop",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
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
                mobileVerticalAlign: {
                    type: "select",
                    label: "Mobile Vertical Align",
                    options: [
                        { label: "Top", value: "top" },
                        { label: "Center", value: "center" },
                        { label: "Bottom", value: "bottom" },
                    ],
                },
                tagline: { type: "text" },
                title: { type: "text" },
                description: { type: "textarea" },
                primaryCtaText: { type: "text" },
                primaryCtaLink: { type: "text" },
                secondaryCtaText: { type: "text" },
                secondaryCtaLink: { type: "text" },
                bannerLink: { type: "text", label: "Banner Click Link (Optional)" },
                ctaPositioning: {
                    type: "radio",
                    label: "CTA Positioning",
                    options: [
                        { label: "Relative to Content", value: "relative" },
                        { label: "Fixed at Bottom", value: "fixed" },
                    ],
                },
            },
        },
    },
    defaultProps: {
        useDesignSystem: true,
        autoPlay: true,
        interval: 5000,
        animationType: "slideHorizontal",
        slides: [
            {
                image: "",
                mobileImage: "",
                overlayOpacity: 50,
                align: "left",
                mobileVerticalAlign: "bottom",
                tagline: "NEW ARRIVALS",
                title: "Premium Formulations",
                description: "Discover our latest B2B high-grade formulas.",
                primaryCtaText: "Contact us",
                primaryCtaLink: "/contact",
                ctaPositioning: "relative",
                bannerLink: "",
            },
        ],
    },
    render: (props) => <HeroCarouselBlock {...props} />,
};
