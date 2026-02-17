import React from "react";
import { Section, BackgroundVariant } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";

export interface ServiceItem {
    title: string;
    description: string;
}

export interface ServiceGridProps {
    title?: string;
    items?: ServiceItem[];
    backgroundVariant?: BackgroundVariant;
    paddingTop?: string;
    paddingBottom?: string;
    flexDirection?: "row" | "col" | "row-reverse" | "col-reverse";
    flexJustify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    flexAlign?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: string;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
    title = "Our Professional Services",
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
            <Flex direction="col" align="center" gap="12">
                <Flex
                    direction="col"
                    align="center"
                    gap="4"
                    className="max-w-3xl text-center"
                >
                    <Typography variant="h2" color="slate-900">
                        {title}
                    </Typography>
                    <div className="w-24 h-2 bg-nb-green rounded-full shadow-sm" />
                </Flex>

                <Flex
                    direction={flexDirection}
                    justify={flexJustify}
                    align={flexAlign}
                    gap={gap}
                    wrap
                    className="w-full"
                >
                    {items.map((item, i) => (
                        <Flex
                            key={i}
                            direction="col"
                            align="start"
                            gap="6"
                            className="bg-white p-10 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex-1 min-w-[300px]"
                        >
                            <Flex
                                align="center"
                                justify="center"
                                className="w-16 h-16 bg-nb-green/10 rounded-2xl text-nb-green font-black text-xl"
                            >
                                {i + 1}
                            </Flex>
                            <Typography variant="h4" color="slate-900">
                                {item.title}
                            </Typography>
                            <Typography variant="small" color="slate-500">
                                {item.description}
                            </Typography>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    );
};
