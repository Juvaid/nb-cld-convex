"use client";

import React from "react";

interface TypographyProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'small' | 'detail';
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
    body: 'p', small: 'p', detail: 'span'
};

const variantClasses = {
    h1: 'text-5xl md:text-7xl tracking-tight leading-[1.1]',
    h2: 'text-4xl md:text-5xl tracking-tight leading-tight',
    h3: 'text-3xl md:text-4xl tracking-tight leading-tight',
    h4: 'text-xl md:text-2xl font-black',
    h5: 'text-lg md:text-xl font-black',
    h6: 'text-base md:text-lg font-black',
    body: 'text-base md:text-lg leading-relaxed',
    small: 'text-sm leading-relaxed',
    detail: 'text-[10px] uppercase tracking-[0.2em] font-black',
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
    const defaultWeight = (variant.startsWith('h') || variant === 'detail') ? 'black' : 'medium';
    const activeWeight = weight || defaultWeight;

    return (
        <Tag className={`
            ${variantClasses[variant]} 
            ${weightClasses[activeWeight]} 
            ${colorClasses[color]} 
            ${alignClasses[align]}
            ${tracking ? `tracking-${tracking}` : ''}
            ${leading ? `leading-${leading}` : ''}
            ${uppercase ? 'uppercase' : ''}
            ${className}
        `}>
            {children}
        </Tag>
    );
};
