"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/Button";

export interface NavLink {
    label: string;
    href: string;
}

export interface SiteHeaderProps {
    logoText?: string;
    logoImage?: string;
    links?: NavLink[];
    contactText?: string;
}

export function SiteHeader({
    logoText: propLogoText,
    logoImage: propLogoImage,
    links: propLinks,
    contactText: propContactText,
}: SiteHeaderProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fetch settings from Convex
    const siteSettings = useQuery(api.siteSettings.getSiteSettings);

    // Default fallbacks
    const defaultLogoText = "NatureBoon";
    const defaultLinks = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Products", href: "/products" },
        { label: "Blogs", href: "/blogs" },
    ];
    const defaultPortalText = "Blogs";
    const defaultContactText = "Contact Us";

    // Priority: DB Settings > Default Fallbacks (Props purely for visual overrides in editor)
    // Priority: DB Settings > Default Fallbacks (Props purely for visual overrides in editor)
    const logoText = siteSettings?.logoText || propLogoText || defaultLogoText;
    const logoImage = siteSettings?.logoImage || propLogoImage;
    const links = siteSettings?.navLinks || propLinks || defaultLinks;
    const contactText = siteSettings?.contactText || propContactText || defaultContactText;

    return (
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/50">
            <div className="container mx-auto px-4 h-14 md:h-16 lg:h-20 flex items-center justify-between transition-all duration-300">
                <Link href="/" className="font-bold text-2xl tracking-tight text-slate-900 flex items-center gap-3 group">
                    {logoImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={logoImage} alt={logoText} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-nb-green-soft to-nb-green-deep rounded-xl shadow-[0_4px_12px_rgba(45,90,67,0.2)] flex items-center justify-center text-white font-black group-hover:scale-105 transition-transform">
                            NB
                        </div>
                    )}
                    <span className="hidden sm:inline bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-black tracking-tight font-logo">
                        {logoText}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
                    {links.map((link: NavLink, i: number) => (
                        <Link
                            key={i}
                            href={link.href || "#"}
                            className={`hover:text-nb-green transition-colors relative group py-2 ${pathname === link.href ? "text-nb-green" : ""
                                }`}
                        >
                            {link.label}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-nb-green transform origin-left transition-transform duration-300 ${pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                }`} />
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/contact">
                        <Button variant="primary" size="md" className="shadow-[0_10px_20px_rgba(43,238,108,0.2)]">
                            {contactText}
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:text-nb-green transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-14 left-0 w-full bg-white border-b shadow-xl px-4 py-8 z-40 animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col gap-6 mb-8">
                        {links.map((link: NavLink, i: number) => (
                            <Link
                                key={i}
                                href={link.href || "#"}
                                className={`text-xl font-bold ${pathname === link.href ? "text-nb-green" : "text-slate-900"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-col gap-4">
                        <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="primary" fullWidth size="lg">
                                {contactText}
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
