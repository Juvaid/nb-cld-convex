'use client';

import { useEffect, useState, useRef } from 'react';

export interface StatItem {
    value: string;
    label: string;
}

export interface StatsCounterProps {
    stats?: StatItem[];
}

function AnimatedCounter({ target, label }: { target: string, label: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
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
        <div ref={ref} className="text-center p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-white/40 backdrop-blur-md hover:bg-white transition-all duration-500 border border-white/50">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#16a34a] to-[#2bee6c] mb-1 sm:mb-2 tracking-tighter">
                {count}{suffix}
            </div>
            <div className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] opacity-80">{label}</div>
        </div>
    );
}

export default function StatsCounter({
    stats = [
        { value: '15+', label: 'Years of Experience' },
        { value: '65+', label: 'Strong Family' },
        { value: '200+', label: 'SKUs Produced Annually' },
        { value: '75+', label: 'Products by In-house R&D' },
        { value: '20+', label: 'Happy Clients' },
        { value: '750+', label: 'Tons Annual Capacity' },
    ]
}: StatsCounterProps) {
    return (
        <section className="py-16 sm:py-32 bg-slate-50 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#16a34a]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {(stats || []).map((stat, i) => (
                        <AnimatedCounter key={stat.label || i} target={stat.value} label={stat.label} />
                    ))}
                </div>
            </div>
        </section>
    );
}

