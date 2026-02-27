import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import LayeredDepthHero, { LayeredDepthHeroProps } from "@/components/sections/LayeredDepthHero";
import { ImagePicker } from "@/components/ImagePicker";

export const LayeredDepthHeroBlockConfig: ComponentConfig<LayeredDepthHeroProps> = {
    label: "Layered Depth Hero",
    fields: {
        eyebrow: { type: "text", contentEditable: true, label: "Eyebrow" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        primaryButtonText: { type: "text", contentEditable: true, label: "Primary Button Text" },
        primaryButtonHref: { type: "text", contentEditable: true, label: "Primary Button URL" },
        secondaryButtonText: { type: "text", contentEditable: true, label: "Secondary Button Text" },
        secondaryButtonHref: { type: "text", contentEditable: true, label: "Secondary Button URL" },
        stat1Value: { type: "text", contentEditable: true, label: "Stat 1 Value" },
        stat1Label: { type: "text", contentEditable: true, label: "Stat 1 Label" },
        stat2Value: { type: "text", contentEditable: true, label: "Stat 2 Value" },
        stat2Label: { type: "text", contentEditable: true, label: "Stat 2 Label" },
        backgroundImage: {
            type: "custom",
            label: "Background Image",
            render: ({ value, onChange }: any) => <ImagePicker value={value} onChange={onChange} />,
        },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
    },
    defaultProps: {
        eyebrow: "From Formula to Finished Product",
        headline: "Bespoke Manufacturing for the World's Most Discerning Brands.",
        subtext: "Eighteenth-century standards, twenty-first-century science. End-to-end personal care manufacturing at scale.",
        primaryButtonText: "Start Your Project",
        primaryButtonHref: "/contact",
        secondaryButtonText: "View Our Services",
        secondaryButtonHref: "/services",
        stat1Value: "18+",
        stat1Label: "Years Excellence",
        stat2Value: "1,500+",
        stat2Label: "Proprietary Formulas",
        backgroundImage: "",
    },
    render: (props: any) => <LayeredDepthHero {...props} />,
};

export default LayeredDepthHeroBlockConfig;
