import React from "react";
import { Section, BackgroundVariant } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";

export interface BenefitItem {
    title: string;
    description: string;
}

export interface IconBenefitsProps {
    title?: string;
    benefits?: BenefitItem[];
    backgroundVariant?: BackgroundVariant;
    paddingTop?: string;
    paddingBottom?: string;
    flexDirection?: "row" | "col" | "row-reverse" | "col-reverse";
    flexJustify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    flexAlign?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: string;
}

export const IconBenefits: React.FC<IconBenefitsProps> = ({
    title = "Why Partner With Us?",
    benefits = [],
    backgroundVariant,
    paddingTop,
    paddingBottom,
    flexDirection = "row",
    flexJustify = "center",
    flexAlign = "stretch",
    gap = "10",
}) => {
    return (
        <Section
            variant={backgroundVariant}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
        >
            <Flex direction="col" align="center" gap="16">
                <Typography variant="h2" align="center" color="slate-900">
                    {title}
                </Typography>

                <Flex
                    direction={flexDirection}
                    justify={flexJustify}
                    align={flexAlign}
                    gap={gap}
                    wrap
                    className="w-full"
                >
                    {benefits.map((benefit, i) => (
                        <Flex
                            key={i}
                            gap="6"
                            className="p-8 rounded-[32px] bg-white border border-slate-50 shadow-sm hover:shadow-xl border-t-4 border-t-nb-green flex-1 min-w-[320px]"
                        >
                            <Flex
                                align="center"
                                justify="center"
                                className="w-14 h-14 bg-nb-green/10 rounded-full flex-shrink-0 text-nb-green shadow-inner"
                            >
                                <Flex
                                    align="center"
                                    justify="center"
                                    className="w-7 h-7 border-4 border-current rounded-full font-black text-xs"
                                >
                                    {i + 1}
                                </Flex>
                            </Flex>
                            <Flex direction="col" gap="3">
                                <Typography variant="h6" color="slate-900">
                                    {benefit.title}
                                </Typography>
                                <Typography variant="small" color="slate-500">
                                    {benefit.description}
                                </Typography>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    );
};
