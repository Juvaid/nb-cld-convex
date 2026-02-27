import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import StackedCardHero, { StackedCardHeroProps } from "@/components/sections/StackedCardHero";

export const StackedCardHeroBlockConfig: ComponentConfig<StackedCardHeroProps> = {
    label: "Stacked Card Hero",
    fields: {
        eyebrow: { type: "text", contentEditable: true, label: "Eyebrow Badge" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
        cards: {
            type: "array",
            label: "Cards",
            getItemSummary: (item: any) => item.headline || "Card",
            arrayFields: {
                badge: { type: "text", contentEditable: true, label: "Badge" },
                headline: { type: "text", contentEditable: true, label: "Card Headline" },
                description: { type: "textarea", contentEditable: true, label: "Description" },
                buttonText: { type: "text", contentEditable: true, label: "Button Text" },
                buttonHref: { type: "text", contentEditable: true, label: "Button URL" },
                accentColor: {
                    type: "select",
                    label: "Accent Color",
                    options: [
                        { label: "Brand Green", value: "#157f3c" },
                        { label: "Deep Green", value: "#0d5a2a" },
                        { label: "Sage", value: "#658671" },
                        { label: "Slate", value: "#334155" },
                    ],
                },
            },
        },
    },
    defaultProps: {
        eyebrow: "Premium Contract Manufacturing",
        headline: "Everything Your Brand Needs, Under One Roof",
        subtext: "From custom formulation to sustainable packaging and global logistics — end-to-end manufacturing solutions.",
        cards: [
            { badge: "Private Label", headline: "Hydrating Body Wash", description: "Rich, skin-softening botanical blend. 50+ scent profiles, fully customisable packaging.", buttonText: "View Details", buttonHref: "/products", accentColor: "#157f3c" },
            { badge: "Organic Collection", headline: "Volumizing Shampoo", description: "Organic botanical blend with biotin complex. Zero sulphates, 100% vegan.", buttonText: "View Details", buttonHref: "/products", accentColor: "#0d5a2a" },
            { badge: "Premium Formula", headline: "Radiance Serum", description: "High-performance Vitamin C with hyaluronic acid base. Clinical-grade at scale.", buttonText: "View Details", buttonHref: "/products", accentColor: "#658671" },
        ],
    },
    render: (props: any) => <StackedCardHero {...props} />,
};

export default StackedCardHeroBlockConfig;
