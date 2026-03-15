'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Typography } from '@/components/ui/Typography';

export interface StatItem {
    value: string;
    label: string;
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
}
export interface StatsCounterProps {
    id?: string;
    heading?: string;
    stats?: StatItem[];
    "data-block"?: string;
}

function AnimatedCounter({ target, label, stat, index }: { target: string, label: string, stat: StatItem, index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-5%" });

    const numericTarget = parseInt(target.replace(/[^0-9]/g, '')) || 0;
    const suffix = target.replace(/[0-9]/g, '');

    // FIX: start display at numericTarget, not 0 — SSR always shows real number
    const [displayValue, setDisplayValue] = useState(numericTarget);

    const springConfig = { damping: 60, stiffness: 100, mass: 1 };
    const countProgress = useSpring(0, springConfig);
    
    useEffect(() => {
        return countProgress.on("change", (v) => setDisplayValue(Math.floor(v)));
    }, [countProgress]);

    useEffect(() => {
        if (isInView) {
            countProgress.set(numericTarget);
        }
    }, [isInView, numericTarget, countProgress]);

    // Unique blob shapes based on index
    const blobShapes = [
        "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
        "rounded-[30%_60%_70%_40%/50%_60%_30%_60%]",
        "rounded-[50%_50%_33%_67%/55%_59%_41%_45%]",
        "rounded-[30%_60%_70%_40%/50%_60%_30%_60%]",
        "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
        "rounded-[45%_55%_74%_26%/47%_43%_57%_53%]"
    ];
    const blobClass = blobShapes[index % blobShapes.length];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
            className={`text-center p-8 sm:p-10 ${blobClass} bg-nb-green/5 border border-nb-green/10 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(21,128,61,0.1)] transition-all duration-500 h-full flex flex-col items-center justify-center relative overflow-hidden group aspect-square`}
        >
            {stat.showMedia !== false && (
                <div className="w-12 h-12 flex items-center justify-center mb-1 overflow-hidden text-nb-green transition-transform duration-500 group-hover:scale-110">
                    {stat.mediaType === "image" && stat.mediaImage ? (
                        <img
                            src={stat.mediaImage.startsWith('http') ? stat.mediaImage : `/api/storage/${stat.mediaImage}`}
                            className="w-full h-full object-cover"
                            alt={label}
                        />
                    ) : (
                        <div className="text-2xl">
                            {stat.mediaIcon || "📊"}
                        </div>
                    )}
                </div>
            )}

            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-nb-green mb-1 whitespace-nowrap leading-none flex items-baseline">
                <span className="pr-1">{displayValue}</span>
                <span className="text-2xl sm:text-3xl md:text-4xl opacity-80">{suffix}</span>
            </div>

            <div className="text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] leading-tight max-w-[120px] mx-auto">
                {label}
            </div>
        </motion.div>
    );
}


export default function StatsCounter({
    heading = "Nature's Boon milestones and metric",
    stats = [
        { value: '20+', label: 'Years of Experience' },
        { value: '65+', label: 'Strong Family' },
        { value: '200+', label: 'SKUs Produced Annually' },
        { value: '75+', label: 'Products by In-house R&D' },
        { value: '20+', label: 'Happy Clients' },
        { value: '750+', label: 'Tons Annual Capacity' },
    ],
    id,
    dataBlock,
    "data-block": dataBlockKebab,
    ...pProps
}: StatsCounterProps & Record<string, any>) {
    const sectionId = id || (pProps as any).id;
    const finalDataBlock = dataBlock || dataBlockKebab;
    return (
        <section 
            id={sectionId} 
            data-block={finalDataBlock}
            aria-label="Company statistics"
            className="py-20 bg-white relative overflow-hidden"
        >
            {/* Subtle Gradient Backglow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-nb-green/5 rounded-full blur-[160px] pointer-events-none opacity-50" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                {heading && (
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <Typography variant="section-title" align="center" color="slate-900">
                            {heading}
                        </Typography>
                        <div className="w-20 h-1.5 bg-nb-green mx-auto mt-6 rounded-full opacity-20" />
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
                    {(stats || []).map((stat, i) => (
                        <AnimatedCounter key={stat.label || i} target={stat.value} label={stat.label} stat={stat} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
