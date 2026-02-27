'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Leaf, Send } from 'lucide-react';
import { defaultNavLinks } from '@/lib/default-theme';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'pt-2' : 'pt-4'}`}>
            <div className={`max-w-7xl mx-auto px-4 w-full transition-all duration-500 ${scrolled ? 'max-w-6xl' : ''}`}>
                <nav className={`relative bg-white/40 backdrop-blur-md rounded-[20px] sm:rounded-[24px] px-6 sm:px-8 py-3 sm:py-5 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-xl' : 'shadow-none'} border border-white/40`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#16a34a] to-[#2bee6c] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                            <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="block">
                            <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-none block">Nature&apos;s Boon</span>
                            <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase leading-none mt-1 sm:mt-1.5 block opacity-70">Since 2006</span>
                        </div>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-2">
                        {defaultNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-6 py-2.5 text-sm font-bold text-slate-900/70 hover:text-[#16a34a] transition-all rounded-xl hover:bg-[#16a34a]/5 whitespace-nowrap"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="ml-4 w-px h-8 bg-slate-900/10" />
                        <Link
                            href="/contact"
                            className="ml-6 px-8 py-3 text-sm font-black text-white bg-slate-900 rounded-xl hover:bg-[#16a34a] transition-all hover:scale-105 flex items-center gap-3 shadow-xl shadow-slate-900/10 group whitespace-nowrap"
                        >
                            Inquire Now
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-3 rounded-2xl bg-slate-900/5 hover:bg-slate-900/10 transition-colors text-slate-900"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </nav>
            </div>

            {/* Mobile menu overlay & content */}
            <div className={`fixed inset-0 bg-slate-900/20 backdrop-blur-xl z-[-1] transition-opacity duration-500 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)} />

            {isOpen && (
                <div className="md:hidden absolute top-[100%] left-4 right-4 mt-3 bg-white/40 backdrop-blur-md rounded-[32px] p-8 shadow-2xl animate-fade-in-up border border-white/50">
                    <div className="space-y-3">
                        {defaultNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-4 text-lg font-bold text-slate-900/70 hover:text-[#16a34a] hover:bg-[#16a34a]/5 rounded-2xl transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className="mt-6 w-full py-5 text-center text-lg font-black text-white bg-slate-900 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 group"
                        >
                            Inquire Now
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
