"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    backgroundImage?: string;
    backgroundSize?: 'cover' | 'contain' | 'auto';
    backgroundPosition?: string;
    backgroundRepeat?: string;
    overlayColor?: string;
    overlayOpacity?: string;
    containerWidth?: 'narrow' | 'normal' | 'wide' | 'full';
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
        "32": "py-8 md:py-16",
        "24": "py-6 md:py-12",
        "16": "py-4 md:py-8",
        "12": "py-3 md:py-6",
        "8": "py-2 md:py-4",
        "4": "py-1 md:py-2",
        "0": "py-0"
    };
    return map[val] || "py-4 md:py-8";
};

export const Section = ({
    children,
    variant = 'white',
    paddingTop = "16", // Default reduced from 24
    paddingBottom = "16", // Default reduced from 24
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
    marginBottom = "0",
    backgroundImage,
    backgroundSize = 'cover',
    backgroundPosition = 'center',
    backgroundRepeat = 'no-repeat',
    overlayColor,
    overlayOpacity = "0.4",
    containerWidth = 'normal'
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

    const containerClasses = {
        narrow: "max-w-3xl",
        normal: "container",
        wide: "max-w-7xl",
        full: "max-w-none px-0"
    }[containerWidth] || "container";

    const generatedId = React.useId();
    const uniqueSectionId = id || `section-${generatedId.replace(/:/g, '')}`;

    return (
        <section
            id={uniqueSectionId}
            className={cn(
                "relative overflow-hidden",
                !backgroundColor && !backgroundImage ? getBgStyles(variant) : "",
                pt, pb, mt, mb, shadowClass, borderClass, borderRadius, glassClasses,
                className
            )}
        >
            <style>{`
                #${uniqueSectionId} {
                    background-color: ${backgroundColor || "transparent"};
                    background-image: ${backgroundImage ? `url(${backgroundImage})` : "none"};
                    background-size: ${backgroundSize};
                    background-position: ${backgroundPosition};
                    background-repeat: ${backgroundRepeat};
                }
                ${overlayColor ? `
                #${uniqueSectionId} .section-overlay {
                    background-color: ${overlayColor};
                    opacity: ${overlayOpacity};
                }
                ` : ''}
            `}</style>

            {/* Background Overlay */}
            {overlayColor && (
                <div className="absolute inset-0 z-0 pointer-events-none section-overlay" />
            )}

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
                <div className={`${containerClasses} mx-auto px-6 relative z-10`}>
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
