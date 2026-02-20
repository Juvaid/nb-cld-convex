"use client";

import { use } from "react";
import ProductDetail from "@/components/scraped/ProductDetail";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductModal({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8 pointer-events-none">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => router.back()}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
            />

            {/* Modal Content */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                    if (info.offset.y > 100) router.back();
                }}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-5xl max-h-[96vh] sm:max-h-[85vh] md:max-h-[90vh] bg-white rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-y-auto pointer-events-auto"
            >
                {/* Swipe/Close Handle */}
                <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white/50 backdrop-blur-md z-[60] sm:hidden">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>

                {/* Desktop Close Button */}
                <button
                    onClick={() => router.back()}
                    className="hidden sm:flex absolute top-6 right-6 z-[60] p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-900/5 hover:border-slate-900/10"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                <ProductDetail slug={slug} isModal={true} onClose={() => router.back()} />
            </motion.div>
        </div>
    );
}
