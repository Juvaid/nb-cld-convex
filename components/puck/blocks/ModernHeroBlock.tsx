import { ComponentConfig } from "@puckeditor/core";
import ModernHero from "../../blocks/Hero";
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
        badgeText: { type: "text", contentEditable: true },
        title: { type: "text", contentEditable: true },
        titleGradient: { type: "text", contentEditable: true },
        alignment: {
            type: "radio",
            label: "Content Alignment",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" }
            ]
        },
        description: { type: "textarea", contentEditable: true },
        primaryButtonText: { type: "text", contentEditable: true },
        primaryButtonHref: { type: "text", contentEditable: true },
        secondaryButtonText: { type: "text", contentEditable: true },
        secondaryButtonHref: { type: "text", contentEditable: true },
        stats: {
            type: "array",
            getItemSummary: (s: any) => s.label || "Stat",
            arrayFields: {
                value: { type: "text", contentEditable: true },
                label: { type: "text", contentEditable: true },
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
                title: { type: "text", contentEditable: true },
                desc: { type: "text", contentEditable: true },
            }
        },
        useGlobalStats: { type: "radio", label: "Use Global Company Stats", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        ...sharedFields
    },
    defaultProps: {
        useDesignSystem: true
    },
    render: (props) => {
        const globalStats = useQuery(api.siteData.getStats);
        const finalStats = props.useGlobalStats ? (globalStats || []) : props.stats;
        return <ModernHero {...props} stats={finalStats as any} id={props.sectionId} />;
    }
};
