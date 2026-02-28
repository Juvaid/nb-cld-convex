import React from "react";
import Image from "next/image";
import { ComponentConfig } from "@puckeditor/core";
import { sharedFields } from "../fields/shared";
import { ImagePicker } from "@/components/ImagePicker";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export interface HomeEssentialsProps {
    heroHeading: string;
    heroSubheading: string;
    heroBackgroundImage: string;
    featuresHeading: string;
    features: {
        title: string;
        description: string;
    }[];
    ctaHeading: string;
    ctaButtonText: string;
    ctaButtonLink: string;
    paddingTop?: string;
    paddingBottom?: string;
}

export const HomeEssentialsBlock = ({
    heroHeading,
    heroSubheading,
    heroBackgroundImage,
    featuresHeading,
    features,
    ctaHeading,
    ctaButtonText,
    ctaButtonLink,
    paddingTop = "py-0",
    paddingBottom = "pb-0",
}: HomeEssentialsProps) => {
    return (
        <div className={`w-full flex flex-col ${paddingTop} ${paddingBottom}`}>
            {/* Hero Section */}
            <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                {heroBackgroundImage && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={heroBackgroundImage}
                            alt="Hero Background"
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30" />
                    </div>
                )}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                    <span className="text-nb-green font-black tracking-widest uppercase text-sm mb-4 px-4 py-1.5 rounded-full border border-nb-green/30 bg-nb-green/10 backdrop-blur-md">
                        Nature{"'"}s Boon Excellence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 max-w-4xl leading-[1.1]">
                        {heroHeading}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mb-10 leading-relaxed">
                        {heroSubheading}
                    </p>
                    <Link
                        href={ctaButtonLink}
                        className="group inline-flex items-center gap-3 bg-nb-green text-slate-900 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(43,238,108,0.3)]"
                    >
                        {ctaButtonText}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full bg-slate-50 py-24 px-6 relative z-20 -mt-10 rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            {featuresHeading}
                        </h2>
                        <div className="w-24 h-1.5 bg-nb-green mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-[32px] bg-white border border-slate-100 hover:border-nb-green/30 hover:bg-slate-50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
                            >
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-nb-green/10 transition-colors">
                                    <CheckCircle2 className="w-7 h-7 text-nb-green" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section className="w-full bg-slate-900 py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-nb-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
                        {ctaHeading}
                    </h2>
                    <Link
                        href={ctaButtonLink}
                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-nb-green hover:text-slate-900 transition-all duration-300"
                    >
                        {ctaButtonText}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export const HomeEssentialsBlockConfig: ComponentConfig<HomeEssentialsProps> = {
    fields: {
        heroHeading: { type: "text" },
        heroSubheading: { type: "textarea" },
        heroBackgroundImage: {
            type: "custom",
            render: ({ value, onChange }) => (
                <ImagePicker value={value} onChange={onChange} />
            ),
        },
        featuresHeading: { type: "text" },
        features: {
            type: "array",
            getItemSummary: (item) => item.title || "Feature",
            arrayFields: {
                title: { type: "text" },
                description: { type: "textarea" },
            },
        },
        ctaHeading: { type: "text" },
        ctaButtonText: { type: "text" },
        ctaButtonLink: { type: "text" },
        ...sharedFields,
    },
    defaultProps: {
        heroHeading: "Premium Personal Care Manufacturing",
        heroSubheading: "Scale your brand with our state-of-the-art facilities, green chemistry, and 15+ years of ISO-certified excellence.",
        heroBackgroundImage: "https://images.unsplash.com/photo-1615397323608-662580a1811e?q=80&w=2000&auto=format&fit=crop",
        featuresHeading: "Our Core Capabilities",
        features: [
            {
                title: "OEM Manufacturing",
                description: "Full-scale production using your proprietary formulations with rigorous quality control protocols.",
            },
            {
                title: "Private Label Solutions",
                description: "Ready-to-market formulations tailored to your brand identity with customizable packaging.",
            },
            {
                title: "Contract Manufacturing",
                description: "Large-scale production capabilities to meet the high-volume demands of global brands.",
            },
        ],
        ctaHeading: "Ready to start your production journey?",
        ctaButtonText: "Request a Quote",
        ctaButtonLink: "/contact",
    },
    render: (props) => <HomeEssentialsBlock {...props} />,
};
