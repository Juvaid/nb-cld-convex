import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import JourneyHero, { JourneyHeroProps } from "@/components/sections/JourneyHero";

export const JourneyHeroBlockConfig: ComponentConfig<JourneyHeroProps> = {
    label: "Journey Hero",
    fields: {
        eyebrow: { type: "text", contentEditable: true, label: "Eyebrow Badge" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        primaryButtonText: { type: "text", contentEditable: true, label: "Button Text" },
        primaryButtonHref: { type: "text", contentEditable: true, label: "Button URL" },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
        steps: {
            type: "array",
            label: "Journey Steps",
            getItemSummary: (item: any) => item.title || "Step",
            arrayFields: {
                icon: {
                    type: "select",
                    label: "Icon",
                    options: [
                        { label: "Leaf", value: "leaf" },
                        { label: "Flask", value: "flask" },
                        { label: "Factory", value: "factory" },
                        { label: "Truck", value: "truck" },
                        { label: "Star", value: "star" },
                    ],
                },
                title: { type: "text", contentEditable: true, label: "Step Title" },
                description: { type: "textarea", contentEditable: true, label: "Step Description" },
            },
        },
    },
    defaultProps: {
        eyebrow: "The Nature's Boon Journey",
        headline: "From Seed to Shelf, Every Step Matters",
        subtext: "We obsess over every stage of the manufacturing process so your brand can shine.",
        primaryButtonText: "Explore Our Process",
        primaryButtonHref: "/services",
        steps: [
            { icon: "leaf", title: "Botanical Sourcing", description: "Premium plant extracts sourced from certified organic farms worldwide." },
            { icon: "flask", title: "R&D Formulation", description: "Our scientists blend traditional herbology with cutting-edge molecular science." },
            { icon: "factory", title: "GMP Manufacturing", description: "ISO 9001-certified facilities producing 750+ tons monthly across 4 plants." },
            { icon: "truck", title: "Global Delivery", description: "Reliable logistics to 50+ countries with full traceability at every step." },
        ],
    },
    render: (props: any) => <JourneyHero {...props} />,
};

export default JourneyHeroBlockConfig;
