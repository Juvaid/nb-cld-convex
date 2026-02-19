import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCategory } from '@/lib/scraped-theme';

export default function ProductCard({ category }: { category: ProductCategory }) {
    return (
        <div className="group relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-white border border-slate-900/5 hover:shadow-2xl hover:shadow-nb-green/10 transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3">
            {/* Main Clickable Area */}
            <Link href={`/products/${category.slug}`} className="block">
                {/* Image area */}
                <div className="h-48 sm:h-64 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-nb-green-soft/10 to-nb-green-deep/10 opacity-50" />

                    {category.images && category.images.length > 0 && typeof category.images[0] === 'string' && category.images[0] !== "[object Object]" ? (
                        <img
                            src={category.images[0].startsWith('http') ? category.images[0] : `/api/storage/${category.images[0]}`}
                            className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-700"
                            alt={category.name}
                        />
                    ) : (
                        <div className="relative text-5xl sm:text-6xl opacity-20 group-hover:opacity-40 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">🌿</div>
                    )}

                    {/* Category tag */}
                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
                        <div className="bg-white/40 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-nb-green flex items-center gap-1 sm:gap-1.5 border border-white/40">
                            <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            Natural
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 sm:p-10">
                    <h3 className="font-black text-xl sm:text-2xl text-slate-900 mb-1 group-hover:text-nb-green transition-colors leading-tight">
                        {category.name}
                    </h3>
                    {(category as any).sku && (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                            SKU: {(category as any).sku}
                        </div>
                    )}
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 sm:mb-8 font-medium line-clamp-2 opacity-80 hidden sm:block">
                        {category.description}
                    </p>
                    <div
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 group-hover:text-nb-green transition-colors py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-900/5 group-hover:bg-nb-green/5"
                    >
                        Learn More
                        <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 translate-y-[1px] group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>

            {/* Fixed CTA at bottom - ensuring it doesn't overlap link functionality if possible, 
                or just making the whole card the link and changing the text */}
            <div className="px-8 pb-8 sm:px-10 sm:pb-10">
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-[10px] font-black text-white bg-gradient-to-r from-nb-green-soft to-nb-green-deep px-4 py-2 rounded-full hover:shadow-lg hover:shadow-nb-green/20 transition-all w-full justify-center uppercase tracking-widest"
                >
                    Inquire for Bulk
                </Link>
            </div>
        </div>
    );
}
