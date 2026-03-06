'use client';

import { useState } from 'react';
import { Send, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from 'next/link';

export interface ContactFormProps {
    initialMessage?: string;
    onSuccess?: () => void;
    compact?: boolean;
    productId?: string;
    productName?: string;
    productCategory?: string;
}

function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

const MIN_WORDS = 20;

export default function ContactForm({
    initialMessage = '',
    onSuccess,
    compact = false,
    productId,
    productName,
    productCategory
}: ContactFormProps) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: initialMessage });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [messageError, setMessageError] = useState<string | null>(null);
    const submitInquiry = useMutation(api.inquiries.submit);

    const isProductInquiry = !!productId;
    const words = wordCount(form.message);
    const needsMoreWords = !isProductInquiry && words < MIN_WORDS;

    const handleMessageChange = (val: string) => {
        setForm({ ...form, message: val });
        if (messageError && wordCount(val) >= MIN_WORDS) setMessageError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Word count guard — only for general queries
        if (needsMoreWords) {
            setMessageError(`Please describe your query in at least ${MIN_WORDS} words. (${words} / ${MIN_WORDS})`);
            return;
        }

        setStatus('sending');
        try {
            await submitInquiry({
                name: form.name,
                email: form.email,
                phone: form.phone,
                message: form.message,
                productId,
                productName,
                productCategory,
            });
            setStatus('sent');
            if (onSuccess) setTimeout(onSuccess, 3000);
        } catch {
            setStatus('error');
        }
    };

    const reset = () => {
        setForm({ name: '', email: '', phone: '', message: '' });
        setStatus('idle');
        setMessageError(null);
    };

    // ── Success State ──────────────────────────────────────────────────────────
    if (status === 'sent') {
        return (
            <div className={`${compact ? 'p-0' : 'bg-slate-50 rounded-[24px] sm:rounded-[32px] p-6 md:p-10 border border-slate-900/5'}`}>
                <div className="flex flex-col items-center text-center py-4 sm:py-8 gap-5">
                    {/* Animated check */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[#16a34a]/10 animate-ping opacity-30" />
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#16a34a] to-[#2bee6c] flex items-center justify-center shadow-xl shadow-[#16a34a]/30">
                            <CheckCircle2 className="text-white w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="space-y-2 max-w-sm">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Message sent, {form.name.split(' ')[0] || 'there'}!
                        </h3>
                        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                            We've received your enquiry and will get back to you within <span className="font-semibold text-slate-700">24 business hours</span>.
                        </p>
                        {productName && (
                            <p className="text-[#16a34a] text-sm font-medium bg-[#16a34a]/8 px-4 py-2 rounded-xl">
                                Regarding: {productName}
                            </p>
                        )}
                    </div>

                    {/* CTAs */}
                    <div className="w-full max-w-sm flex flex-col gap-3 pt-2">
                        <Link
                            href="/products"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#16a34a] to-[#2bee6c] rounded-full shadow-lg shadow-[#16a34a]/25 hover:shadow-xl hover:shadow-[#16a34a]/30 hover:-translate-y-0.5 transition-all"
                        >
                            Explore Our Products <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={reset}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-slate-500 border border-slate-200 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-all"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Send another message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Form State ─────────────────────────────────────────────────────────────
    return (
        <div className={`${compact ? 'p-0' : 'bg-slate-50 rounded-[24px] sm:rounded-[32px] p-6 md:p-10 border border-slate-900/5'}`}>
            {!compact && <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className={`grid ${compact ? 'grid-cols-1' : 'sm:grid-cols-2'} gap-5`}>
                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1.5">Email *</label>
                        <input
                            type="email"
                            required
                            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black"
                            placeholder="you@company.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">Phone Number</label>
                    <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setForm({ ...form, phone: digits });
                        }}
                        pattern="[0-9]{10}"
                        title="Enter a valid 10-digit mobile number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black"
                        placeholder="10-digit mobile number"
                    />
                </div>

                <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-900">
                            Message *
                        </label>
                        {/* Live word counter — only for general queries */}
                        {!isProductInquiry && (
                            <span className={`text-xs font-medium tabular-nums transition-colors ${words === 0 ? 'text-slate-400'
                                    : words < MIN_WORDS ? 'text-amber-500'
                                        : 'text-[#16a34a]'
                                }`}>
                                {words} / {MIN_WORDS} words
                            </span>
                        )}
                    </div>
                    <textarea
                        required
                        rows={compact ? 3 : 5}
                        value={form.message}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 text-sm resize-none transition-all text-black ${messageError
                                ? 'border-amber-400 focus:ring-amber-400/20'
                                : 'border-slate-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40'
                            }`}
                        placeholder={isProductInquiry
                            ? "Any specific requirements or questions about this product?"
                            : "Describe your query in detail — the more context you give, the better we can help you. (minimum 20 words)"}
                    />
                    {messageError && (
                        <p className="mt-1.5 text-xs text-amber-600 font-medium flex items-center gap-1">
                            <span className="text-base leading-none">⚠</span> {messageError}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#16a34a] to-[#2bee6c] rounded-full hover:shadow-xl hover:shadow-[#16a34a]/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed"
                >
                    {status === 'sending'
                        ? <><span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> Sending…</>
                        : <><Send className="w-5 h-5" /> Send Message</>}
                </button>

                {status === 'error' && (
                    <p className="text-center text-red-500 font-medium text-sm bg-red-50 py-3 rounded-xl">
                        Something went wrong. Please try again or email us directly.
                    </p>
                )}
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3 text-sm text-slate-500">
                <p>Or reach us directly:</p>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                    <a href="mailto:info@naturesboon.net" className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors font-medium">
                        ✉ info@naturesboon.net
                    </a>
                    <a href="https://wa.me/917696771693" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors font-medium">
                        📞 +91-76967 71693
                    </a>
                </div>
            </div>
        </div>
    );
}
