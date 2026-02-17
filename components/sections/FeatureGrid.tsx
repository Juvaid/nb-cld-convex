"use client";

import React from "react";
import { Section } from "@/components/ui/Section";
import { Flex } from "@/components/ui/Flex";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/src/theme";

export type FeatureItem = {
    icon: string;
    title: string;
    description: string;
};

export type FeatureGridProps = {
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
                            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <Typography variant="h4" className={theme.textPrimary}>
                                {feature.title}
                            </Typography>
                            <Typography variant="small" className={theme.textSecondary}>
                                {feature.description}
                            </Typography>
                        </Flex>
                    ))}
                </div>
            </Flex>
        </Section>
    );
};
