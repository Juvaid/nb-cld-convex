import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({ className = "", variant = "rectangular", ...props }: SkeletonProps) {
    let baseClass = "animate-pulse bg-slate-200 rounded-md";

    if (variant === "circular") {
        baseClass = "animate-pulse bg-slate-200 rounded-full";
    } else if (variant === "text") {
        baseClass = "animate-pulse bg-slate-200 rounded h-4";
    }

    return (
        <div className={`${baseClass} ${className}`} {...props} />
    );
}

// Higher order modern Page Skeleton for initial flashes
export function PageSkeleton() {
    return (
        <div className="w-full min-h-screen bg-background flex flex-col">
            {/* Header Skeleton */}
            <div className="w-full h-20 bg-white shadow-sm flex items-center justify-between px-6 lg:px-12 z-10 relative">
                <Skeleton className="w-32 h-8" />
                <div className="hidden md:flex gap-6">
                    <Skeleton className="w-16 h-4" variant="text" />
                    <Skeleton className="w-16 h-4" variant="text" />
                    <Skeleton className="w-16 h-4" variant="text" />
                </div>
                <Skeleton className="w-24 h-10 rounded-full" />
            </div>

            {/* Hero Section Skeleton */}
            <div className="w-full h-[60vh] md:h-[80vh] bg-slate-100 flex flex-col justify-center items-center p-8 gap-6 animate-pulse">
                <Skeleton className="w-32 h-6" variant="text" />
                <Skeleton className="w-3/4 md:w-1/2 h-16 md:h-24" />
                <Skeleton className="w-2/3 md:w-1/3 h-6" variant="text" />
                <div className="flex gap-4 mt-4">
                    <Skeleton className="w-36 h-12 rounded-full" />
                    <Skeleton className="w-36 h-12 rounded-full" />
                </div>
            </div>

            {/* Content Body Skeleton */}
            <div className="max-w-7xl mx-auto w-full p-8 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <Skeleton className="w-full h-48 rounded-2xl" />
                        <Skeleton className="w-3/4 h-6" variant="text" />
                        <Skeleton className="w-full h-4" variant="text" />
                        <Skeleton className="w-2/3 h-4" variant="text" />
                    </div>
                ))}
            </div>
        </div>
    );
}
