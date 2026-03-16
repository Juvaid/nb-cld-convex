"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MegaMenu, MegaMenuConfig } from "./MegaMenu";

import { Button } from "@/components/ui/Button";

import Image from "next/image";

import { AnimatedLogo } from "@/components/animations/AnimatedLogo";

export interface NavLink {
    label: string;
    href: string;
    megaMenu?: MegaMenuConfig;
}

export interface SiteHeaderProps {
    logoText?: string;
    logoImage?: string;
    links?: NavLink[];
    contactText?: string;
    initialSettings?: any;
}

/**
 * Inner component to handle live updates on the client.
 */
/**
 * NavItem component to handle Mega Menu hover logic.
 */
function NavItem({ link, pathname }: { link: NavLink, pathname: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const closeTimer = useRef<NodeJS.Timeout | null>(null);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleMouseEnter = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimer.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    if (!link.megaMenu?.enabled) {
        return (
            <Link
                href={link.href || "#"}
                className={cn(
                    "hover:text-nb-green transition-colors relative group py-2",
                    pathname === link.href ? "text-nb-green" : ""
                )}
            >
                {link.label}
                <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-nb-green transform origin-left transition-transform duration-300",
                    pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )} />
            </Link>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className={cn(
                    "hover:text-nb-green transition-colors relative group py-2 flex items-center gap-1",
                    pathname === link.href ? "text-nb-green" : ""
                )}
            >
                {link.label}
                <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-nb-green transform origin-left transition-transform duration-300",
                    pathname === link.href || isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <MegaMenu
                        config={link.megaMenu}
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function LiveHeaderSettings({ onSettingsFound, initialSettings }: { onSettingsFound: (s: any) => void, initialSettings: any }) {
    const liveSettings = useQuery(api.siteSettings.getSiteSettings);
    useEffect(() => {
        if (liveSettings) onSettingsFound(liveSettings);
    }, [liveSettings, onSettingsFound]);
    return null;
}

export function SiteHeader({
    logoText: propLogoText,
    logoImage: propLogoImage,
    links: propLinks,
    contactText: propContactText,
    initialSettings,
}: SiteHeaderProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSettings, setCurrentSettings] = useState(initialSettings);

    const siteSettings = currentSettings || initialSettings;
    const isLoading = siteSettings === undefined;

    // Default fallbacks
    const defaultLogoText = "Nature's Boon";
    const defaultLinks = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Products", href: "/products" },
        // { label: "Blogs", href: "/blogs" },
    ];
    const defaultPortalText = "Blogs";
    const defaultContactText = "Contact Sales";

    // Priority: DB Settings > Default Fallbacks (Props purely for visual overrides in editor)
    const logoText = siteSettings?.logoText || propLogoText || defaultLogoText;
    const logoImage = siteSettings?.logoImage || propLogoImage;
    const links = siteSettings?.navLinks || propLinks || defaultLinks;
    const contactText = siteSettings?.contactText || propContactText || defaultContactText;

    return (
        <header className="bg-slate-50/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/50">
            {typeof window !== "undefined" && (
                <LiveHeaderSettings onSettingsFound={setCurrentSettings} initialSettings={initialSettings} />
            )}
            <div className="container mx-auto px-4 h-14 md:h-16 lg:h-20 flex items-center justify-between transition-all duration-300">
                <Link href="/" className="font-semibold text-2xl tracking-tight text-slate-900 flex items-center gap-3 group">
                    {isLoading ? (
                        <>
                            <div className="w-10 h-10 bg-slate-200/60 rounded-xl animate-pulse" />
                            <div className="hidden sm:block w-32 h-6 bg-slate-200/60 rounded animate-pulse" />
                        </>
                    ) : logoImage ? (
                        <Image 
                            src={logoImage.startsWith('http') || logoImage.startsWith('/') ? logoImage : `/api/storage/${logoImage}`} 
                            alt={logoText} 
                            width={200}
                            height={60}
                            priority
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                        />
                    ) : (
                        <AnimatedLogo />
                    )}
                    {!isLoading && (
                        <span className="hidden sm:inline bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-bold tracking-tight font-logo">
                            {logoText}
                        </span>
                    )}
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 items-center">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="w-16 h-4 bg-slate-200/60 rounded animate-pulse" />
                        ))
                    ) : (
                        links.map((link: NavLink, i: number) => (
                            <NavItem key={i} link={link} pathname={pathname} />
                        ))
                    )}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {isLoading ? (
                        <div className="w-28 h-10 rounded-xl bg-slate-200/60 animate-pulse" />
                    ) : (
                        <Link href="/contact">
                            <Button variant="primary" size="md">
                                {contactText}
                            </Button>
                        </Link>
                    )}
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
                                className={`text-xl font-semibold ${pathname === link.href ? "text-nb-green" : "text-slate-900"}`}
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
