import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Linkedin, Instagram, ArrowUpRight, Facebook, Twitter, Github } from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export interface FooterProps {
    logoText?: string;
    logoImage?: string;
    description?: string;
    copyrightText?: string;
    backgroundColor?: string;
    textColor?: string;
    socialLinks?: { platform: string; href: string }[];
    id?: string;
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

export const Footer = ({
    logoText: propLogoText,
    logoImage: propLogoImage,
    description: propDescription,
    copyrightText: propCopyrightText,
    backgroundColor = "bg-slate-900",
    textColor = "text-white",
    socialLinks: propSocialLinks,
}: FooterProps) => {
    const siteSettings = useQuery(api.siteSettings.getSiteSettings);

    const logoText = siteSettings?.logoText ?? propLogoText ?? "Nature's Boon";
    const logoImage = siteSettings?.logoImage ?? propLogoImage;
    const description = siteSettings?.footerDescription ?? propDescription ?? "A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.";
    const copyrightText = siteSettings?.footerCopyrightText ?? propCopyrightText ?? `© ${new Date().getFullYear()} NatureBoon. All rights reserved.`;
    const socialLinks = siteSettings?.socialLinks ?? propSocialLinks ?? [
        { platform: "linkedin", href: "#" },
        { platform: "instagram", href: "#" }
    ];

    const subTextColor = textColor.includes('text-white') ? 'text-white/60' : 'text-slate-500';

    return (
        <footer className={`${backgroundColor} ${textColor} pt-20 sm:pt-24 pb-12 overflow-hidden relative transition-colors duration-300`}>
            {/* Decorative background blur */}
            <div className={`absolute top-0 right-0 w-[40%] h-[40%] bg-nb-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 ${backgroundColor === 'bg-white' ? 'opacity-60' : 'opacity-30'}`} />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-20">
                    {/* Brand Col */}
                    <div className="space-y-6 sm:space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            {logoImage ? (
                                <Image 
                                    src={logoImage} 
                                    alt={logoText} 
                                    width={200}
                                    height={48}
                                    className={`h-10 sm:h-12 w-auto object-contain ${backgroundColor !== 'bg-white' ? 'invert brightness-0' : ''}`} 
                                />
                            ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-nb-green-soft to-nb-green-deep flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                            )}
                            <div>
                                <span className={`text-xl sm:text-2xl font-bold tracking-tight leading-none block ${textColor}`}>{logoText}</span>
                                <span className={`text-[10px] ${subTextColor} font-bold tracking-[0.2em] uppercase leading-none mt-1 sm:mt-1.5 block`}>Since 2006</span>
                            </div>
                        </Link>
                        <div className={`${subTextColor} text-sm sm:text-base leading-relaxed font-medium max-w-xs`}>
                            {description}
                        </div>
                        <div className="flex gap-4">
                            {socialLinks.map((link: any, i: number) => (
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
                        <h4 className={`text-base sm:text-lg font-bold mb-6 sm:mb-8 tracking-tight ${textColor}`}>Quick Links</h4>
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
                        <h4 className={`text-base sm:text-lg font-bold mb-6 sm:mb-8 tracking-tight ${textColor}`}>Expertise</h4>
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
                        <h4 className={`text-base sm:text-lg font-bold mb-6 sm:mb-8 tracking-tight ${textColor}`}>Get in Touch</h4>
                        <ul className="space-y-4 sm:space-y-6">
                            {[
                                { icon: Mail, text: 'info@naturesboon.net', sub: 'General Inquiries', href: 'mailto:info@naturesboon.net' },
                                { icon: Phone, text: '+91-76967 71693', sub: 'WhatsApp Available', href: 'https://wa.me/917696771693' },
                                { icon: MapPin, text: 'Ludhiana, Punjab, India', sub: 'H.O. & Manufacturing', href: 'https://www.google.com/maps/dir/?api=1&destination=Nature%27s+Boon%2C+Ludhiana%2C+Punjab%2C+India' },
                            ].map((item, i) => (
                                <li key={i}>
                                    <a href={item.href} target={item.icon === MapPin ? "_blank" : "_self"} rel={item.icon === MapPin ? "noopener noreferrer" : undefined} className="flex gap-4 items-start group">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${backgroundColor === 'bg-white' ? 'bg-slate-100 group-hover:bg-nb-green group-hover:shadow-[0_4px_12px_rgba(43,238,108,0.3)]' : 'bg-white/5 group-hover:bg-nb-green group-hover:shadow-[0_4px_12px_rgba(43,238,108,0.3)]'}`}>
                                            <item.icon className={`w-4 h-4 transition-colors ${backgroundColor === 'bg-white' ? 'text-nb-green group-hover:text-white' : 'text-nb-green group-hover:text-slate-900'}`} />
                                        </div>
                                        <div>
                                            <span className={`block text-xs sm:text-sm font-semibold transition-colors ${textColor} group-hover:text-nb-green`}>{item.text}</span>
                                            <span className={`block text-[8px] sm:text-[10px] uppercase font-bold tracking-wider mt-1 sm:mt-1.5 transition-colors ${backgroundColor === 'bg-white' ? 'text-slate-400 group-hover:text-slate-600' : 'text-white/40 group-hover:text-white/80'}`}>{item.sub}</span>
                                        </div>
                                    </a>
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
};
