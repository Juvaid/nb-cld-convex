"use client";
import React from "react";

export interface JourneyStep {
    icon: "leaf" | "flask" | "factory" | "truck" | "star";
    title: string;
    description: string;
}

export interface JourneyHeroProps {
    sectionId?: string;
    eyebrow?: string;
    headline?: string;
    subtext?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    steps?: JourneyStep[];
}

const ICONS: Record<JourneyStep["icon"], React.ReactNode> = {
    leaf: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 007.107 9.879c-.143.398-.298.79-.465 1.175A8.999 8.999 0 012.628 7.544C3.773 5.112 5.688 3.15 12 3z" />
        </svg>
    ),
    flask: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-6 0v6l-4 9a1 1 0 001 1h12a1 1 0 001-1l-4-9V3M9 3h6" />
        </svg>
    ),
    factory: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v2.25m0 15.75V8.25m6 13.5V18M6.75 3H4.5A2.25 2.25 0 002.25 5.25v13.5" />
        </svg>
    ),
    truck: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193" />
        </svg>
    ),
    star: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
    ),
};

const DEFAULT_STEPS: JourneyStep[] = [
    { icon: "leaf", title: "Botanical Sourcing", description: "Premium plant extracts sourced from certified organic farms worldwide." },
    { icon: "flask", title: "R&D Formulation", description: "Our scientists blend traditional herbology with cutting-edge molecular science." },
    { icon: "factory", title: "GMP Manufacturing", description: "ISO 9001-certified facilities producing 750+ tons monthly across 4 plants." },
    { icon: "truck", title: "Global Delivery", description: "Reliable logistics to 50+ countries with full traceability at every step." },
];

export default function JourneyHero({
    sectionId,
    eyebrow = "The Nature's Boon Journey",
    headline = "From Seed to Shelf, Every Step Matters",
    subtext = "We obsess over every stage of the manufacturing process so your brand can shine.",
    primaryButtonText = "Explore Our Process",
    primaryButtonHref = "/services",
    steps = DEFAULT_STEPS,
}: JourneyHeroProps) {
    return (
        <section id={sectionId} className="w-full bg-white py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0fdf4] rounded-full border border-[#157f3c]/20 mb-5">
                        <span className="flex h-2 w-2 rounded-full bg-[#157f3c] animate-pulse" />
                        <span className="text-[#157f3c] font-bold text-xs uppercase tracking-wider">{eyebrow}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{headline}</h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">{subtext}</p>
                </div>

                {/* Step timeline */}
                <div className="relative">
                    {/* Connector line */}
                    <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#157f3c]/20 via-[#157f3c] to-[#157f3c]/20" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center relative">
                                {/* Icon circle */}
                                <div className="w-20 h-20 rounded-full bg-[#157f3c] flex items-center justify-center text-white mb-5 relative z-10 shadow-lg shadow-[#157f3c]/25">
                                    {ICONS[step.icon]}
                                </div>
                                {/* Step number */}
                                <span className="absolute top-0 right-[calc(50%-40px-12px)] w-6 h-6 bg-white border-2 border-[#157f3c] rounded-full text-[#157f3c] text-xs font-bold flex items-center justify-center z-20">
                                    {i + 1}
                                </span>
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-14">
                    <a
                        href={primaryButtonHref}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#157f3c] hover:bg-[#0d5a2a] text-white font-bold rounded-full transition-colors"
                    >
                        {primaryButtonText}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
