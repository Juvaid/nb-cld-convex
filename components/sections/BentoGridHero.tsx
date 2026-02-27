"use client";
import React from "react";

export interface BentoStat {
    value: string;
    label: string;
    sublabel?: string;
}

export interface BentoBadge {
    text: string;
}

export interface BentoGridHeroProps {
    sectionId?: string;
    headline?: string;
    subtext?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    stat1?: BentoStat;
    stat2?: BentoStat;
    badge1?: string;
    badge2?: string;
    centerImage?: string;
    showcaseImage?: string;
}

export default function BentoGridHero({
    sectionId,
    headline = "Crafting Beauty with\nNature's Essence",
    subtext = "B2B personal care manufacturing powered by botanical innovation and global scale.",
    primaryButtonText = "Request a Sample",
    primaryButtonHref = "/contact",
    secondaryButtonText = "View Formulations",
    secondaryButtonHref = "/products",
    stat1 = { value: "750+", label: "Monthly Tons Capacity", sublabel: "Across 4 Facilities" },
    stat2 = { value: "1500+", label: "Unique Formulations", sublabel: "Ready for White Label" },
    badge1 = "ISO 9001 Certified",
    badge2 = "Established Since 2006",
    centerImage = "",
    showcaseImage = "",
}: BentoGridHeroProps) {
    return (
        <section id={sectionId} className="bg-[#f0fdf4] py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Top row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    {/* Main hero card */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-10 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
                        {/* Subtle botanical bg */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_70%_50%,#157f3c_0%,transparent_60%)]" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0fdf4] rounded-full border border-[#157f3c]/20 mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-[#157f3c] animate-pulse" />
                                <span className="text-[#157f3c] font-bold text-xs uppercase tracking-wider">B2B Manufacturing</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] mb-4 whitespace-pre-line">
                                {headline}
                            </h1>
                            <p className="text-slate-500 text-lg max-w-md mb-8">{subtext}</p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={primaryButtonHref}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#157f3c] hover:bg-[#0d5a2a] text-white font-bold rounded-full transition-colors"
                                >
                                    {primaryButtonText}
                                </a>
                                <a
                                    href={secondaryButtonHref}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-full border border-slate-200 transition-colors"
                                >
                                    {secondaryButtonText}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stat card 1 */}
                    <div className="bg-[#157f3c] rounded-3xl p-8 flex flex-col justify-end text-white min-h-[200px] relative overflow-hidden">
                        <div className="absolute top-6 right-6 text-white/10 text-8xl font-bold select-none leading-none">
                            {typeof stat1.value === "string" ? stat1.value.replace(/[^0-9]/g, "") : ""}
                        </div>
                        <p className="text-white/70 text-xs uppercase tracking-wider mb-2 relative z-10">{stat1.sublabel}</p>
                        <p className="text-5xl font-extrabold mb-1 relative z-10">{stat1.value}</p>
                        <p className="text-white/80 text-sm relative z-10">{stat1.label}</p>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Badge 1 */}
                    <div className="bg-white rounded-3xl p-7 flex items-center gap-4 border border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-[#157f3c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{badge1}</p>
                            <p className="text-sm text-slate-500">GMP Certified Facility</p>
                        </div>
                    </div>

                    {/* Stat card 2 */}
                    <div className="bg-slate-900 rounded-3xl p-7 flex flex-col justify-end text-white relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-white/5 text-7xl font-bold select-none leading-none">
                            {typeof stat2.value === "string" ? stat2.value.replace(/[^0-9]/g, "") : ""}
                        </div>
                        <p className="text-4xl font-extrabold mb-1 relative z-10">{stat2.value}</p>
                        <p className="text-white/70 text-sm relative z-10">{stat2.label}</p>
                        <p className="text-white/40 text-xs relative z-10">{stat2.sublabel}</p>
                    </div>

                    {/* Badge 2 */}
                    <div className="bg-[#157f3c] rounded-3xl p-7 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-white">{badge2}</p>
                            <p className="text-sm text-white/70">Powering Global Brands</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
