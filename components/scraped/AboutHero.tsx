import React from 'react';

export interface AboutHeroProps {
    badgeText?: string;
    title?: string;
    description?: string;
}

export default function AboutHero({
    badgeText = "Our Story",
    title = "About Nature's Boon",
    description = "A legacy of excellence in personal care manufacturing since 2006."
}: AboutHeroProps) {
    return (
        <section className="relative pt-40 pb-20 bg-slate-900 overflow-hidden">
            <div className="absolute top-20 right-20 w-72 h-72 bg-[#16a34a]/10 rounded-full blur-3xl" />
            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
                <span className="text-[#16a34a] font-semibold text-sm tracking-widest uppercase">{badgeText}</span>
                <h1 className="text-4xl md:text-5xl font-black text-white mt-2 mb-4 tracking-tight">{title}</h1>
                <p className="text-white/70 max-w-2xl text-lg font-medium">
                    {description}
                </p>
            </div>
        </section>
    );
}
