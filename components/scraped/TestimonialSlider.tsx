'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export interface TestimonialItem {
    author: string;
    company: string;
    content: string;
    rating: number;
}

export interface TestimonialSliderProps {
    badgeText?: string;
    heading?: string;
    description?: string;
    testimonials?: TestimonialItem[];
}

export default function TestimonialSlider({
    badgeText = "Testimonials",
    heading = "Trusted by Brands Worldwide",
    description = "Discover why over 20+ global entities choose Nature's Boon for their manufacturing needs.",
    testimonials = [
        { author: 'Mehar', company: 'VitalFlow Client', content: 'Highly professional and excellent service with very hygienic environment by Nature\'s Boon.', rating: 5 },
        { author: 'Harsimran Kaur', company: 'Global Beauty Inc.', content: 'They provide the best products and services and even this is a very good platform.', rating: 5 },
        { author: 'Harjot Singh', company: 'Luster Cosmetics', content: 'One of the things I loved about this company is that they provided comprehensive services.', rating: 5 },
    ]
}: TestimonialSliderProps) {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((c) => (c + 1) % (testimonials?.length || 1));
    const prev = () => setCurrent((c) => (c - 1 + (testimonials?.length || 1)) % (testimonials?.length || 1));

    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="py-16 sm:py-32 bg-white relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#16a34a]/5 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="lg:w-1/3 text-center lg:text-left">
                        <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#16a34a]/5 text-[#16a34a] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] leading-none mb-4 sm:mb-6">
                            {badgeText}
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 sm:mb-8">
                            {heading}
                        </h2>
                        <p className="text-base sm:text-lg text-slate-500 font-medium mb-8 sm:mb-12 opacity-80 max-w-lg mx-auto lg:mx-0">
                            {description}
                        </p>
                        <div className="flex justify-center lg:justify-start gap-3 sm:gap-4">
                            <button
                                onClick={prev}
                                aria-label="Previous testimonial"
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-slate-900/5 hover:border-[#16a34a] hover:text-[#16a34a] flex items-center justify-center transition-all group"
                            >
                                <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={next}
                                aria-label="Next testimonial"
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-slate-900/5 hover:border-[#16a34a] hover:text-[#16a34a] flex items-center justify-center transition-all group"
                            >
                                <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="lg:w-2/3 w-full">
                        <div className="relative bg-white/40 backdrop-blur-md rounded-[32px] sm:rounded-[48px] p-8 sm:p-12 md:p-16 border border-white/60 shadow-2xl shadow-[#16a34a]/5 overflow-hidden min-h-[300px] sm:min-h-[400px] flex flex-col justify-center">
                            <Quote className="absolute top-6 sm:top-12 right-6 sm:right-12 w-16 sm:w-24 h-16 sm:h-24 text-[#16a34a]/5 -rotate-12" />

                            <div className="relative animate-fade-in-up" key={current}>
                                <div className="flex gap-1 mb-6 sm:mb-8">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-[#16a34a] text-[#16a34a]" />
                                    ))}
                                </div>

                                <p className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-8 sm:mb-10 italic">
                                    &ldquo;{testimonials[current].content}&rdquo;
                                </p>

                                <div className="flex items-center gap-4 sm:gap-5">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#2bee6c] flex items-center justify-center text-white text-lg sm:text-2xl font-black shadow-lg shadow-[#16a34a]/20">
                                        {testimonials[current].author[0]}
                                    </div>
                                    <div>
                                        <div className="text-base sm:text-xl font-black text-slate-900 leading-none">{testimonials[current].author}</div>
                                        <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1.5 sm:mt-2 opacity-70">{testimonials[current].company}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination dots */}
                        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${current === i ? 'w-8 sm:w-10 bg-[#16a34a]' : 'w-1.5 sm:w-2 bg-slate-900/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

