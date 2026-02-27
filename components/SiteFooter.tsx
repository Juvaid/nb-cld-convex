"use client";

import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Linkedin, Instagram, ArrowUpRight, Facebook, Twitter, Github } from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface SiteFooterProps {
    logoText?: string;
    logoImage?: string;
    description?: string;
    copyrightText?: string;
    backgroundColor?: string;
    textColor?: string;
    socialLinks?: { platform: string; href: string }[];
}

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return <Facebook className="w-4 sm:w-5 h-4 sm:h-5" />;
        case 'instagram': return <Instagram className="w-4 sm:w-5 h-4 sm:h-5" />;
        case 'twitter': return <Twitter className="w-4 sm:w-5 h-4 sm:h-5" />;
        case 'linkedin': return <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />;
        case 'github': return <Github className="w-4 sm:w-5 h-4 sm:h-5" />;
        default: return <Leaf className="w-4 sm:w-5 h-4 sm:h-5" />;
    }
};

export function SiteFooter({
    logoText: propLogoText,
    logoImage: propLogoImage,
    description: propDescription,
    copyrightText: propCopyrightText,
    backgroundColor = "bg-slate-900",
    textColor = "text-white",
    socialLinks: propSocialLinks,
}: SiteFooterProps) {
    const siteSettings = useQuery(api.siteSettings.getSiteSettings);
    const isLoading = siteSettings === undefined;

    const logoText = siteSettings?.logoText ?? propLogoText ?? "Nature's Boon";
    const logoImage = siteSettings?.logoImage ?? propLogoImage;
    const description = siteSettings?.footerDescription ?? propDescription ?? "A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.";
    const copyrightText = siteSettings?.footerCopyrightText ?? propCopyrightText ?? `© ${new Date().getFullYear()} NatureBoon. All rights reserved.`;
    const socialLinks = siteSettings?.socialLinks ?? propSocialLinks ?? [
        { platform: "linkedin", href: "#" },
        { platform: "instagram", href: "#" }
    ];
    const currentYear = new Date().getFullYear();

    // Determine hover color based on text color (simplified logic)
    const hoverColor = textColor.includes('slate-900') ? 'hover:text-nb-green' : 'hover:text-nb-green';
    const subTextColor = textColor.includes('text-white') ? 'text-white/60' : 'text-slate-500';

    return (
        <footer className={`${backgroundColor} ${textColor} pt-20 sm:pt-24 pb-12 overflow-hidden relative transition-colors duration-300`}>
            {/* Decorative background blur - adjust opacity based on background */}
            <div className={`absolute top-0 right-0 w-[40%] h-[40%] bg-nb-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 ${backgroundColor === 'bg-white' ? 'opacity-60' : 'opacity-30'}`} />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-20">
                    {/* Brand Col */}
                    <div className="space-y-6 sm:space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            {isLoading ? (
                                <>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-200/20 animate-pulse" />
                                    <div>
                                        <div className="w-32 h-6 bg-slate-200/20 rounded mb-2 animate-pulse" />
                                        <div className="w-16 h-3 bg-slate-200/20 rounded animate-pulse" />
                                    </div>
                                </>
                            ) : logoImage ? (
                                <img src={logoImage} alt={logoText} className="h-10 sm:h-12 w-auto object-contain" />
                            ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-nb-green-soft to-nb-green-deep flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                            )}
                            {!isLoading && (
                                <div>
                                    <span className={`text-xl sm:text-2xl font-black tracking-tight leading-none block ${textColor}`}>{logoText}</span>
                                    <span className={`text-[10px] ${subTextColor} font-bold tracking-[0.2em] uppercase leading-none mt-1 sm:mt-1.5 block`}>Since 2006</span>
                                </div>
                            )}
                        </Link>
                        {isLoading ? (
                            <div className="space-y-2">
                                <div className="w-full h-4 bg-slate-200/20 rounded animate-pulse" />
                                <div className="w-5/6 h-4 bg-slate-200/20 rounded animate-pulse" />
                                <div className="w-4/6 h-4 bg-slate-200/20 rounded animate-pulse" />
                            </div>
                        ) : (
                            <p className={`${subTextColor} text-sm sm:text-base leading-relaxed font-medium max-w-xs`}>
                                {description}
                            </p>
                        )}
                        <div className="flex gap-4">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-200/20 animate-pulse" />
                                ))
                            ) : socialLinks.map((link: { platform: string; href: string }, i: number) => (
                                <a
                                    key={i}
                                    href={link.href}
                                    aria-label={`Follow us on ${link.platform}`}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all group ${backgroundColor === 'bg-white' ? 'bg-slate-100 hover:bg-nb-green hover:text-white' : 'bg-white/5 hover:bg-nb-green text-white'}`}
                                >
                                    <SocialIcon platform={link.platform} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className={`text-base sm:text-lg font-black mb-6 sm:mb-8 tracking-tight ${textColor}`}>Quick Links</h4>
                        <ul className="space-y-3 sm:space-y-4">
                            {['Home', 'About Us', 'Services', 'Our Products', 'Contact'].map((link) => {
                                const href = link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-').replace('our-', '')}`;
                                return (
                                    <li key={link}>
                                        <Link href={href} className={`${subTextColor} hover:text-nb-green transition-colors font-semibold flex items-center gap-2 group text-xs sm:text-sm`}>
                                            {link}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className={`text-base sm:text-lg font-black mb-6 sm:mb-8 tracking-tight ${textColor}`}>Expertise</h4>
                        <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                            {['OEM Manufacturing', 'Private Labeling', 'Formulation R&D', 'Packaging Design', 'Contract Manufacturing'].map((link) => (
                                <li key={link}>
                                    <Link href="/services" className={`${subTextColor} hover:text-nb-green transition-colors font-semibold flex items-center gap-2 group`}>
                                        {link}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Col */}
                    <div>
                        <h4 className={`text-base sm:text-lg font-black mb-6 sm:mb-8 tracking-tight ${textColor}`}>Get in Touch</h4>
                        <ul className="space-y-4 sm:space-y-6">
                            {[
                                { icon: Mail, text: 'info@naturesboon.net', sub: 'General Inquiries' },
                                { icon: Phone, text: '+91-9877859800', sub: 'WhatsApp Available' },
                                { icon: MapPin, text: 'Ludhiana, Punjab, India', sub: 'H.O. & Manufacturing' },
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start group">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${backgroundColor === 'bg-white' ? 'bg-slate-100 group-hover:bg-nb-green/20' : 'bg-white/5 group-hover:bg-nb-green/20'}`}>
                                        <item.icon className="w-4 h-4 text-nb-green" />
                                    </div>
                                    <div>
                                        <span className={`block text-xs sm:text-sm font-black ${textColor}`}>{item.text}</span>
                                        <span className={`block text-[8px] sm:text-[10px] uppercase font-bold tracking-wider mt-1 sm:mt-1.5 ${backgroundColor === 'bg-white' ? 'text-slate-400' : 'text-white/40'}`}>{item.sub}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className={`pt-8 sm:pt-12 border-t flex flex-col sm:flex-row justify-between items-center gap-6 ${backgroundColor === 'bg-white' ? 'border-slate-100' : 'border-white/5'}`}>
                    <p className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-center sm:text-left ${backgroundColor === 'bg-white' ? 'text-slate-400' : 'text-white/40'}`}>
                        {copyrightText}
                    </p>
                    <div className="flex gap-6 sm:gap-8">
                        <Link href="#" className={`${backgroundColor === 'bg-white' ? 'text-slate-400 hover:text-slate-900' : 'text-white/40 hover:text-white'} transition-colors text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.1em]`}>Privacy Policy</Link>
                        <Link href="#" className={`${backgroundColor === 'bg-white' ? 'text-slate-400 hover:text-slate-900' : 'text-white/40 hover:text-white'} transition-colors text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.1em]`}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
