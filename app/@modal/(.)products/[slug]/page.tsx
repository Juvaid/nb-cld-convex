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
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-5xl max-h-[96vh] sm:max-h-[85vh] md:max-h-[90vh] bg-white rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-y-auto pointer-events-auto"
            >
                {/* Close Button */}
                <button
                    onClick={() => router.back()}
                    className="fixed sm:absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md sm:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-900/5 hover:border-slate-900/10 shadow-sm sm:shadow-none"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <ProductDetail slug={slug} isModal={true} onClose={() => router.back()} />
            </motion.div>
        </div>
    );
}
