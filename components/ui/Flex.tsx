"use client";

import React from "react";
import { motion } from "framer-motion";

interface FlexProps {
    children: React.ReactNode;
    direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    mobileDirection?: 'row' | 'col';
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    gap?: string;
    wrap?: boolean;
    className?: string;
    asChild?: boolean;
}

const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
};

const mobileDirectionClasses = {
    row: 'flex-row',
    col: 'flex-col',
};

const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
};

const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
};

const getGapClass = (gap: string) => {
    const map: Record<string, string> = {
        "0": "gap-0", "1": "gap-1", "2": "gap-2", "3": "gap-3", "4": "gap-4",
        "6": "gap-6", "8": "gap-8", "12": "gap-12", "16": "gap-16", "20": "gap-20"
    };
    return map[gap] || "gap-6";
};

export const Flex = ({
    children,
    direction = 'row',
    mobileDirection,
    align = 'center',
    justify = 'start',
    gap = "6",
    wrap = false,
    className = "",
}: FlexProps) => {
    const directionClass = mobileDirection
        ? `${mobileDirectionClasses[mobileDirection]} md:${directionClasses[direction]}`
        : directionClasses[direction];

    return (
        <div className={`flex ${directionClass} ${alignClasses[align]} ${justifyClasses[justify]} ${getGapClass(gap)} ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${className}`}>
            {children}
        </div>
    );
};
