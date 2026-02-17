import React from "react";
import { Section, BackgroundVariant } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";

export interface FeatureItem {
    title: string;
    description: string;
}

export interface FeatureGridProps {
    items?: FeatureItem[];
    backgroundVariant?: BackgroundVariant;
    paddingTop?: string;
    paddingBottom?: string;
    flexDirection?: "row" | "col" | "row-reverse" | "col-reverse";
    flexJustify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    flexAlign?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: string;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
    items = [],
    backgroundVariant,
    paddingTop,
    paddingBottom,
    flexDirection = "row",
    flexJustify = "center",
    flexAlign = "stretch",
    gap = "8",
}) => {
    return (
        <Section
            variant={backgroundVariant}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
        >
            <Flex
                direction={flexDirection}
                justify={flexJustify}
                align={flexAlign}
                gap={gap}
                wrap
                className="max-w-7xl mx-auto"
            >
                {items.map((item, i) => (
                    <Flex
                        key={i}
                        direction="col"
                        gap="4"
                        className="bg-white p-10 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl transition-all flex-1 min-w-[280px]"
                    >
                        <Typography variant="h4" color="slate-900">
                            {item.title}
                        </Typography>
                        <Typography variant="body" color="slate-600">
                            {item.description}
                        </Typography>
                    </Flex>
                ))}
            </Flex>
        </Section>
    );
};
