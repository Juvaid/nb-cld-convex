"use client";
import React from "react";

export interface LayeredDepthHeroProps {
    sectionId?: string;
    eyebrow?: string;
    headline?: string;
    subtext?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    backgroundImage?: string;
}

export default function LayeredDepthHero({
    sectionId,
    eyebrow = "From Formula to Finished Product",
    headline = "Bespoke Manufacturing for the World's Most Discerning Brands.",
    subtext = "Eighteenth-century standards, twenty-first-century science. End-to-end personal care manufacturing at scale.",
    primaryButtonText = "Start Your Project",
    primaryButtonHref = "/contact",
    secondaryButtonText = "View Our Services",
    secondaryButtonHref = "/services",
    stat1Value = "18+",
    stat1Label = "Years Excellence",
    stat2Value = "1,500+",
    stat2Label = "Proprietary Formulas",
    backgroundImage = "",
}: LayeredDepthHeroProps) {
    return (
        <section id={sectionId} className="relative w-full min-h-[90vh] flex flex-col justify-end overflow-hidden bg-slate-900">
            {/* Background image layer */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                />
            )}

            {/* Deep layered gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-transparent to-transparent" />

            {/* Decorative vertical lines */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                {[20, 40, 60, 80].map((p) => (
                    <div key={p} className="absolute top-0 bottom-0 w-px bg-white" style={{ left: `${p}%` }} />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 md:px-16 pb-16 pt-32 max-w-7xl mx-auto w-full">
                <div className="max-w-3xl">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-px bg-[#157f3c]" />
                        <span className="text-[#157f3c] font-semibold text-sm uppercase tracking-widest">{eyebrow}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
                        {headline}
                    </h1>

                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10">{subtext}</p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 mb-16">
                        <a
                            href={primaryButtonHref}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#157f3c] hover:bg-[#0d5a2a] text-white font-bold rounded-full transition-colors"
                        >
                            {primaryButtonText}
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                        <a
                            href={secondaryButtonHref}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition-colors backdrop-blur-sm"
                        >
                            {secondaryButtonText}
                        </a>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-10 pt-8 border-t border-white/10">
                        <div>
                            <p className="text-4xl font-extrabold text-white">{stat1Value}</p>
                            <p className="text-slate-400 text-sm mt-1">{stat1Label}</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <p className="text-4xl font-extrabold text-white">{stat2Value}</p>
                            <p className="text-slate-400 text-sm mt-1">{stat2Label}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
