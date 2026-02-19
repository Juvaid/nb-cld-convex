import { ComponentConfig } from "@puckeditor/core";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface FeatureGridBlockProps extends SharedFieldProps {
    heading: string;
    subheading: string;
    columns: "2" | "3" | "4";
    features: {
        icon: string;
        title: string;
        description: string;
    }[];
}

export const FeatureGridBlockConfig: ComponentConfig<FeatureGridBlockProps> = {
    fields: {
        heading: { type: "text" },
        subheading: { type: "text" },
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
                icon: { type: "text" },
                title: { type: "text" },
                description: { type: "textarea" },
            },
            defaultItemProps: {
                icon: "✨",
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
                icon: "🏭",
                title: "OEM Manufacturing",
                description: "Full-scale production using your proprietary formulations with rigorous quality control protocols.",
            },
            {
                icon: "🏷️",
                title: "Private Label Solutions",
                description: "Ready-to-market formulations tailored to your brand identity with customizable packaging options.",
            },
            {
                icon: "🔬",
                title: "R&D Innovation",
                description: "In-house scientists developing next-generation active ingredients and breakthrough textures.",
            },
        ],
    },
    render: (props) => <FeatureGrid {...props} id={props.sectionId} />,
};
