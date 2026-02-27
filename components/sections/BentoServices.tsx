"use client";
import React from "react";

export interface BentoServiceCard {
    icon: string;
    title: string;
    description: string;
    accent?: boolean;
}

export interface BentoServicesProps {
    sectionId?: string;
    eyebrow?: string;
    headline?: string;
    subtext?: string;
    cards?: BentoServiceCard[];
}

const SERVICE_ICONS: Record<string, React.ReactElement> = {
    flask: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-6 0v6l-4 9a1 1 0 001 1h12a1 1 0 001-1l-4-9V3" />
        </svg>
    ),
    shield: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    leaf: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 007.107 9.879c-.143.398-.298.79-.465 1.175A8.999 8.999 0 012.628 7.544C3.773 5.112 5.688 3.15 12 3z" />
        </svg>
    ),
    globe: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c-3.314 0-6-4.03-6-9s2.686-9 6-9m0 18c3.314 0 6-4.03 6-9s-2.686-9-6-9M3 12h18" />
        </svg>
    ),
    package: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    ),
    chart: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
    ),
};

const DEFAULT_CARDS: BentoServiceCard[] = [
    { icon: "flask", title: "Custom Formulation", description: "Work with our R&D team to create exclusive formulas tailored to your brand's vision and target market.", accent: false },
    { icon: "shield", title: "Quality Assurance", description: "ISO 9001, GMP, and COSMOS certified. Every batch rigorously tested before leaving our facility.", accent: true },
    { icon: "leaf", title: "Botanical Sourcing", description: "Premium plant extracts from certified organic farms. Traceability at every step of the supply chain.", accent: false },
    { icon: "package", title: "Private Labelling", description: "Full-service white-label and private label from filling to finished, shelf-ready product.", accent: false },
    { icon: "globe", title: "Global Logistics", description: "Reliable delivery to 50+ countries with complete customs documentation and regulatory support.", accent: false },
    { icon: "chart", title: "Scale on Demand", description: "From 500-unit test batches to 750-ton monthly runs — scale production as your brand grows.", accent: false },
];

export default function BentoServices({
    sectionId,
    eyebrow = "Our Capabilities",
    headline = "Manufacturing Excellence\nat Every Scale",
    subtext = "From first formula to final shelf, we cover every aspect of personal care manufacturing.",
    cards = DEFAULT_CARDS,
}: BentoServicesProps) {
    return (
        <section id={sectionId} className="w-full bg-[#f6f8f7] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#157f3c]/20 shadow-sm mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-[#157f3c] animate-pulse" />
                            <span className="text-[#157f3c] font-bold text-xs uppercase tracking-wider">{eyebrow}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight whitespace-pre-line">{headline}</h2>
                    </div>
                    <p className="text-slate-500 text-lg max-w-xs md:max-w-sm">{subtext}</p>
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className={`rounded-3xl p-8 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${card.accent
                                ? "bg-[#157f3c] text-white border-transparent"
                                : "bg-white text-slate-900 border-slate-100 hover:border-[#157f3c]/20"
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${card.accent ? "bg-white/20" : "bg-[#f0fdf4]"}`}>
                                <span className={card.accent ? "text-white" : "text-[#157f3c]"}>
                                    {SERVICE_ICONS[card.icon] ?? SERVICE_ICONS.flask}
                                </span>
                            </div>
                            <h3 className="font-bold text-xl mb-3">{card.title}</h3>
                            <p className={`text-sm leading-relaxed ${card.accent ? "text-white/75" : "text-slate-500"}`}>
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
