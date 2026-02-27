import { ComponentConfig } from "@puckeditor/core";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface FeatureGridBlockProps extends SharedFieldProps {
    heading: string;
    subheading: string;
    columns: "2" | "3" | "4";
    features: {
        showMedia?: boolean;
        mediaType?: "icon" | "image";
        mediaIcon?: string;
        mediaImage?: string;
        title: string;
        description: string;
        showButton?: boolean;
        buttonText?: string;
        buttonLink?: string;
    }[];
}

export const FeatureGridBlockConfig: ComponentConfig<FeatureGridBlockProps> = {
    fields: {
        heading: { type: "text", contentEditable: true },
        subheading: { type: "text", contentEditable: true },
        columns: {
            type: "radio",
            options: [
                { label: "2 Columns", value: "2" },
                { label: "3 Columns", value: "3" },
                { label: "4 Columns", value: "4" },
            ],
        },
        features: {
            type: "array",
            getItemSummary: (item: any) => item.title || "Feature",
            arrayFields: {
                showMedia: sharedFields.showMedia,
                mediaType: sharedFields.mediaType,
                mediaIcon: sharedFields.mediaIcon,
                mediaImage: sharedFields.mediaImage,
                title: { type: "text", contentEditable: true },
                description: { type: "textarea", contentEditable: true },
                showButton: sharedFields.showButton,
                buttonText: sharedFields.buttonText,
                buttonLink: sharedFields.buttonLink,
            },
            defaultItemProps: {
                showMedia: true,
                mediaType: "icon",
                mediaIcon: "✨",
                title: "Amazing Feature",
                description: "Describe how this helps your users stand out.",
            },
        },
        ...sharedFields
    },
    defaultProps: {
        heading: "Core Manufacturing Expertise",
        subheading: "Leveraging state-of-the-art facilities and scientific precision to bring your vision to market.",
        columns: "3",
        features: [
            {
                showMedia: true,
                mediaType: "icon",
                mediaIcon: "🏭",
                title: "OEM Manufacturing",
                description: "Full-scale production using your proprietary formulations with rigorous quality control protocols.",
            },
            {
                showMedia: true,
                mediaType: "icon",
                mediaIcon: "🏷️",
                title: "Private Label Solutions",
                description: "Ready-to-market formulations tailored to your brand identity with customizable packaging options.",
            },
            {
                showMedia: true,
                mediaType: "icon",
                mediaIcon: "🔬",
                title: "R&D Innovation",
                description: "In-house scientists developing next-generation active ingredients and breakthrough textures.",
            },
        ],
    },
    render: (props) => <FeatureGrid {...props} id={props.sectionId} />,
};
