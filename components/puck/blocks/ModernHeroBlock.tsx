import { ComponentConfig } from "@puckeditor/core";
import ModernHero from "../../scraped/Hero";
import { ImagePicker } from "@/components/ImagePicker";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface ModernHeroBlockProps extends SharedFieldProps {
    badgeText?: string;
    title?: string;
    titleGradient?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    stats?: {
        value: string;
        label: string;
    }[];
    cards?: {
        icon: string;
        title: string;
        desc: string;
    }[];
    useGlobalStats?: boolean;
    alignment?: "left" | "center" | "right";
}

export const ModernHeroBlockConfig: ComponentConfig<ModernHeroBlockProps> = {
    fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        titleGradient: { type: "text" },
        alignment: {
            type: "radio",
            label: "Content Alignment",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" }
            ]
        },
        description: { type: "textarea" },
        primaryButtonText: { type: "text" },
        primaryButtonHref: { type: "text" },
        secondaryButtonText: { type: "text" },
        secondaryButtonHref: { type: "text" },
        stats: {
            type: "array",
            getItemSummary: (s: any) => s.label || "Stat",
            arrayFields: {
                value: { type: "text" },
                label: { type: "text" },
            }
        },
        cards: {
            type: "array",
            getItemSummary: (c: any) => c.title || "Card",
            arrayFields: {
                icon: {
                    type: "custom",
                    render: ({ value, onChange }: any) => (
                        <ImagePicker value={value} onChange={onChange} />
                    )
                },
                title: { type: "text" },
                desc: { type: "text" },
            }
        },
        useGlobalStats: { type: "radio", label: "Use Global Company Stats", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        ...sharedFields
    },
    render: (props) => {
        const globalStats = useQuery(api.siteData.getStats);
        const finalStats = props.useGlobalStats ? (globalStats || []) : props.stats;
        return <ModernHero {...props} stats={finalStats as any} id={props.sectionId} />;
    }
};
