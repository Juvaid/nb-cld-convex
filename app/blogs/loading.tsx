import { Skeleton } from "@/components/ui/Skeleton";

export default function BlogsLoading() {
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

            {/* Blog Header Skeleton */}
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 pt-16 pb-8 text-center space-y-4">
                <Skeleton className="w-48 h-6 mx-auto" variant="text" />
                <Skeleton className="w-96 h-10 mx-auto" />
                <Skeleton className="w-72 h-5 mx-auto" variant="text" />
            </div>

            {/* Blog Grid Skeleton */}
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col gap-4 rounded-2xl overflow-hidden">
                        <Skeleton className="w-full h-48 rounded-2xl" />
                        <div className="space-y-2 px-1">
                            <Skeleton className="w-20 h-5 rounded-full" />
                            <Skeleton className="w-3/4 h-6" variant="text" />
                            <Skeleton className="w-full h-4" variant="text" />
                            <Skeleton className="w-2/3 h-4" variant="text" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
