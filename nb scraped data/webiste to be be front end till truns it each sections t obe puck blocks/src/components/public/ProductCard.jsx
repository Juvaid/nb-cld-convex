import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ProductCard({ category }) {
    return (
        <div className="group relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-white border border-dark/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3">
            {/* Image area */}
            <div className="h-48 sm:h-64 bg-surface-muted flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50" />
                <div className="relative text-5xl sm:text-6xl opacity-20 group-hover:opacity-40 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">🌿</div>

                {/* Category tag */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                    <div className="glass px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 sm:gap-1.5 border-white/40">
                        <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                        Natural
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 sm:p-10">
                <h3 className="font-black text-xl sm:text-2xl text-dark mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight">
                    {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6 sm:mb-8 font-medium line-clamp-2 opacity-80 hidden sm:block">
                    {category.description}
                </p>
                <Link
                    href={`/products#${category.slug}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-dark group-hover:text-primary transition-colors py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-dark/5 group-hover:bg-primary/5"
                >
                    Explore Range
                    <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 translate-y-[1px] group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
