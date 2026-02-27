import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import BentoGridHero, { BentoGridHeroProps } from "@/components/sections/BentoGridHero";

export const BentoGridHeroBlockConfig: ComponentConfig<BentoGridHeroProps> = {
    label: "Bento Grid Hero",
    fields: {
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        primaryButtonText: { type: "text", contentEditable: true, label: "Primary Button Text" },
        primaryButtonHref: { type: "text", contentEditable: true, label: "Primary Button URL" },
        secondaryButtonText: { type: "text", contentEditable: true, label: "Secondary Button Text" },
        secondaryButtonHref: { type: "text", contentEditable: true, label: "Secondary Button URL" },
        stat1: {
            type: "object",
            label: "Stat Card 1 (Green)",
            objectFields: {
                value: { type: "text", contentEditable: true, label: "Value" },
                label: { type: "text", contentEditable: true, label: "Label" },
                sublabel: { type: "text", contentEditable: true, label: "Sub-label" },
            },
        },
        stat2: {
            type: "object",
            label: "Stat Card 2 (Dark)",
            objectFields: {
                value: { type: "text", contentEditable: true, label: "Value" },
                label: { type: "text", contentEditable: true, label: "Label" },
                sublabel: { type: "text", contentEditable: true, label: "Sub-label" },
            },
        },
        badge1: { type: "text", contentEditable: true, label: "Badge 1 Text" },
        badge2: { type: "text", contentEditable: true, label: "Badge 2 Text" },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
    },
    defaultProps: {
        headline: "Crafting Beauty with\nNature's Essence",
        subtext: "B2B personal care manufacturing powered by botanical innovation and global scale.",
        primaryButtonText: "Request a Sample",
        primaryButtonHref: "/contact",
        secondaryButtonText: "View Formulations",
        secondaryButtonHref: "/products",
        stat1: { value: "750+", label: "Monthly Tons Capacity", sublabel: "Across 4 Facilities" },
        stat2: { value: "1500+", label: "Unique Formulations", sublabel: "Ready for White Label" },
        badge1: "ISO 9001 Certified",
        badge2: "Established Since 2006",
    },
    render: (props: any) => <BentoGridHero {...props} />,
};

export default BentoGridHeroBlockConfig;
