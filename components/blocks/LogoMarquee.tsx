'use client';

import { useState, useEffect } from 'react';

export interface LogoMarqueeProps {
    title?: string;
    logos?: { url: string; alt: string }[];
    speed?: number; // seconds for one full cycle (higher = slower)
    direction?: 'left' | 'right';
    pauseOnHover?: boolean;
}

export default function LogoMarquee({
    title = "Trusted by Industry Leaders",
    logos = [
        { url: "", alt: "Brand 1" },
        { url: "", alt: "Brand 2" },
        { url: "", alt: "Brand 3" },
        { url: "", alt: "Brand 4" },
        { url: "", alt: "Brand 5" },
    ],
    speed = 40,
    direction = 'left',
    pauseOnHover = true,
}: LogoMarqueeProps) {
    // Duplicate exactly once → animate -50% = one full set width
    const allLogos = [...logos, ...logos];
    const animName = `marquee-${direction}`;

    return (
        <section className="bg-white overflow-hidden">
            {/* Keyframe injection — purely CSS, no JS dependence */}
            <style>{`
                @keyframes marquee-left  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
                .nb-marquee-track {
                    display: flex;
                    gap: 5rem;
                    align-items: center;
                    width: max-content;
                    animation: ${animName} ${speed}s linear infinite;
                    will-change: transform;
                }
                .nb-marquee-track.pause-on-hover:hover { animation-play-state: paused; }
                .nb-marquee-wrap {
                    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
                    mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
                    overflow: hidden;
                }
            `}</style>

            <div className="nb-marquee-wrap">
                {title && (
                    <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em] pb-1">
                        {title}
                    </p>
                )}
                <div className={`nb-marquee-track pb-2${pauseOnHover ? ' pause-on-hover' : ''}`}>
                    {allLogos.map((logo, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
                        >
                            {logo.url ? (
                                <img
                                    src={logo.url}
                                    alt={logo.alt}
                                    className="h-11 sm:h-16 w-auto object-contain select-none"
                                    draggable={false}
                                />
                            ) : (
                                <div className="h-11 sm:h-16 w-28 sm:w-36 bg-slate-50 rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter border border-slate-100">
                                    {logo.alt}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
