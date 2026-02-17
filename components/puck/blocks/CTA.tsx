import React from "react";
import { Section, BackgroundVariant } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { Button } from "../../ui/Button";

export interface CTAProps {
    title?: string;
    buttonText?: string;
    backgroundVariant?: BackgroundVariant;
    paddingTop?: string;
    paddingBottom?: string;
    flexDirection?: "row" | "col" | "row-reverse" | "col-reverse";
    flexJustify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    flexAlign?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: string;
}

export const CTA: React.FC<CTAProps> = ({
    title = "Ready to build your brand?",
    buttonText = "Request Consultation",
    backgroundVariant,
    paddingTop,
    paddingBottom,
    flexDirection = "col",
    flexAlign = "center",
    flexJustify = "center",
    gap = "12",
}) => {
    return (
        <Section
            variant={backgroundVariant}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
        >
            <Flex
                direction={flexDirection}
                align={flexAlign}
                justify={flexJustify}
                gap={gap}
                className="bg-slate-900 p-20 rounded-[80px] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] w-full text-center"
            >
                {/* Animated Bg Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-nb-green/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-nb-green/5 rounded-full blur-[100px]" />

                <Typography
                    variant="h2"
                    color="white"
                    className="relative z-10 max-w-2xl !md:text-6xl !leading-tight"
                >
                    {title}
                </Typography>

                <Button variant="primary" size="xl" className="relative z-10">
                    {buttonText}
                </Button>
            </Flex>
        </Section>
    );
};
