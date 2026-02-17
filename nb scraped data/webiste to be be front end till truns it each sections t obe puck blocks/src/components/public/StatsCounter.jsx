'use client';

import { useEffect, useState, useRef } from 'react';
import { defaultStats } from '@/lib/theme';

function AnimatedCounter({ target, label }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
    const suffix = target.replace(/[0-9]/g, '');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const duration = 2000;
                    const step = numericTarget / (duration / 16);
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= numericTarget) {
                            setCount(numericTarget);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [numericTarget]);

    return (
        <div ref={ref} className="text-center p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] glass hover:bg-white transition-all duration-500 border-white/50">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black gradient-text mb-1 sm:mb-2 tracking-tighter">
                {count}{suffix}
            </div>
            <div className="text-[8px] sm:text-[10px] font-black text-muted uppercase tracking-[0.1em] opacity-80">{label}</div>
        </div>
    );
}

export default function StatsCounter() {
    return (
        <section className="py-16 sm:section-padding bg-surface-muted relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {defaultStats.map((stat) => (
                        <AnimatedCounter key={stat.label} target={stat.value} label={stat.label} />
                    ))}
                </div>
            </div>
        </section>
    );
}
