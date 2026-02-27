'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface ContactFormProps {
    initialMessage?: string;
    onSuccess?: () => void;
    compact?: boolean;
    productId?: string;
    productName?: string;
    productCategory?: string;
}

export default function ContactForm({
    initialMessage = '',
    onSuccess,
    compact = false,
    productId,
    productName,
    productCategory
}: ContactFormProps) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: initialMessage });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">('idle');
    const submitInquiry = useMutation(api.inquiries.submit);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            setForm({ name: '', email: '', phone: '', message: '' });
            if (onSuccess) {
                setTimeout(onSuccess, 2000);
            }
        } catch (error) {
            console.error("Failed to submit inquiry:", error);
            setStatus('error');
        }
    };

    return (
        <div className={`${compact ? 'p-0' : 'bg-slate-50 rounded-[24px] sm:rounded-[32px] p-6 md:p-10 border border-slate-900/5'}`}>
            {!compact && <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className={`grid ${compact ? 'grid-cols-1' : 'md:grid-cols-2'} gap-5`}>
                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 text-sm transition-all text-black"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1.5">Email *</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 text-sm transition-all text-black"
                            placeholder="you@company.com"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">Phone Number</label>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 text-sm transition-all text-black"
                        placeholder="+91-XXXXXXXXXX"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">Message *</label>
                    <textarea
                        required
                        rows={compact ? 3 : 5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 text-sm resize-none transition-all text-black"
                        placeholder="Tell us about your requirements..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#16a34a] to-[#2bee6c] rounded-full hover:shadow-xl hover:shadow-[#16a34a]/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
                >
                    <Send className="w-5 h-5" />
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'sent' && (
                    <p className="text-center text-[#16a34a] font-bold text-sm bg-[#16a34a]/10 py-3 rounded-lg">✅ Message sent successfully! We&apos;ll get back to you soon.</p>
                )}
                {status === 'error' && (
                    <p className="text-center text-red-500 font-bold text-sm bg-red-50 py-3 rounded-lg">Something went wrong. Please try again or email us directly.</p>
                )}
            </form>
        </div>
    );
}
