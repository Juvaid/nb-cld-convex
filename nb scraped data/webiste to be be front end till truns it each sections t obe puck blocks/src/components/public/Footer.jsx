import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-white pt-20 sm:pt-24 pb-12 overflow-hidden relative">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-30" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-20">
                    {/* Brand Col */}
                    <div className="space-y-6 sm:space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl sm:text-2xl font-black tracking-tight leading-none block">Nature&apos;s Boon</span>
                                <span className="text-[10px] text-white/50 font-bold tracking-[0.2em] uppercase leading-none mt-1 sm:mt-1.5 block">Since 2006</span>
                            </div>
                        </Link>
                        <p className="text-white/60 text-sm sm:text-base leading-relaxed font-medium max-w-xs">
                            A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.
                        </p>
                        <div className="flex gap-4">
                            {[Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all group">
                                    <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-white group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-base sm:text-lg font-black mb-6 sm:mb-8 tracking-tight">Quick Links</h4>
                        <ul className="space-y-3 sm:space-y-4">
                            {['Home', 'About Us', 'Services', 'Our Products', 'Contact'].map((link) => (
                                <li key={link}>
                                    <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-white/60 hover:text-primary transition-colors font-semibold flex items-center gap-2 group text-xs sm:text-sm">
                                        {link}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-base sm:text-lg font-black mb-6 sm:mb-8 tracking-tight">Expertise</h4>
                        <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                            {['OEM Manufacturing', 'Private Labeling', 'Formulation R&D', 'Packaging Design', 'Contract Manufacturing'].map((link) => (
                                <li key={link}>
                                    <Link href="/services" className="text-white/60 hover:text-primary transition-colors font-semibold flex items-center gap-2 group">
                                        {link}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Col */}
                    <div>
                        <h4 className="text-base sm:text-lg font-black mb-6 sm:mb-8 tracking-tight">Get in Touch</h4>
                        <ul className="space-y-4 sm:space-y-6">
                            {[
                                { icon: Mail, text: 'info@naturesboon.net', sub: 'General Inquiries' },
                                { icon: Phone, text: '+91-9877859800', sub: 'WhatsApp Available' },
                                { icon: MapPin, text: 'Ludhiana, Punjab, India', sub: 'H.O. & Manufacturing' },
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <item.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <span className="block text-xs sm:text-sm font-black text-white">{item.text}</span>
                                        <span className="block text-[8px] sm:text-[10px] uppercase font-bold text-white/40 tracking-wider mt-1 sm:mt-1.5">{item.sub}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 sm:pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-white/40 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-center sm:text-left">
                        © {currentYear} Nature&apos;s Boon. All Rights Reserved.
                    </p>
                    <div className="flex gap-6 sm:gap-8">
                        <Link href="#" className="text-white/40 hover:text-white transition-colors text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.1em]">Privacy Policy</Link>
                        <Link href="#" className="text-white/40 hover:text-white transition-colors text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.1em]">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
