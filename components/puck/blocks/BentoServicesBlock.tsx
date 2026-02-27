import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import BentoServices, { BentoServicesProps } from "@/components/sections/BentoServices";

export const BentoServicesBlockConfig: ComponentConfig<BentoServicesProps> = {
    label: "Bento Services",
    fields: {
        eyebrow: { type: "text", contentEditable: true, label: "Eyebrow Badge" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
        cards: {
            type: "array",
            label: "Service Cards",
            getItemSummary: (item: any) => item.title || "Card",
            arrayFields: {
                icon: {
                    type: "select",
                    label: "Icon",
                    options: [
                        { label: "Flask (Formulation)", value: "flask" },
                        { label: "Shield (Quality)", value: "shield" },
                        { label: "Leaf (Botanical)", value: "leaf" },
                        { label: "Globe (Global)", value: "globe" },
                        { label: "Package (Packaging)", value: "package" },
                        { label: "Chart (Scale)", value: "chart" },
                    ],
                },
                title: { type: "text", contentEditable: true, label: "Title" },
                description: { type: "textarea", contentEditable: true, label: "Description" },
                accent: { type: "radio", label: "Green Accent Card", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
            },
        },
    },
    defaultProps: {
        eyebrow: "Our Capabilities",
        headline: "Manufacturing Excellence\nat Every Scale",
        subtext: "From first formula to final shelf, we cover every aspect of personal care manufacturing.",
        cards: [
            { icon: "flask", title: "Custom Formulation", description: "Work with our R&D team to create exclusive formulas tailored to your brand's vision.", accent: false },
            { icon: "shield", title: "Quality Assurance", description: "ISO 9001, GMP, and COSMOS certified. Every batch rigorously tested.", accent: true },
            { icon: "leaf", title: "Botanical Sourcing", description: "Premium plant extracts from certified organic farms with full traceability.", accent: false },
            { icon: "package", title: "Private Labelling", description: "Full-service white-label from filling to finished, shelf-ready product.", accent: false },
            { icon: "globe", title: "Global Logistics", description: "Reliable delivery to 50+ countries with customs documentation and regulatory support.", accent: false },
            { icon: "chart", title: "Scale on Demand", description: "From 500-unit test batches to 750-ton monthly runs — scale as your brand grows.", accent: false },
        ],
    },
    render: (props: any) => <BentoServices {...props} />,
};

export default BentoServicesBlockConfig;
