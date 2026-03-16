'use client';

import { useState, useEffect } from 'react';

export interface LogoMarqueeProps {
    title?: string;
    logos?: { url: string; alt: string }[];
    speed?: number; // seconds for one full cycle (higher = slower)
    direction?: 'left' | 'right';
    pauseOnHover?: boolean;
    size?: 'sm' | 'md' | 'lg';
    colorMode?: 'grayscale' | 'color' | 'grayscale-to-color';
    gap?: number;
    paddingTop?: number;
    paddingBottom?: number;
    id?: string;
    "data-block"?: string;
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
    size = 'md',
    colorMode = 'grayscale-to-color',
    gap = 5,
    paddingTop = 6,
    paddingBottom = 6,
    id,
    dataBlock,
    "data-block": dataBlockKebab,
    ...props
}: LogoMarqueeProps & Record<string, any>) {
    if (!logos || logos.length === 0) return null;

    const sectionId = id || props.id;
    const finalDataBlock = dataBlock || dataBlockKebab;

    // Duplicate exactly once → animate -50% = one full set width
    const allLogos = [...logos, ...logos];
    const animName = `marquee-${direction}`;

    return (
        <section 
            id={sectionId}
            data-block={finalDataBlock}
            aria-label="Client logos"
            className="bg-white overflow-hidden"
        >
            {/* Keyframe injection — purely CSS, no JS dependence */}
            <style suppressHydrationWarning>{`
                @keyframes marquee-left  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
                .nb-marquee-track {
                    display: flex;
                    gap: ${gap}rem;
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
            <div
                className="nb-marquee-wrap"
                style={
                    {
                        "--pt": `${paddingTop}rem`,
                        "--pb": `${paddingBottom}rem`,
                        paddingTop: "var(--pt)",
                        paddingBottom: "var(--pb)"
                    } as React.CSSProperties
                }
            >
                {title && (
                    <p className="text-center text-xs sm:text-sm font-bold text-nb-green uppercase tracking-[0.2em] pb-8">
                        {title}
                    </p>
                )}
                <div className={`nb-marquee-track pb-2${pauseOnHover ? ' pause-on-hover' : ''}`}>
                    {allLogos.map((logo, i) => {
                        const sizeClasses = {
                            sm: "h-8 sm:h-12 w-auto",
                            md: "h-11 sm:h-16 w-auto",
                            lg: "h-14 sm:h-20 w-auto"
                        }[size];

                        const colorClass = colorMode === 'grayscale' ? 'grayscale' :
                            colorMode === 'grayscale-to-color' ? 'grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110' :
                                '';

                        return (
                            <div
                                key={i}
                                className={`flex-shrink-0 ${colorClass}`}
                            >
                                {logo.url ? (
                                    <img
                                        src={logo.url}
                                        alt={logo.alt}
                                        className={`${sizeClasses} object-contain select-none`}
                                        draggable={false}
                                    />
                                ) : (
                                    <div className={`${sizeClasses} min-w-[120px] bg-slate-50 rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter border border-slate-100 px-4`}>
                                        {logo.alt}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
