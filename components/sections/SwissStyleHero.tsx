"use client";
import React from "react";

export interface SwissStyleHeroProps {
    sectionId?: string;
    category?: string;
    issueNumber?: string;
    headline?: string;
    subtext?: string;
    leftStat?: string;
    leftStatLabel?: string;
    centerStat?: string;
    centerStatLabel?: string;
    rightStat?: string;
    rightStatLabel?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
}

export default function SwissStyleHero({
    sectionId,
    category = "MANUFACTURING",
    issueNumber = "ISO 9001",
    headline = "Precision. Purity. Performance.",
    subtext = "B2B personal care manufacturing at its most refined — where botanical heritage meets clinical precision.",
    leftStat = "18+",
    leftStatLabel = "Years",
    centerStat = "1500+",
    centerStatLabel = "Formulations",
    rightStat = "750T",
    rightStatLabel = "Monthly",
    primaryButtonText = "Partner With Us →",
    primaryButtonHref = "/contact",
}: SwissStyleHeroProps) {
    return (
        <section id={sectionId} className="w-full bg-white border-b border-slate-200">
            {/* Top bar */}
            <div className="border-b border-slate-900 px-6 md:px-12 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-900">{category}</span>
                    <span className="w-px h-4 bg-slate-300" />
                    <span className="text-xs text-slate-500 uppercase tracking-widest">{issueNumber}</span>
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">Nature's Boon</div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200">
                {/* Left: headline */}
                <div className="md:col-span-7 border-r border-slate-200 px-6 md:px-12 py-16">
                    {/* Decorative number */}
                    <p className="text-[120px] font-extrabold text-slate-100 leading-none select-none mb-2 -ml-3">
                        №1
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.05] tracking-tight -mt-6 mb-6">
                        {headline}
                    </h1>
                    <p className="text-slate-500 text-lg max-w-lg mb-8">{subtext}</p>
                    <a
                        href={primaryButtonHref}
                        className="inline-flex items-center gap-2 text-[#157f3c] font-bold text-lg border-b-2 border-[#157f3c] pb-0.5 hover:opacity-70 transition-opacity"
                    >
                        {primaryButtonText}
                    </a>
                </div>

                {/* Right: stats */}
                <div className="md:col-span-5 flex flex-col">
                    {/* Stat 1 */}
                    <div className="flex-1 border-b border-slate-200 px-8 py-10 flex flex-col justify-center">
                        <p className="text-5xl font-extrabold text-slate-900 mb-1">{leftStat}</p>
                        <p className="text-xs uppercase tracking-widest text-slate-500">{leftStatLabel} of Excellence</p>
                    </div>
                    {/* Stat 2 */}
                    <div className="flex-1 border-b border-slate-200 px-8 py-10 flex flex-col justify-center bg-[#157f3c]">
                        <p className="text-5xl font-extrabold text-white mb-1">{centerStat}</p>
                        <p className="text-xs uppercase tracking-widest text-white/70">{centerStatLabel} Available</p>
                    </div>
                    {/* Stat 3 */}
                    <div className="flex-1 px-8 py-10 flex flex-col justify-center">
                        <p className="text-5xl font-extrabold text-slate-900 mb-1">{rightStat}</p>
                        <p className="text-xs uppercase tracking-widest text-slate-500">{rightStatLabel} Capacity</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
