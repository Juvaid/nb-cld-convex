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
        <section className="relative pt-24 pb-16 bg-slate-900 overflow-hidden">
            <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-nb-green/20 to-nb-green-deep/20 rounded-full blur-3xl animate-float" />
            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
                <span className="text-nb-green font-semibold text-sm tracking-widest uppercase">{badgeText}</span>
                <h1 className="text-4xl md:text-5xl font-black text-white mt-2 mb-4 tracking-tight">{title}</h1>
                <div className="text-white/70 max-w-2xl text-lg font-medium">
                    {description}
                </div>
            </div>
        </section>
    );
}
