"use client";

import React from "react";
import { Section } from "@/components/ui/Section";
import { Flex } from "@/components/ui/Flex";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/src/theme";

export type FeatureItem = {
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
    title: string;
    description: string;
    showButton?: boolean;
    buttonText?: string;
    buttonLink?: string;
};

export type FeatureGridProps = {
    id?: string;
    heading: string;
    subheading: string;
    features: FeatureItem[];
    columns: "2" | "3" | "4";
    backgroundVariant?: any;
    paddingTop?: string;
    paddingBottom?: string;
};

export const FeatureGrid = ({
    heading,
    subheading,
    features = [],
    columns = "3",
    ...sectionProps
}: FeatureGridProps) => {
    const gridCols = {
        "2": "grid-cols-1 md:grid-cols-2",
        "3": "grid-cols-1 md:grid-cols-3",
        "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[columns];

    return (
        <Section {...sectionProps}>
            <Flex direction="col" align="center" gap="12">
                <div className="text-center max-w-3xl mx-auto mb-8">
                    {heading && (
                        <Typography variant="h2" align="center" className={theme.textPrimary}>
                            {heading}
                        </Typography>
                    )}
                    {subheading && (
                        <Typography variant="body" align="center" className={`${theme.textSecondary} mt-4`}>
                            {subheading}
                        </Typography>
                    )}
                </div>

                <div className={`grid ${gridCols} gap-8 lg:gap-10 w-full`}>
                    {features.map((feature, i) => (
                        <Flex
                            key={i}
                            direction="col"
                            align="center"
                            gap="6"
                            className={`${theme.surface} ${theme.radius} ${theme.shadow} p-10 text-center group`}
                        >
                            {feature.showMedia !== false && (
                                <div className="mb-2 group-hover:scale-110 transition-transform duration-300 w-full flex justify-center">
                                    {feature.mediaType === "image" && feature.mediaImage ? (
                                        <div className="w-20 h-20 rounded-[24px] overflow-hidden border border-slate-900/5 shadow-inner">
                                            <img
                                                src={feature.mediaImage.startsWith("http") ? feature.mediaImage : `/api/storage/${feature.mediaImage}`}
                                                className="w-full h-full object-cover"
                                                alt={feature.title}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-5xl">
                                            {feature.mediaIcon || "✨"}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="space-y-3">
                                <Typography variant="h4" className={theme.textPrimary}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="small" className={theme.textSecondary}>
                                    {feature.description}
                                </Typography>
                            </div>

                            {feature.showButton && feature.buttonText && (
                                <div className="mt-4 pt-4 border-t border-slate-900/5 w-full">
                                    <a
                                        href={feature.buttonLink || "#"}
                                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-nb-green hover:text-slate-900 transition-colors"
                                    >
                                        {feature.buttonText}
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </a>
                                </div>
                            )}
                        </Flex>
                    ))}
                </div>
            </Flex>
        </Section>
    );
};
