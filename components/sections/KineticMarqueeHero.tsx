"use client";
import React from "react";

export interface KineticMarqueeHeroProps {
    sectionId?: string;
    eyebrow?: string;
    headline?: string;
    highlightWord?: string;
    subtext?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    marqueeItems?: string[];
    marqueeSpeed?: number; // seconds — higher = slower
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
}

const DEFAULT_MARQUEE = [
    "Skin Care", "Hair Care", "Body Wash", "Sun Care", "Serums", "Oils", "Balms",
    "Shampoo", "Conditioner", "Face Wash", "Toners", "Eye Cream", "Lip Care",
];

export default function KineticMarqueeHero({
    sectionId,
    eyebrow = "Premium B2B Manufacturing",
    headline = "Scale Your Brand with",
    highlightWord = "Nature's Power",
    subtext = "1500+ proven formulations. ISO certified. Green chemistry. Your vision, our expertise.",
    primaryButtonText = "Start Your Project",
    primaryButtonHref = "/contact",
    secondaryButtonText = "Browse Formulations",
    secondaryButtonHref = "/products",
    marqueeItems = DEFAULT_MARQUEE,
    marqueeSpeed = 35,
    stat1Value = "750+",
    stat1Label = "Monthly Tons",
    stat2Value = "1500+",
    stat2Label = "Formulations",
}: KineticMarqueeHeroProps) {
    // Duplicate exactly once so translateX(-50%) = one full set
    const doubled = [...marqueeItems, ...marqueeItems];

    return (
        <section id={sectionId} className="w-full bg-white overflow-hidden">
            {/* ── Keyframes injected first so the element below can reference them ── */}
            <style>{`
                @keyframes kmh-scroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                .kmh-track {
                    display: inline-flex;
                    gap: 2rem;
                    align-items: center;
                    white-space: nowrap;
                    animation: kmh-scroll ${marqueeSpeed}s linear infinite;
                    will-change: transform;
                }
                .kmh-track:hover { animation-play-state: paused; }
            `}</style>

            {/* Main hero area */}
            <div className="max-w-7xl mx-auto px-6 pt-0 pb-8">
                <div className="flex flex-col items-center text-center">
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0fdf4] rounded-full border border-[#157f3c]/20 mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-[#157f3c] animate-pulse" />
                        <span className="text-[#157f3c] font-bold text-xs uppercase tracking-wider">{eyebrow}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-4 tracking-tight">
                        {headline}{" "}
                        <span className="text-[#157f3c]">{highlightWord}</span>
                    </h1>

                    <p className="text-slate-500 text-lg md:text-xl max-w-xl mb-6">{subtext}</p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center mb-8">
                        <a href={primaryButtonHref} className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#157f3c] hover:bg-[#0d5a2a] text-white font-bold rounded-full transition-colors">
                            {primaryButtonText}
                        </a>
                        <a href={secondaryButtonHref} className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-full border border-slate-200 transition-colors">
                            {secondaryButtonText}
                        </a>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-12 justify-center">
                        <div className="text-center">
                            <p className="text-4xl font-extrabold text-slate-900">{stat1Value}</p>
                            <p className="text-sm text-slate-400 mt-1">{stat1Label}</p>
                        </div>
                        <div className="w-px bg-slate-200" />
                        <div className="text-center">
                            <p className="text-4xl font-extrabold text-slate-900">{stat2Value}</p>
                            <p className="text-sm text-slate-400 mt-1">{stat2Label}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Kinetic marquee strip ── */}
            <div className="border-t border-b border-slate-100 bg-[#f0fdf4] py-4 overflow-hidden">
                <div className="kmh-track">
                    {doubled.map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-3 text-sm font-semibold text-slate-600 flex-shrink-0 px-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#157f3c] flex-shrink-0" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

