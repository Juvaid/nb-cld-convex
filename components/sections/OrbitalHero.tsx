"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────── TYPES ─────────────────────────── */
export interface OrbitalHeroProps {
    /* content */
    headline?: string;
    highlightWord?: string;
    subtext?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    /* centre image */
    centerImage?: string;
    /* orbit stats */
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    badge1Text?: string;
    badge2Text?: string;
    /* journey strip */
    showJourney?: boolean;
    journeyStep1Label?: string;
    journeyStep2Label?: string;
    journeyStep3Label?: string;
    /* misc */
    sectionId?: string;
}

/* ─────────────────────────── SVG ICONS ────────────────────────── */
const FactoryIcon = () => (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <rect x="2" y="22" width="36" height="16" rx="2" fill="#dcfce7" stroke="#15803d" strokeWidth="1.5" />
        <path d="M2 22L10 14V22H18L26 14V22H34V10H26L18 18V10H10L2 18V22Z" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="8" y="26" width="6" height="12" rx="1" fill="#15803d" />
        <rect x="19" y="26" width="6" height="8" rx="1" fill="#86efac" />
        <rect x="28" y="26" width="6" height="12" rx="1" fill="#15803d" />
        <rect x="16" y="4" width="3" height="8" rx="1.5" fill="#15803d" />
        <rect x="23" y="2" width="3" height="10" rx="1.5" fill="#16a34a" />
    </svg>
);

const BrandIcon = () => (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <circle cx="20" cy="20" r="17" fill="#dcfce7" stroke="#15803d" strokeWidth="1.5" />
        <path d="M20 8C20 8 12 14 12 21a8 8 0 0016 0c0-7-8-13-8-13z" fill="#86efac" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 16v12M16 24l4-4 4 4" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DeliveryIcon = () => (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <rect x="2" y="14" width="24" height="16" rx="2" fill="#dcfce7" stroke="#15803d" strokeWidth="1.5" />
        <path d="M26 20h6l4 6v4h-4" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M26 30h-24" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="32" r="3" fill="#15803d" />
        <circle cx="29" cy="32" r="3" fill="#15803d" />
        <path d="M8 14V8h12v6" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 10h4" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

/* ─────────────────────────── ANIMATED PATH ────────────────────── */
const AnimatedDash = () => (
    <div className="flex-1 mx-2 relative flex items-center">
        <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 12" preserveAspectRatio="none">
            {/* static dashed track */}
            <line x1="0" y1="6" x2="100" y2="6" stroke="#bbf7d0" strokeWidth="1.5" strokeDasharray="4 3" />
            {/* animated travelling dot */}
            <circle r="3" cy="6" fill="#15803d">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M0,0 L100,0" />
            </circle>
        </svg>
        {/* arrow head */}
        <svg className="absolute right-0 w-3 h-3 -mr-1" viewBox="0 0 10 10">
            <polyline points="2,2 8,5 2,8" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

/* ─────────────────────────── MAIN COMPONENT ───────────────────── */
export default function OrbitalHero({
    headline = "Crafting Premium Personal Care",
    highlightWord = "Personal Care",
    subtext = "B2B personal care manufacturing powered by botanical innovation, ISO 9001 certified and delivered at global scale.",
    primaryButtonText = "Get a Quote",
    primaryButtonHref = "/contact",
    secondaryButtonText = "Our Story",
    secondaryButtonHref = "/about",
    centerImage,
    stat1Value = "750+",
    stat1Label = "Monthly Tons",
    stat2Value = "1500+",
    stat2Label = "Formulations",
    badge1Text = "ISO 9001:2015 ✓",
    badge2Text = "Est. 2006",
    showJourney = true,
    journeyStep1Label = "Manufacturing",
    journeyStep2Label = "Your Brand",
    journeyStep3Label = "Delivered",
    sectionId,
}: OrbitalHeroProps) {

    /* Stagger sonar rings */
    const rings = [
        { delay: "0s", scale: "1.35", opacity: "0.18" },
        { delay: "0.8s", scale: "1.7", opacity: "0.10" },
        { delay: "1.6s", scale: "2.1", opacity: "0.055" },
    ];

    const headlineParts = highlightWord && typeof headline === "string"
        ? headline.replace(highlightWord, `|||${highlightWord}|||`).split("|||")
        : [headline];

    return (
        <section
            id={sectionId}
            className="relative w-full bg-white overflow-hidden min-h-[90vh]"
        >
            {/* ── Sage radial background glow ── */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_65%_at_50%_52%,_#f0fdf4_0%,_white_70%)]"
            />

            {/* ── Outer dashed guide ring (decorative) ── */}
            <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-green-200 w-[580px] h-[580px] -mt-[30px]"
            />

            {/* ── HEADLINE (above the circle) ── */}
            <div className="relative z-10 pt-4 pb-2 text-center px-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight max-w-2xl mx-auto">
                    {headlineParts.map((part, i) =>
                        part === highlightWord ? (
                            <span key={i} className="text-[#15803d]">{part}</span>
                        ) : (
                            <span key={i}>{part}</span>
                        )
                    )}
                </h1>
                <p className="mt-3 text-slate-500 text-base max-w-md mx-auto leading-relaxed">
                    {subtext}
                </p>
            </div>

            {/* ── ORBITAL COMPOSITION ── */}
            <div className="relative z-10 flex items-center justify-center h-[420px]">

                {/* LEFT stat card (9 o'clock) */}
                <div className="absolute left-1/2 top-1/2 [transform:translate(calc(-50%-260px),-50%)]">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-md px-5 py-4 min-w-[130px] text-center">
                        <div className="text-2xl font-black text-slate-900">{stat2Value}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">{stat2Label}</div>
                    </div>
                </div>

                {/* ISO badge (10-11 o'clock) */}
                <div className="absolute left-1/2 top-1/2 [transform:translate(calc(-50%-200px),calc(-50%-115px))]">
                    <div className="bg-white border border-green-100 rounded-full shadow-sm px-4 py-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#15803d] inline-block" />
                        <span className="text-xs font-bold text-slate-700">{badge1Text}</span>
                    </div>
                </div>

                {/* EST badge (1-2 o'clock) */}
                <div className="absolute left-1/2 top-1/2 [transform:translate(calc(-50%+140px),calc(-50%-120px))]">
                    <div className="bg-[#f0fdf4] border border-green-100 rounded-full shadow-sm px-4 py-2 flex items-center gap-2">
                        <span className="text-sm">🌿</span>
                        <span className="text-xs font-bold text-slate-700">{badge2Text}</span>
                    </div>
                </div>

                {/* ── CENTER CIRCLE with SONAR RINGS ── */}
                <div className="relative flex items-center justify-center w-[220px] h-[220px]">
                    {/* Sonar pulse rings */}
                    {rings.map((r, i) => (
                        <span
                            key={i}
                            className={`absolute inset-0 rounded-full border border-[#15803d] animate-sonar-ring ring-anim-${i}`}
                        />
                    ))}
                    {/* Circle image */}
                    <div
                        className="relative w-[220px] h-[220px] rounded-full overflow-hidden border-[3px] border-[#15803d] shadow-xl bg-[#f0fdf4]"
                    >
                        {centerImage ? (
                            <Image 
                                src={centerImage.startsWith('http') || centerImage.startsWith('/') ? centerImage : `/api/storage/${centerImage}`} 
                                alt="Nature's Boon Products" 
                                fill 
                                sizes="(max-width: 768px) 100vw, 300px" 
                                className="object-cover" 
                            />
                        ) : (
                            /* Placeholder visual when no image is set */
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                <div className="text-4xl">🌿</div>
                                <div className="text-[10px] font-bold text-[#15803d] tracking-widest uppercase text-center px-4">
                                    Premium<br />Personal Care
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT stat card (3 o'clock) */}
                <div className="absolute left-1/2 top-1/2 [transform:translate(calc(-50%+180px),-50%)]">
                    <div className="bg-[#15803d] rounded-2xl shadow-md px-5 py-4 min-w-[130px] text-center">
                        <div className="text-2xl font-black text-white">{stat1Value}</div>
                        <div className="text-xs text-green-200 mt-0.5 font-medium">{stat1Label}</div>
                    </div>
                </div>
            </div>

            {/* ── CTA BUTTONS ── */}
            <div className="relative z-10 flex items-center justify-center gap-4 mt-2 mb-8">
                <Link href={primaryButtonHref}>
                    <button className="px-7 py-3 rounded-2xl bg-[#15803d] text-white font-bold text-sm shadow-lg hover:bg-[#166534] transition-colors hover:-translate-y-0.5 transform duration-200">
                        {primaryButtonText}
                    </button>
                </Link>
                <Link href={secondaryButtonHref}>
                    <button className="px-7 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-sm hover:border-[#15803d] hover:text-[#15803d] transition-colors">
                        {secondaryButtonText}
                    </button>
                </Link>
            </div>

            {/* ── JOURNEY ANIMATION STRIP ── */}
            {showJourney && (
                <div className="relative z-10 mx-auto mb-10 px-6 max-w-[560px]">
                    <div className="bg-[#f0fdf4] border border-green-100 rounded-2xl px-6 py-4">
                        <p className="text-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">
                            From Concept to Consumer
                        </p>
                        <div className="flex items-center">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-green-100">
                                    <FactoryIcon />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">{journeyStep1Label}</span>
                            </div>

                            <AnimatedDash />

                            {/* Step 2 */}
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-green-100">
                                    <BrandIcon />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">{journeyStep2Label}</span>
                            </div>

                            <AnimatedDash />

                            {/* Step 3 */}
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-green-100">
                                    <DeliveryIcon />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">{journeyStep3Label}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Inline keyframes for sonar rings ── */}
            <style>{`
        @keyframes sonar-ring {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .animate-sonar-ring {
          animation: sonar-ring 3s ease-out infinite;
        }
        .ring-anim-0 { animation-delay: 0s; opacity: 0.18; }
        .ring-anim-1 { animation-delay: 0.8s; opacity: 0.10; }
        .ring-anim-2 { animation-delay: 1.6s; opacity: 0.055; }
      `}</style>
        </section>
    );
}
