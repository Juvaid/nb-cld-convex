import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import KineticMarqueeHero, { KineticMarqueeHeroProps } from "@/components/sections/KineticMarqueeHero";

export const KineticMarqueeHeroBlockConfig: ComponentConfig<KineticMarqueeHeroProps> = {
    label: "Kinetic Marquee Hero",
    fields: {
        eyebrow: { type: "text", contentEditable: true, label: "Eyebrow Badge" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        highlightWord: { type: "text", contentEditable: true, label: "Highlight Word/Phrase (green)" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        primaryButtonText: { type: "text", contentEditable: true, label: "Primary Button Text" },
        primaryButtonHref: { type: "text", contentEditable: true, label: "Primary Button URL" },
        secondaryButtonText: { type: "text", contentEditable: true, label: "Secondary Button Text" },
        secondaryButtonHref: { type: "text", contentEditable: true, label: "Secondary Button URL" },
        stat1Value: { type: "text", contentEditable: true, label: "Stat 1 Value" },
        stat1Label: { type: "text", contentEditable: true, label: "Stat 1 Label" },
        stat2Value: { type: "text", contentEditable: true, label: "Stat 2 Value" },
        stat2Label: { type: "text", contentEditable: true, label: "Stat 2 Label" },
        marqueeItems: {
            type: "array",
            label: "Marquee Items",
            getItemSummary: (item: any) => item || "Item",
            arrayFields: { "": { type: "text", contentEditable: true, label: "Category Name" } } as any,
        },
        marqueeSpeed: {
            type: "number",
            label: "Marquee Speed (seconds, higher = slower)",
        },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
    },
    defaultProps: {
        eyebrow: "Premium B2B Manufacturing",
        headline: "Scale Your Brand with",
        highlightWord: "Nature's Power",
        subtext: "1500+ proven formulations. ISO certified. Green chemistry. Your vision, our expertise.",
        primaryButtonText: "Start Your Project",
        primaryButtonHref: "/contact",
        secondaryButtonText: "Browse Formulations",
        secondaryButtonHref: "/products",
        stat1Value: "750+",
        stat1Label: "Monthly Tons",
        stat2Value: "1500+",
        stat2Label: "Formulations",
        marqueeItems: ["Skin Care", "Hair Care", "Body Wash", "Sun Care", "Serums", "Oils", "Balms", "Shampoo", "Conditioner", "Face Wash", "Toners", "Eye Cream", "Lip Care"],
        marqueeSpeed: 35,
    },
    render: (props: any) => <KineticMarqueeHero {...props} />,
};

export default KineticMarqueeHeroBlockConfig;
