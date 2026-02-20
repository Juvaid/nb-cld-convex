'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface LogoMarqueeProps {
    title?: string;
    logos?: { url: string; alt: string }[];
    speed?: number;
    direction?: 'left' | 'right';
}

export default function LogoMarquee({
    title = "Trusted by Industry Leaders",
    logos = [
        { url: "", alt: "Logo 1" },
        { url: "", alt: "Logo 2" },
        { url: "", alt: "Logo 3" },
        { url: "", alt: "Logo 4" },
        { url: "", alt: "Logo 5" },
    ],
    speed = 30,
    direction = 'left'
}: LogoMarqueeProps) {
    // Responsive speed: faster on mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const effectiveSpeed = isMobile ? speed * 0.25 : speed;

    // Quadruple logos for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

    return (
        <section className="py-6 sm:py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 sm:mb-10 text-center">
                {title && (
                    <h3 className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {title}
                    </h3>
                )}
            </div>

            {/* Marquee container with CSS mask for center-focus effect */}
            <div
                className="relative [mask-image:var(--marquee-mask)] [webkit-mask-image:var(--marquee-mask)]"
                style={{
                    "--marquee-mask": isMobile
                        ? 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
                        : 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
                } as React.CSSProperties}
            >
                <motion.div
                    className="flex gap-8 sm:gap-20 items-center whitespace-nowrap"
                    animate={{
                        x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: effectiveSpeed,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedLogos.map((logo, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
                        >
                            {logo.url ? (
                                <img
                                    src={logo.url}
                                    alt={logo.alt}
                                    className="h-9 sm:h-12 w-auto object-contain"
                                />
                            ) : (
                                <div className="h-9 sm:h-12 w-24 sm:w-28 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter border border-slate-100">
                                    {logo.alt}
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
