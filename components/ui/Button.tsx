"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
}

const variantClasses = {
    primary: 'bg-nb-green text-white shadow-sm hover:shadow-md',
    secondary: 'bg-slate-900 text-white shadow-xl hover:bg-slate-800',
    outline: 'bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-50',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
};

const sizeClasses = {
    sm: 'px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-xs',
    md: 'px-6 md:px-8 py-3 md:py-3.5 text-xs md:text-sm',
    lg: 'px-8 md:px-10 py-4 md:py-5 text-sm md:text-base',
    xl: 'px-10 md:px-12 py-5 md:py-6 text-lg md:text-xl',
};

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon,
    iconPosition = 'right',
    className = "",
    ...props
}: ButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 0 }}
            className={`
                inline-flex items-center justify-center gap-3 
                rounded-2xl font-semibold tracking-tight transition-all
                relative overflow-hidden group/btn
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}
        >
            {/* Premium Sheen Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] -translate-x-[150%] group-hover/btn:animate-premium-sheen" />
            </div>

            <span className="relative z-10 flex items-center gap-3">
                {icon && iconPosition === 'left' && icon}
                {children}
                {icon && iconPosition === 'right' && icon}
            </span>
        </motion.button>
    );
};
