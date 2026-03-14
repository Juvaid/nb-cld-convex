"use client";

import React, { useRef, useState, useEffect } from "react";
import { ComponentConfig } from "@puckeditor/core";
import { ImagePicker } from "@/components/ImagePicker";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { sharedFields } from "../fields/shared";
export interface CategoryCardProps {
    title: string;
    image: string;
    link: string;
}

export interface ProductCategoryCarouselProps {
    useDesignSystem?: boolean;
    heading: string;
    subheading: string;
    categories: CategoryCardProps[];
    autoSlideMobile?: boolean;
}

export const ProductCategoryCarouselBlock = ({ useDesignSystem = true, heading, subheading, categories, autoSlideMobile = true }: ProductCategoryCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.clientWidth * 0.8; // Scroll 80% of container width
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollLeft = container.scrollLeft;
            const child = container.children?.[0] as HTMLElement;
            if (child) {
                // Determine item width including gap
                const itemWidth = child.offsetWidth;
                // Adding gap based on screen size (16px/1rem for mobile)
                const gap = (typeof window !== "undefined" && window.innerWidth >= 768) ? 24 : 16;
                const index = Math.round(scrollLeft / (itemWidth + gap));
                setActiveIndex(index);
            }
        }
    };

    useEffect(() => {
        if (!autoSlideMobile || typeof window === "undefined") return;

        // Only auto-slide on mobile screens (width < 768px)
        const isMobile = window.innerWidth < 768;
        if (!isMobile) return;

        const interval = setInterval(() => {
            if (scrollContainerRef.current && categories.length > 0) {
                const container = scrollContainerRef.current;
                const child = container.children?.[0] as HTMLElement;
                if (!child) return;

                const itemWidth = child.offsetWidth;
                const gap = 16; // mobile gap
                const maxScroll = container.scrollWidth - container.clientWidth;

                let newScrollLeft = container.scrollLeft + itemWidth + gap;

                // If we are at the end, loop back to start
                if (newScrollLeft >= maxScroll - 10) {
                    newScrollLeft = 0;
                }

                container.scrollTo({
                    left: newScrollLeft,
                    behavior: 'smooth'
                });
            }
        }, 3000); // 3 seconds interval

        return () => clearInterval(interval);
    }, [autoSlideMobile, categories.length]);

    if (!categories || categories.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-100 text-slate-500 rounded-xl m-4 border-2 border-dashed border-slate-300">
                Product Category Carousel: Please add categories in the sidebar.
            </div>
        );
    }

    return (
        <section className="pt-0 pb-0 md:pt-0 md:pb-0 bg-white relative overflow-hidden w-full">
            <div className="max-w-full mx-auto px-4 md:px-6">
                {/* Header block - ultra-minimized margin */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div className="max-w-2xl">
                        {useDesignSystem ? (
                            <Typography variant="section-title" color="slate-900" className="m-0 mt-0 mb-0.5">
                                {heading}
                            </Typography>
                        ) : (
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                                {heading}
                            </h2>
                        )}
                        {subheading && (
                            useDesignSystem ? (
                                <Typography variant="section-subtitle" color="slate-600" className="m-0 mt-0">
                                    {subheading}
                                </Typography>
                            ) : (
                                <p className="text-slate-600">
                                    {subheading}
                                </p>
                            )
                        )}
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto gap-4 md:gap-6 pb-0 snap-x snap-mandatory hide-scrollbar"
                    >
                        {categories.map((category, idx) => (
                            <Link
                                key={idx}
                                href={category.link || "/products"}
                                className="block relative flex-none w-[85vw] sm:w-[45vw] md:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] aspect-[4/3] rounded-xl overflow-hidden snap-start group shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <Image
                                    src={category.image?.startsWith("http") ? category.image : (category.image ? `/api/storage/${category.image}` : "/favicon.ico")}
                                    alt={category.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
                                />
                                {/* Title Overlay matched to user screenshot (solid dark block bottom left) */}
                                <div className="absolute bottom-4 left-4 bg-[#111822] px-4 py-2 mt-auto group-hover:bg-[#159a4c] transition-colors duration-300">
                                    <span className="text-white font-medium text-sm sm:text-base tracking-wide whitespace-nowrap">
                                        {category.title}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* CSS reset for hiding scrollbars strictly */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .hide-scrollbar {
                            -ms-overflow-style: none;  /* IE and Edge */
                            scrollbar-width: none;  /* Firefox */
                        }
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none; /* Chrome, Safari and Opera */
                        }
                    `}} />
                </div>

                {/* Pagination Dots - ultra-tight top margin */}
                <div className="flex justify-center items-center gap-1 mt-1">
                    {categories.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (scrollContainerRef.current) {
                                    const child = scrollContainerRef.current?.children?.[0] as HTMLElement;
                                    if (child) {
                                        scrollContainerRef.current?.scrollTo({
                                            left: (child.offsetWidth + 16) * idx,
                                            behavior: 'smooth'
                                        });
                                    }
                                }
                            }}
                            className={`h-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeIndex === idx ? 'bg-nb-green w-8' : 'bg-slate-300 w-2.5 hover:bg-slate-400'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export const ProductCategoryCarouselBlockConfig: ComponentConfig<ProductCategoryCarouselProps> = {
    fields: {
        useDesignSystem: sharedFields.useDesignSystem,
        heading: { type: "text", label: "Section Heading (H2)" },
        subheading: { type: "text", label: "Section Subheading" },
        categories: {
            type: "array",
            getItemSummary: (item) => item.title || "Category",
            arrayFields: {
                title: { type: "text", label: "Category Title (Visible)" },
                image: {
                    type: "custom",
                    label: "Cover Image",
                    render: ({ value, onChange }: any) => (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500">✨ Ideal Ratio: 4:3 (e.g. 800x600)</span>
                            <ImagePicker value={value} onChange={onChange} />
                        </div>
                    ),
                },
                link: { type: "text", label: "Link URL" },
            },
        },
        autoSlideMobile: {
            type: "radio",
            label: "Auto Slide on Mobile",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false }
            ]
        }
    },
    defaultProps: {
        useDesignSystem: true,
        heading: "Categories",
        subheading: "Customized solutions for streamlined product manufacturing.",
        autoSlideMobile: true,
        categories: [
            {
                title: "Home & PetCare Products",
                image: "",
                link: "/products"
            },
            {
                title: "Baby Care Products",
                image: "",
                link: "/products"
            },
            {
                title: "Nutraceutical/ Healthcare & Ayurveda",
                image: "",
                link: "/products"
            }
        ],
    },
    render: (props) => <ProductCategoryCarouselBlock {...props} />,
};
