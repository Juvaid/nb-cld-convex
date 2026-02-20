"use client";

import { Section } from "@/components/ui/Section";
import { Flex } from "@/components/ui/Flex";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NatureBoonHeroProps {
    title?: string;
    subtitle?: string;
    description?: any;
    buttonText?: string;
    buttonHref?: string;
    image?: string;
    paddingTop?: string;
    paddingBottom?: string;
    backgroundVariant?: "white" | "slate-50" | "slate-900" | "nb-green" | "glass-white" | "glass-dark";
}

export const NatureBoonHero = ({
    title = "Crafting Beauty with Nature's Essence",
    subtitle = "Nature's Boon Manufacturing",
    description = "Leading manufacturer and supplier of premium personal care products since 2006. Engineered for scalability and sustainability.",
    buttonText = "Get Quote",
    buttonHref = "#",
    image,
    paddingTop = "12",
    paddingBottom = "24",
    backgroundVariant = "white",
}: NatureBoonHeroProps) => {
    const siteSettings = useQuery(api.siteSettings.getSiteSettings);
    const finalLogoText = siteSettings?.logoText || "Nature's Boon";
    const finalSubtitle = siteSettings?.logoText ? `${siteSettings.logoText} Manufacturing` : subtitle;

    return (
        <Section
            variant={backgroundVariant}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
            className="relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nb-green/5 rounded-full blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4" />

            <Flex direction="row" mobileDirection="col" align="center" justify="between" gap="16">
                <div className="flex-1 max-w-2xl space-y-6 md:space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nb-green/10 border border-nb-green/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-nb-green animate-pulse" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-nb-green">
                            {finalSubtitle}
                        </span>
                    </div>

                    <h1 className="text-[2.75rem] md:text-7xl font-black text-slate-900 leading-[1.1] md:leading-[1.1] tracking-tight">
                        {title}
                    </h1>

                    <div className="text-sm md:text-xl text-slate-600 leading-relaxed max-w-xl font-medium" puck-editable="description">
                        {description}
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Link href={buttonHref}>
                            <Button size="xl" className="shadow-2xl shadow-nb-green/20">
                                {buttonText}
                            </Button>
                        </Link>
                        <Button variant="outline" size="xl">
                            Our Facilities
                        </Button>
                    </div>

                    <div className="flex items-center gap-8 pt-4 border-t border-slate-100">
                        <div>
                            <div className="text-2xl font-black text-slate-900">750+</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tons Capacity</div>
                        </div>
                        <div className="w-px h-10 bg-slate-100" />
                        <div>
                            <div className="text-2xl font-black text-slate-900">1500+</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Formulations</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative group">
                    <div className="relative z-10 aspect-[4/5] bg-white rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden ring-1 ring-slate-100 hover:scale-[1.02] transition-transform duration-700">
                        {image ? (
                            <img src={image} alt="Manufacturing Excellence" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center p-12 text-center">
                                <div className="space-y-4">
                                    <div className="w-20 h-20 bg-nb-green/10 rounded-3xl flex items-center justify-center mx-auto">
                                        <span className="text-3xl">🌿</span>
                                    </div>
                                    <div className="text-slate-400 font-bold italic">Brand image placeholder</div>
                                </div>
                            </div>
                        )}

                        {/* Float Badge */}
                        <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-6 rounded-[32px] border border-white/20 shadow-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                <span className="text-2xl">✓</span>
                            </div>
                            <div>
                                <div className="text-sm font-black text-slate-900 uppercase">ISO Certified</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quality Guaranteed</div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-nb-green rounded-full -z-10 mix-blend-multiply opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-slate-200 rounded-full -z-10 opacity-50 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                </div>
            </Flex>
        </Section>
    );
};
