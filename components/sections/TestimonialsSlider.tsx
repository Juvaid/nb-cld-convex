"use client";
import React, { useState } from "react";

export interface Testimonial {
    name: string;
    role: string;
    company: string;
    quote: string;
    avatar?: string;
    rating?: number;
}

export interface TestimonialsSliderProps {
    sectionId?: string;
    badgeText?: string;
    headline?: string;
    subtext?: string;
    testimonials?: Testimonial[];
    backgroundColor?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        name: "Sarah Jenkins",
        role: "CEO",
        company: "Aura Beauty",
        quote:
            "Nature's Boon transformed our product line. Their botanical formulations are second to none — our customers noticed the difference immediately. Truly world-class manufacturing quality.",
        rating: 5,
    },
    {
        name: "Michael Chen",
        role: "Founder",
        company: "GreenEarth",
        quote:
            "From first sample to final shelf product in under 3 months. The team's responsiveness and commitment to sustainable practices made Nature's Boon the obvious choice for our brand.",
        rating: 5,
    },
    {
        name: "Elena Rodriguez",
        role: "Director",
        company: "PureLife",
        quote:
            "With over 1,500 formulations to choose from, we found exactly what we needed. The white-label programme is seamless and the quality certifications gave us complete confidence.",
        rating: 5,
    },
];

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <div className="flex gap-0.5 mb-4">
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[#157f3c]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function TestimonialsSlider({
    sectionId,
    badgeText = "20+ Global Partners",
    headline = "Trusted by Leading Brands",
    subtext = "Hear from the brands that chose Nature's Boon for their manufacturing needs.",
    testimonials = DEFAULT_TESTIMONIALS,
    backgroundColor = "#f0fdf4",
}: TestimonialsSliderProps) {
    const [active, setActive] = useState(0);

    const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
    const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

    const t = testimonials[active];

    return (
        <section id={sectionId} className="w-full py-20 px-4" style={{ backgroundColor }}>
            <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#157f3c]/20 shadow-sm mb-6">
                    <span className="flex h-2 w-2 rounded-full bg-[#157f3c] animate-pulse" />
                    <span className="text-[#157f3c] font-bold text-xs uppercase tracking-wider">{badgeText}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{headline}</h2>
                <p className="text-slate-500 mb-14 max-w-xl mx-auto">{subtext}</p>

                {/* Card */}
                <div className="relative bg-white rounded-3xl shadow-xl p-10 md:p-14 text-left transition-all duration-300">
                    {/* Quote mark */}
                    <span className="absolute top-8 left-10 text-7xl font-serif text-[#157f3c]/10 leading-none select-none">"</span>

                    <StarRating count={t.rating ?? 5} />

                    <p className="text-slate-700 text-lg md:text-xl leading-relaxed mb-8 relative z-10">
                        "{t.quote}"
                    </p>

                    <div className="flex items-center gap-4">
                        {/* Avatar placeholder */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#157f3c] to-[#0d4f25] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {t.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{t.name}</p>
                            <p className="text-sm text-slate-500">{t.role}, {t.company}</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={prev}
                        className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#157f3c] hover:text-[#157f3c] flex items-center justify-center transition-colors"
                        aria-label="Previous"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`h-2 rounded-full transition-all duration-200 ${i === active ? "w-6 bg-[#157f3c]" : "w-2 bg-slate-300"}`}
                                aria-label={`Go to testimonial ${i + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#157f3c] hover:text-[#157f3c] flex items-center justify-center transition-colors"
                        aria-label="Next"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
