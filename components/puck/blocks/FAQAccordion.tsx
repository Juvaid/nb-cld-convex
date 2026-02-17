import React from "react";
import { Section, BackgroundVariant } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQAccordionProps {
    title?: string;
    questions?: FAQItem[];
    backgroundVariant?: BackgroundVariant;
    paddingTop?: string;
    paddingBottom?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
    title = "Industrial FAQ",
    questions = [],
    backgroundVariant,
    paddingTop,
    paddingBottom,
}) => {
    return (
        <Section
            variant={backgroundVariant}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
        >
            <Flex
                direction="col"
                align="center"
                gap="16"
                className="max-w-4xl mx-auto"
            >
                <Flex direction="col" align="center" gap="4" className="text-center">
                    <Typography variant="h2" color="slate-900">
                        {title}
                    </Typography>
                    <Typography variant="detail" color="slate-500">
                        Everything you need to know about partnering with us
                    </Typography>
                </Flex>

                <Flex direction="col" gap="4" className="w-full">
                    {questions.map((item, i) => (
                        <Flex
                            key={i}
                            direction="col"
                            align="stretch"
                            className="bg-white border border-slate-100 rounded-[32px] overflow-hidden group hover:border-nb-green transition-all shadow-sm shadow-slate-100"
                        >
                            <Flex
                                justify="between"
                                className="p-10 cursor-pointer group-hover:text-nb-green transition-colors"
                            >
                                <Typography variant="h6">{item.question}</Typography>
                                <Flex
                                    align="center"
                                    justify="center"
                                    className="w-10 h-10 rounded-full bg-slate-50 text-nb-green font-light group-hover:bg-nb-green group-hover:text-slate-900 transition-all"
                                >
                                    +
                                </Flex>
                            </Flex>
                            <div className="px-10 pb-10">
                                <Typography variant="small" color="slate-600">
                                    {item.answer}
                                </Typography>
                            </div>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    );
};
