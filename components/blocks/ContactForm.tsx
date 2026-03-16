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
    const [form, setForm] = useState({
        name: '',
        brandName: '',
        email: '',
        phone: '',
        message: initialMessage,
        productCategory: productCategory || '',
        requestType: '',
        annualVolume: '',
        formulaStatus: '',
        timeline: ''
    });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [messageError, setMessageError] = useState<string | null>(null);
    const [fieldError, setFieldError] = useState<string | null>(null);
    const submitInquiry = useMutation(api.inquiries.submit);

    const isRFQ = !!form.requestType || !!productId;
    const words = wordCount(form.message);
    const needsMoreWords = !isRFQ && words < MIN_WORDS;

    const handleMessageChange = (val: string) => {
        setForm({ ...form, message: val });
        if (messageError && wordCount(val) >= MIN_WORDS) setMessageError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic required field validation (client-side safety)
        const name = form.name.trim();
        const email = form.email.trim();
        const phone = form.phone.trim();
        const message = form.message.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !phone) {
            setFieldError("Please fill in your name, email, and phone.");
            return;
        }

        if (!emailRegex.test(email)) {
            setFieldError("Please enter a valid email address.");
            return;
        }

        if (!isRFQ && wordCount(message) < MIN_WORDS) {
            setMessageError(`Please describe your query in at least ${MIN_WORDS} words. (${words} / ${MIN_WORDS})`);
            return;
        }

        if (isRFQ && message.length === 0) {
            setMessageError("Please add at least a short description of your requirements.");
            return;
        }

        setFieldError(null);

        setStatus('sending');
        try {
            await submitInquiry({
                name,
                brandName: form.brandName,
                email,
                phone,
                message,
                productId,
                productName,
                productCategory: form.productCategory,
                requestType: form.requestType,
                annualVolume: form.annualVolume,
                formulaStatus: form.formulaStatus,
                timeline: form.timeline,
            });
            setStatus('sent');
            if (onSuccess) setTimeout(onSuccess, 3000);
        } catch {
            setStatus('error');
        }
    };

    const reset = () => {
        setForm({
            name: '',
            brandName: '',
            email: '',
            phone: '',
            message: '',
            productCategory: '',
            requestType: '',
            annualVolume: '',
            formulaStatus: '',
            timeline: ''
        });
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

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-tighter">Full Name *</label>
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
                        <label className="block text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-tighter">Email *</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-tighter">Phone / WhatsApp *</label>
                        <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black"
                            placeholder="+91-XXXXX-XXXXX"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-tighter">Brand Name (Optional)</label>
                        <input
                            type="text"
                            value={form.brandName}
                            onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black"
                            placeholder="Your Brand / Company"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-tighter">Product Category *</label>
                        <select
                            required
                            aria-label="Product Category"
                            value={form.productCategory}
                            onChange={(e) => setForm({ ...form, productCategory: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
                        >
                            <option value="">Select Category</option>
                            <option value="Skin Care">Skin Care</option>
                            <option value="Hair Care">Hair Care</option>
                            <option value="Herbal / Ayurvedic">Herbal / Ayurvedic</option>
                            <option value="Personal Care">Personal Care</option>
                            <option value="Essential Oils">Essential Oils</option>
                            <option value="Home Care">Home Care</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-tighter">Type of Request *</label>
                        <select
                            required
                            aria-label="Type of Request"
                            value={form.requestType}
                            onChange={(e) => setForm({ ...form, requestType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
                        >
                            <option value="">Select Request Type</option>
                            <option value="Private Labeling">Private Labeling (Your Brand)</option>
                            <option value="OEM Manufacturing">OEM (Custom Manufacturing)</option>
                            <option value="Custom Formulation">R&D / New Product Development</option>
                            <option value="Bulk Purchase">Bulk / Raw Material Purchase</option>
                            <option value="Other">General Inquiry</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-tighter">Approximate Quantity *</label>
                        <select
                            required
                            aria-label="Approximate Quantity"
                            value={form.annualVolume}
                            onChange={(e) => setForm({ ...form, annualVolume: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
                        >
                            <option value="">Select Quantity Range</option>
                            <option value="100 - 500 units">100 - 500 units</option>
                            <option value="500 - 1,000 units">500 - 1,000 units</option>
                            <option value="1,000 - 5,000 units">1,000 - 5,000 units</option>
                            <option value="5,000+ units">5,000+ units</option>
                            <option value="Sample Request">Sample Request / Prototype</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-tighter">Timeline *</label>
                        <select
                            required
                            aria-label="Launch Timeline"
                            value={form.timeline}
                            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40 text-sm transition-all text-black appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
                        >
                            <option value="">Select Launch Timeline</option>
                            <option value="Immediately">Immediately (ASAP)</option>
                            <option value="1-3 Months">1 - 3 Months</option>
                            <option value="3-6 Months">3 - 6 Months</option>
                            <option value="Planning Stage">Just Researching / Planning</option>
                        </select>
                    </div>
                </div>

                {/* 3. Formulation Status */}
                <div className="pt-4">
                    <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-tighter">Do you have an existing formula? *</label>
                    <div className="flex flex-wrap gap-4">
                        {['Yes', 'No', 'Not sure / Need help'].map((opt) => (
                            <label key={opt} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-nb-green/30 transition-all">
                                <input
                                    type="radio"
                                    name="formulaStatus"
                                    required
                                    value={opt}
                                    checked={form.formulaStatus === opt}
                                    onChange={(e) => setForm({ ...form, formulaStatus: e.target.value })}
                                    className="w-4 h-4 text-nb-green focus:ring-nb-green"
                                />
                                <span className="text-sm font-medium text-slate-700">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 4. Message */}
                <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                        <label className="block text-sm font-bold text-slate-900 uppercase tracking-tighter">
                            Additional Details {isRFQ ? '(Optional)' : '*'}
                        </label>
                        {!isRFQ && (
                            <span className={`text-xs font-medium tabular-nums transition-colors ${words === 0 ? 'text-slate-400'
                                    : words < MIN_WORDS ? 'text-amber-500'
                                        : 'text-[#16a34a]'
                                }`}>
                                {words} / {MIN_WORDS} words
                            </span>
                        )}
                    </div>
                    <textarea
                        required={!isRFQ}
                        rows={4}
                        value={form.message}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 text-sm resize-none transition-all text-black ${messageError
                                ? 'border-amber-400 focus:ring-amber-400/20'
                                : 'border-slate-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]/40'
                            }`}
                        placeholder={isRFQ
                            ? "Tell us more about your target audience, packaging preferences, or any specific ingredients."
                            : "Describe your query in detail (minimum 20 words for faster response)."}
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
