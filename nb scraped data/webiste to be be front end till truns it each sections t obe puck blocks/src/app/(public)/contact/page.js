'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus('sent');
                setForm({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <>
            {/* Hero */}
            <section className="relative pt-40 pb-20 bg-gradient-to-br from-primary-dark to-primary overflow-hidden">
                <div className="absolute top-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-4 relative">
                    <span className="text-accent font-semibold text-sm tracking-widest uppercase">Get in Touch</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4">Contact Us</h1>
                    <p className="text-white/70 max-w-2xl text-lg">
                        Ready to start your personal care brand journey? Reach out to our team.
                    </p>
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact info */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>

                            {[
                                { icon: Phone, label: 'General Inquiries', value: '+91-9877659808' },
                                { icon: Mail, label: 'Email', value: 'naturesboon@yahoo.com' },
                                { icon: MapPin, label: 'Location', value: 'Ludhiana, Punjab, India' },
                                { icon: Clock, label: 'Business Hours', value: 'Mon — Fri, 9AM – 6PM' },
                            ].map((item) => (
                                <div key={item.label} className="flex gap-4 p-4 rounded-2xl glass border border-primary/5">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted">{item.label}</p>
                                        <p className="font-semibold text-foreground">{item.value}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-6">
                                <h3 className="font-semibold text-foreground mb-3">Department Emails</h3>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li><span className="font-medium text-foreground">Sales:</span> sales.naturesboon@yahoo.com</li>
                                    <li><span className="font-medium text-foreground">Purchase:</span> purchase.naturesboon@yahoo.com</li>
                                    <li><span className="font-medium text-foreground">Accounts:</span> accounts.naturesboon@yahoo.com</li>
                                    <li><span className="font-medium text-foreground">Artwork:</span> artwork.naturesboon@yahoo.com</li>
                                    <li><span className="font-medium text-foreground">Exports:</span> Exports@lustercosmetics.in</li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact form */}
                        <div className="lg:col-span-3">
                            <div className="bg-surface rounded-3xl p-8 md:p-10">
                                <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                placeholder="you@company.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                            placeholder="+91-XXXXXXXXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                                            placeholder="Tell us about your requirements..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-accent rounded-full hover:shadow-2xl hover:shadow-accent/30 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5" />
                                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    </button>

                                    {status === 'sent' && (
                                        <p className="text-center text-primary font-medium text-sm">✅ Message sent successfully! We&apos;ll get back to you soon.</p>
                                    )}
                                    {status === 'error' && (
                                        <p className="text-center text-red-500 font-medium text-sm">Something went wrong. Please try again or email us directly.</p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
