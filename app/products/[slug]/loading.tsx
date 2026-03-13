import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
    return (
        <div className="min-h-screen bg-[var(--nb-colors-background)] flex flex-col">
            {/* Header Skeleton */}
            <div className="w-full h-20 bg-white shadow-sm flex items-center justify-between px-6 lg:px-12">
                <Skeleton className="w-32 h-8" />
                <div className="hidden md:flex gap-6">
                    <Skeleton className="w-16 h-4" variant="text" />
                    <Skeleton className="w-16 h-4" variant="text" />
                    <Skeleton className="w-16 h-4" variant="text" />
                </div>
                <Skeleton className="w-24 h-10 rounded-full" />
            </div>

            {/* Product Detail Skeleton */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Image Skeleton */}
                    <div className="lg:col-span-5">
                        <Skeleton className="w-full aspect-[4/5] sm:aspect-square rounded-[32px]" />
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="aspect-square rounded-2xl" />
                            ))}
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex gap-2">
                            <Skeleton className="w-32 h-6 rounded-full" />
                            <Skeleton className="w-24 h-6 rounded-full" />
                        </div>
                        <Skeleton className="w-3/4 h-12" />
                        <Skeleton className="w-1/3 h-4" variant="text" />
                        <div className="space-y-2 pt-4">
                            <Skeleton className="w-full h-4" variant="text" />
                            <Skeleton className="w-full h-4" variant="text" />
                            <Skeleton className="w-2/3 h-4" variant="text" />
                        </div>
                        <Skeleton className="w-40 h-12 rounded-full mt-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-24 rounded-[24px]" />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
