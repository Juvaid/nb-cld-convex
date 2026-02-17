import React from "react";
import { Section, BackgroundVariant } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { Button } from "../../ui/Button";

export interface SuccessStoryItem {
    metrics: string;
    brand: string;
    product: string;
    description: string;
}

export interface SuccessStoryProps {
    title?: string;
    stories?: SuccessStoryItem[];
    backgroundVariant?: BackgroundVariant;
    paddingTop?: string;
    paddingBottom?: string;
    flexDirection?: "row" | "col" | "row-reverse" | "col-reverse";
    flexJustify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    flexAlign?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: string;
}

export const SuccessStory: React.FC<SuccessStoryProps> = ({
    title = "Helping Global Brands Redefine Beauty Standards",
    stories = [],
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
            <Flex direction="col" gap="16">
                <Typography variant="h2" color="slate-900" className="max-w-xl">
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
                    {stories.map((story, i) => (
                        <Flex
                            key={i}
                            direction="col"
                            justify="between"
                            className="bg-white p-12 rounded-[48px] shadow-sm hover:shadow-2xl border border-slate-50 transition-all flex-1 min-w-[340px]"
                        >
                            <Flex direction="col" gap="6">
                                <Flex align="center" gap="3">
                                    <div className="w-8 h-[2px] bg-nb-green" />
                                    <Typography variant="detail" color="nb-green">
                                        {story.metrics}
                                    </Typography>
                                </Flex>
                                <div className="space-y-2">
                                    <Typography variant="h3" color="slate-900">
                                        {story.brand}
                                    </Typography>
                                    <Typography variant="small" color="slate-400" className="italic font-bold">
                                        {story.product}
                                    </Typography>
                                </div>
                                <Typography variant="body" color="slate-600">
                                    {story.description}
                                </Typography>
                            </Flex>
                            <div className="mt-10 pt-8 border-t border-slate-50">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<span className="text-lg">→</span>}
                                    className="text-nb-green p-0 hover:bg-transparent hover:translate-x-2"
                                >
                                    EXPLORE CASE STUDY
                                </Button>
                            </div>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    );
};
