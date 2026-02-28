"use client";

import React, { useId } from "react";
import Link from "next/link";

/* ─── TYPES ─── */
export type OverlayStyle =
    | "emerald-gradient"
    | "green-solid"
    | "sage-solid"
    | "white-light";

export interface ProductGridCard {
    title: string;
    formulaCount: string;
    image: string;
    href: string;
    overlayStyle: OverlayStyle;
    buttonLabel: string;
}

export interface ProductGridHeroProps {
    badgeText?: string;
    headline?: string;
    subtext?: string;
    sectionId?: string;
    horizontalPadding?: string;
    cards?: ProductGridCard[];
}

/* ─── OVERLAY CLASSES (per card style) ─── */
const overlayClasses: Record<OverlayStyle, string> = {
    "emerald-gradient":
        "bg-gradient-to-t from-emerald-900/90 via-emerald-800/40 to-transparent group-hover:opacity-90 transition-opacity duration-300",
    "green-solid":
        "bg-[#157f3c]/80 mix-blend-multiply group-hover:bg-[#157f3c]/70 transition-colors duration-300",
    "sage-solid":
        "bg-[#658671]/70 mix-blend-multiply group-hover:bg-[#658671]/60 transition-colors duration-300",
    "white-light":
        "bg-white/70 backdrop-blur-[2px] group-hover:bg-white/60 transition-colors duration-300",
};

/* ─── LABEL COLOR (per card style) ─── */
const labelClasses: Record<OverlayStyle, string> = {
    "emerald-gradient": "text-emerald-200",
    "green-solid": "text-emerald-100",
    "sage-solid": "text-emerald-50",
    "white-light": "text-slate-600",
};

/* ─── TITLE COLOR ─── */
const titleClasses: Record<OverlayStyle, string> = {
    "emerald-gradient": "text-white",
    "green-solid": "text-white",
    "sage-solid": "text-white",
    "white-light": "text-slate-900",
};

/* ─── BUTTON VARIANT ─── */
const buttonClasses: Record<OverlayStyle, string> = {
    "emerald-gradient":
        "bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white hover:text-[#157f3c] text-white",
    "green-solid":
        "bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white hover:text-[#157f3c] text-white",
    "sage-solid":
        "bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white hover:text-[#157f3c] text-white",
    "white-light":
        "bg-slate-900/10 backdrop-blur-md border border-slate-900/20 hover:bg-slate-900 hover:text-white text-slate-900",
};

/* ─── DEFAULT CARDS ─── */
const DEFAULT_CARDS: ProductGridCard[] = [
    {
        title: "Skin Care",
        formulaCount: "420+ Formulas",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAlrqKkOmY72Ayvh-I_Y6BngOFZk2kOPyS1vD-3KhaxvJZubQ9bOxIBxnj8YKtc_X-lAJ_S6rS4NG7onBfmicvFFQrg3c0jWFPxgrBSFBOdmM23cZEOvdgAq8FtQt6KRmSCt9LuY4fK1pOJXwVNtW5ICNDdP4Dvu32wopuq7w8qOmHnW22BNs2FOs3SBh4mnfjPQfOQm7rakxssJzL5O9HVDpmgZqDvKGL1SumnPgOZViajlxZkQyhiDGHMy_ZO_0-WYHbdl7s8zJ4",
        href: "/products/skin-care",
        overlayStyle: "emerald-gradient",
        buttonLabel: "Explore Category",
    },
    {
        title: "Hair Care",
        formulaCount: "380+ Formulas",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCS9tXjRVDQ4gDt7UEt27b2_oF9DWfx206m4K7WK3yLseEfyIwSQMwZKEYcT5q7eygjY_NEoT81GMekx6XfLLYe7KAbc9ZvBtpYHyBpaAiD-D2FIK5y-uhaYiH3tigozO6GHmnFjtsX8r10p7pf287E_RHJZiv9TKLf2jJeVJUQM0IUbzxkLe5Ua74oLd8DKDi93Pz8GeeOGnOTjmVwqpjIU1HkEwp4KNhYACkgFgYs0DyJXn_hfuepCaUDUG3XYxZUeVaEVhWS6cY",
        href: "/products/hair-care",
        overlayStyle: "green-solid",
        buttonLabel: "Explore Category",
    },
    {
        title: "Body Care",
        formulaCount: "290+ Formulas",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDFkjDWKoPCZePBIXN3hVnK1TPszWUniu27qYpLdagTWFDE7ZIGKBManozPaCgYnl3nOIcSw7vlOzn88PtjE2PFyUNPNyZrTIKA8QLDm-8P_-exG5lajBrLZ4U9SMPQ1p5tDKabiBYO5g2nLEAnf1Rp-jbY5xengR3iqR_sefj9EzVPmTGFctKyHBOSgR06noxAL_8BH9NJG4TNV_ODjdPqLrGpr99mUKNLewpjD0wu_w1IoINqg-BFsKBQ45mcBkm-H1ygEcXtZCU",
        href: "/products/body-care",
        overlayStyle: "sage-solid",
        buttonLabel: "Explore Category",
    },
    {
        title: "Sun Care",
        formulaCount: "110+ Formulas",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC3HfCD3lfRmFMsL3QSo1i5foyZ5GZSvblUY3VbbIXsKHYCrfHdajA8cB7MhZWrEFtbCCl7_vj_kQ9VMeWTXzqipHoi-X-88g3dFdYCTLCRzoC-V15M2W9gnbC_QiYmDebK2RkZBHOM370TWGduayc6lnOasC-fCW_KjyM384mkeKJSFff4YH5plj9wBC7660lq32loKRlcUIku_UvxresNQGDmkxKmsGLVu_zFDpVxzQ9xJUFazCzCJibC-dPHkIxYKUisKD1BBN0",
        href: "/products/sun-care",
        overlayStyle: "white-light",
        buttonLabel: "Explore Category",
    },
];

/* ─── COMPONENT ─── */
export default function ProductGridHero({
    badgeText = "1500+ Formulations Available",
    headline = "What will you create?",
    subtext = "Partner with the leading B2B manufacturer for premium personal care products. From concept to shelf, we bring your vision to life.",
    sectionId,
    horizontalPadding = "0px",
    cards = DEFAULT_CARDS,
}: ProductGridHeroProps) {
    const blockId = useId();
    const cleanId = blockId.replace(/:/g, "");

    return (
        <section id={sectionId || `product-grid-${cleanId}`} className="flex flex-col w-full">
            {/* Scoped Dynamic Styles */}
            <style>{`
                #${sectionId || `product-grid-${cleanId}`} .grid-padding {
                    padding-left: ${horizontalPadding};
                    padding-right: ${horizontalPadding};
                }
                ${(cards ?? [])
                    .map((card, i) => `#${sectionId || `product-grid-${cleanId}`} .bg-card-${i} { background-image: url('${card.image}'); }`)
                    .join("\n")}
            `}</style>
            {/* ── HERO TEXT (30vh) ── */}
            <div className="flex flex-col items-center justify-center py-14 px-4 bg-[#f6f8f7] min-h-[30vh] text-center">
                <div className="flex flex-col items-center max-w-3xl space-y-5">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-[#157f3c] animate-pulse" />
                        <span className="text-[#157f3c] font-bold text-xs uppercase tracking-wide">
                            {badgeText}
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                        {headline}
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg md:text-xl text-slate-600 max-w-xl font-light leading-relaxed">
                        {subtext}
                    </p>
                </div>
            </div>

            {/* ── PRODUCT GRID (70vh) ── */}
            <div className="w-full grid-padding">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full min-h-[70vh]">
                    {(cards ?? []).map((card, i) => (
                        <a
                            key={i}
                            href={card.href || "#"}
                            className="group relative overflow-hidden bg-slate-100 cursor-pointer block min-h-[50vh]"
                        >
                            {/* Background image with zoom on hover */}
                            <div className={`absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 bg-card-${i}`} />

                            {/* Colour overlay */}
                            <div className={`absolute inset-0 z-[1] ${overlayClasses[card.overlayStyle]}`} />

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10 min-h-[50vh]">
                                <span className={`text-sm font-medium mb-1 tracking-wider uppercase ${labelClasses[card.overlayStyle]}`}>
                                    {card.formulaCount}
                                </span>
                                <h3 className={`text-3xl font-bold mb-5 ${titleClasses[card.overlayStyle]}`}>
                                    {card.title}
                                </h3>

                                {/* Hover reveal button */}
                                <div className="h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100 transition-all duration-300 ease-out translate-y-4 group-hover:translate-y-0">
                                    <button
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-bold group-hover:shadow-lg ${buttonClasses[card.overlayStyle]}`}
                                    >
                                        <span>{card.buttonLabel}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
