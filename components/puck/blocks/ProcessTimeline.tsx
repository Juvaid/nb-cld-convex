import React from "react";
import { Section, BackgroundVariant } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";

export interface ProcessStep {
    title: string;
    description: string;
}

export interface ProcessTimelineProps {
    title?: string;
    steps?: ProcessStep[];
    backgroundVariant?: BackgroundVariant;
    paddingTop?: string;
    paddingBottom?: string;
    flexDirection?: "row" | "col" | "row-reverse" | "col-reverse";
    flexJustify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    flexAlign?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: string;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
    title = "Precision Manufacturing",
    steps = [],
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

                <div className="relative w-full">
                    {/* Horizontal Line for Desktop */}
                    <div className="absolute top-10 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block" />

                    <Flex
                        direction={flexDirection}
                        justify={flexJustify}
                        align={flexAlign}
                        gap={gap}
                        wrap
                        className="w-full relative z-10"
                    >
                        {steps.map((step, i) => (
                            <Flex
                                key={i}
                                direction="col"
                                align="center"
                                gap="6"
                                className="text-center group flex-1 min-w-[280px]"
                            >
                                <Flex
                                    align="center"
                                    justify="center"
                                    className="w-20 h-20 bg-nb-green text-slate-900 shadow-[0_15px_30px_rgba(43,238,108,0.3)] rounded-full text-3xl font-black group-hover:scale-110 transition-transform ring-8 ring-white"
                                >
                                    {i + 1}
                                </Flex>
                                <div className="space-y-3">
                                    <Typography
                                        variant="h4"
                                        color="slate-900"
                                        className="group-hover:text-nb-green transition-colors"
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography variant="small" color="slate-500">
                                        {step.description}
                                    </Typography>
                                </div>
                            </Flex>
                        ))}
                    </Flex>
                </div>
            </Flex>
        </Section>
    );
};
