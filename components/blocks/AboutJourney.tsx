'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Factory, Users, Award, Target, LucideIcon } from 'lucide-react';
import { motion, useSpring, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Typography } from '../ui/Typography';

export interface JourneyCard {
    icon: string;
    title: string;
    desc: string;
}

export interface AboutJourneyProps {
    id?: string;
    heading?: string;
    introduction?: string;
    paragraphs?: string[];
    cards?: JourneyCard[];
    useDesignSystem?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
    Factory,
    Users,
    Award,
    Target
};

export default function AboutJourney({
    id,
    heading = "Our Journey",
    introduction = "Established in the year 2006 at Ludhiana (Punjab, India), Nature's Boon is recognized as one of the most trusted Manufacturers and Suppliers of high quality personal care products.",
    paragraphs = [
        "In our journey of manufacturing, we have formulated & packaged for quality brands such as Luster Cosmetics, True Derma Essentials, Man Pride, Pukhraj Herbals, The Man Company, Glamveda, Skinnatura, Nuskhe By Paras, Studd Muffyn, Organic Essence, Taryansh Herbals, and many more.",
        "Our own products are marketed under the brand names \"Luster Cosmetics, True Derma Essentials, Man Pride\". These products are processed using best quality ingredients and sophisticated processing technology, formulated as per set industry norms and in compliance with international standards."
    ],
    cards = [
        { icon: 'Factory', title: 'Advanced Infrastructure', desc: 'State-of-the-art manufacturing, quality testing, warehousing, and packaging facilities.' },
        { icon: 'Users', title: 'Experienced Team', desc: 'Skilled professionals ensuring smooth operations at every stage of production.' },
        { icon: 'Award', title: 'Quality Commitment', desc: 'Experienced quality controllers monitor the complete process from procurement to dispatch.' },
        { icon: 'Target', title: 'Visionary Leadership', desc: 'Under the leadership of Founder & Mentor, Ms. Archana Dhingra, we continue to reach new heights.' },
    ],
    useDesignSystem = true
}: AboutJourneyProps) {
    const hasParagraphs = paragraphs && paragraphs.length > 0 && paragraphs.some(p => p.trim() !== "");
    const hasCards = cards && cards.length > 0;
    const hasHeading = heading && heading.trim() !== "";
    const hasIntro = introduction && introduction.trim() !== "";

    if (!hasHeading && !hasIntro && !hasParagraphs && !hasCards) return null;

    return (
        <section id={id} className={`py-12 sm:py-20 ${useDesignSystem ? 'bg-white' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        {useDesignSystem ? (
                            <>
                                {hasHeading && (
                                    <Typography variant="h2" className="text-slate-900 mb-6 tracking-tight">
                                        {heading}
                                    </Typography>
                                )}
                                <div className="space-y-4">
                                    {hasIntro && (
                                        <Typography variant="body" className="text-slate-500 leading-relaxed font-medium opacity-80">
                                            {introduction}
                                        </Typography>
                                    )}
                                    {hasParagraphs && (paragraphs || []).map((para, idx) => (
                                        <Typography key={idx} variant="body" className="text-slate-500 leading-relaxed font-medium opacity-80">
                                            {para}
                                        </Typography>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {hasHeading && <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{heading}</h2>}
                                <div className="space-y-4 text-slate-500 leading-relaxed font-medium text-lg opacity-80">
                                    {hasIntro && <p>{introduction}</p>}
                                    {hasParagraphs && (paragraphs || []).map((para, idx) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {hasCards && (
                        <div className="space-y-4">
                            {(cards || []).map((item) => {
                                const IconComp = iconMap[item.icon] || Factory;
                                return (
                                    <div key={item.title} className={`flex gap-4 p-5 rounded-[24px] bg-white border border-slate-100 hover:border-[#16a34a]/30 hover:shadow-lg transition-all ${useDesignSystem ? 'shadow-sm' : ''}`}>
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#2bee6c] flex items-center justify-center shrink-0 shadow-lg shadow-[#16a34a]/20 overflow-hidden">
                                            {iconMap[item.icon] ? (
                                                <IconComp className="w-8 h-8 text-white" />
                                            ) : (
                                                <img
                                                    src={item.icon?.startsWith('http') ? item.icon : `/api/storage/${item.icon}`}
                                                    className="w-full h-full object-cover"
                                                    alt={item.title}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            {useDesignSystem ? (
                                                <>
                                                    <Typography variant="body" weight="bold" className="text-slate-900 mb-1">
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="detail" className="text-slate-500 font-medium whitespace-pre-wrap">
                                                        {item.desc}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                                    <p className="text-slate-500 text-xs sm:text-sm font-medium">{item.desc}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
