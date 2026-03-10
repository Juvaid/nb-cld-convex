import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'section-title' | 'section-subtitle' | 'body' | 'small' | 'detail';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
    color?: 'current' | 'slate-900' | 'slate-600' | 'slate-500' | 'slate-400' | 'nb-green' | 'white';
    align?: 'left' | 'center' | 'right';
    tracking?: 'tighter' | 'tight' | 'normal' | 'wide' | 'widest';
    leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
    uppercase?: boolean;
    className?: string;
}

const variantTags = {
    h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
    'section-title': 'h2', 'section-subtitle': 'p',
    body: 'p', small: 'p', detail: 'span'
};

const variantClasses = {
    h1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.1]',
    h2: 'text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight',
    h3: 'text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight',
    h4: 'text-xl md:text-2xl',
    h5: 'text-lg md:text-xl',
    h6: 'text-base md:text-lg',
    'section-title': 'text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight',
    'section-subtitle': 'text-sm md:text-base leading-relaxed',
    body: 'text-base md:text-lg leading-relaxed',
    small: 'text-sm leading-relaxed',
    detail: 'text-[10px] uppercase tracking-[0.2em]',
};

const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
};

const colorClasses = {
    current: 'text-current',
    'slate-900': 'text-slate-900',
    'slate-600': 'text-slate-600',
    'slate-500': 'text-slate-500',
    'slate-400': 'text-slate-400',
    'nb-green': 'text-nb-green',
    white: 'text-white',
};

const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

export const Typography = ({
    children,
    variant = 'body',
    weight,
    color = 'current',
    align = 'left',
    tracking,
    leading,
    uppercase = false,
    className = "",
}: TypographyProps) => {
    const Tag = variantTags[variant] as any;

    // Default weights if not specified
    const defaultWeight =
        (variant.startsWith('h') || variant === 'detail' || variant === 'section-title')
            ? 'black'
            : (variant === 'section-subtitle' ? 'medium' : 'normal');

    const activeWeight = weight || defaultWeight;

    return (
        <Tag className={cn(
            variantClasses[variant],
            weightClasses[activeWeight],
            colorClasses[color],
            alignClasses[align],
            tracking && `tracking-${tracking}`,
            leading && `leading-${leading}`,
            uppercase && 'uppercase',
            className
        )}>
            {children}
        </Tag>
    );
};

