"use client";
import React from "react";

export interface StackedCard {
    badge?: string;
    headline: string;
    description: string;
    buttonText?: string;
    buttonHref?: string;
    image?: string;
    accentColor?: string;
}

export interface StackedCardHeroProps {
    sectionId?: string;
    eyebrow?: string;
    headline?: string;
    subtext?: string;
    cards?: StackedCard[];
}

const DEFAULT_CARDS: StackedCard[] = [
    {
        badge: "Private Label",
        headline: "Hydrating Body Wash",
        description: "Rich, skin-softening botanical blend. Available in 50+ scent profiles, fully customisable label and packaging.",
        buttonText: "View Details",
        buttonHref: "/products",
        accentColor: "#157f3c",
    },
    {
        badge: "Organic Collection",
        headline: "Volumizing Shampoo",
        description: "Organic botanical blend with biotin complex. Zero sulphates, 100% vegan — your customers will love it.",
        buttonText: "View Details",
        buttonHref: "/products",
        accentColor: "#0d5a2a",
    },
    {
        badge: "Premium Formula",
        headline: "Radiance Serum",
        description: "High-performance Vitamin C formulation with hyaluronic acid base. Clinical-grade efficacy at scale.",
        buttonText: "View Details",
        buttonHref: "/products",
        accentColor: "#658671",
    },
];

export default function StackedCardHero({
    sectionId,
    eyebrow = "Premium Contract Manufacturing",
    headline = "Everything Your Brand Needs, Under One Roof",
    subtext = "From custom formulation to sustainable packaging and global logistics — end-to-end manufacturing solutions for premium personal care brands.",
    cards = DEFAULT_CARDS,
}: StackedCardHeroProps) {
    return (
        <section id={sectionId} className="w-full bg-[#f0fdf4] py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#157f3c]/20 shadow-sm mb-5">
                        <span className="flex h-2 w-2 rounded-full bg-[#157f3c] animate-pulse" />
                        <span className="text-[#157f3c] font-bold text-xs uppercase tracking-wider">{eyebrow}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 max-w-2xl">{headline}</h1>
                    <p className="text-slate-500 text-lg max-w-xl">{subtext}</p>
                </div>

                {/* Stacked cards */}
                <div className="flex flex-col gap-4">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#157f3c]/30 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row items-center">
                                {/* Left: content */}
                                <div className="flex-1 p-8 md:p-10">
                                    {card.badge && (
                                        <span
                                            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 text-white"
                                            style={{ backgroundColor: card.accentColor ?? "#157f3c" }}
                                        >
                                            {card.badge}
                                        </span>
                                    )}
                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{card.headline}</h3>
                                    <p className="text-slate-500 mb-6 max-w-md">{card.description}</p>
                                    {card.buttonText && (
                                        <a
                                            href={card.buttonHref ?? "#"}
                                            className="inline-flex items-center gap-2 text-sm font-bold text-[#157f3c] group-hover:gap-3 transition-all duration-200"
                                        >
                                            {card.buttonText}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </a>
                                    )}
                                </div>

                                {/* Right: accent strip */}
                                <div
                                    className="w-full md:w-48 h-32 md:h-full md:min-h-[160px] flex-shrink-0 flex items-center justify-center"
                                    style={{ backgroundColor: card.accentColor ?? "#157f3c" }}
                                >
                                    <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" />
                                        <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
