"use client";

import React from "react";
import { motion } from "framer-motion";

export type BackgroundVariant = 'white' | 'slate-50' | 'slate-900' | 'nb-green' | 'glass-white' | 'glass-dark' | 'default' | 'muted' | 'primary';

interface SectionProps {
    children: React.ReactNode;
    variant?: BackgroundVariant;
    paddingTop?: string;
    paddingBottom?: string;
    backgroundColor?: string;
    isGlass?: boolean;
    blur?: string;
    id?: string;
    className?: string;
    noContainer?: boolean;
    animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'none';
    shadowIntensity?: string;
    borderWidth?: string;
    borderColor?: string;
    borderRadius?: string;
    marginTop?: string;
    marginBottom?: string;
}

const getBgStyles = (variant: BackgroundVariant) => {
    switch (variant) {
        case 'slate-50':
        case 'muted': return 'bg-slate-50 text-slate-900';
        case 'slate-900': return 'bg-slate-900 text-white';
        case 'nb-green':
        case 'primary': return 'bg-nb-green text-slate-900';
        case 'glass-white': return 'bg-white/70 backdrop-blur-xl border-y border-white/20';
        case 'glass-dark': return 'bg-slate-900/80 backdrop-blur-xl border-y border-white/5';
        case 'white':
        case 'default':
        default: return 'bg-white text-slate-900';
    }
};

const getPaddingValue = (val: string) => {
    const map: Record<string, string> = {
        "32": "py-16 md:py-32",
        "24": "py-12 md:py-24",
        "16": "py-8 md:py-16",
        "12": "py-6 md:py-12",
        "8": "py-4 md:py-8",
        "4": "py-2 md:py-4",
        "0": "py-0"
    };
    return map[val] || "py-12 md:py-24";
};

export const Section = ({
    children,
    variant = 'white',
    paddingTop = "24",
    paddingBottom = "24",
    backgroundColor,
    isGlass = false,
    blur = "0",
    id,
    className = "",
    noContainer = false,
    animation = "none",
    shadowIntensity = "none",
    borderWidth = "0",
    borderColor = "border-slate-200",
    borderRadius = "",
    marginTop = "0",
    marginBottom = "0"
}: SectionProps) => {
    const pt = getPaddingValue(paddingTop);
    const pb = getPaddingValue(paddingBottom);



    const glassClasses = isGlass
        ? `${blur !== "0" ? `backdrop-${blur}` : 'backdrop-blur-md'} border-white/20 border-y`
        : "";

    const animationVariants = {
        "fade-up": { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } },
        "fade-in": { initial: { opacity: 0 }, whileInView: { opacity: 1 } },
        "slide-left": { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 } },
        "slide-right": { initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 } },
        "none": { initial: {}, whileInView: {} }
    };

    const anim = animationVariants[animation as keyof typeof animationVariants] || animationVariants.none;

    const getMargin = (val: string, type: 't' | 'b') => {
        const map: Record<string, string> = {
            "32": `m${type}-32`,
            "16": `m${type}-16`,
            "8": `m${type}-8`,
            "4": `m${type}-4`,
            "0": ""
        };
        return map[val] || "";
    };

    const mt = getMargin(marginTop, 't');
    const mb = getMargin(marginBottom, 'b');
    const shadowClass = shadowIntensity !== "none" ? shadowIntensity : "";
    const borderClass = borderWidth !== "0" ? `border-${borderWidth} ${borderColor}` : "";

    return (
        <section
            id={id}
            className={`relative overflow-hidden ${backgroundColor ? "bg-dynamic" : getBgStyles(variant)} ${pt} ${pb} ${mt} ${mb} ${shadowClass} ${borderClass} ${borderRadius} ${glassClasses} ${className}`}
            // eslint-disable-next-line react/forbid-component-props
            style={backgroundColor ? { '--dynamic-bg': backgroundColor } as React.CSSProperties : undefined}
        >
            {noContainer ? (
                <motion.div
                    initial={anim.initial}
                    whileInView={anim.whileInView}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            ) : (
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={anim.initial}
                        whileInView={anim.whileInView}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </section>
    );
};
