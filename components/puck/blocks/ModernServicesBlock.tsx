import { ComponentConfig } from "@puckeditor/core";
import ModernServices from "../../blocks/ServicesGrid";
import { ImagePicker } from "@/components/ImagePicker";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface ModernServicesBlockProps extends SharedFieldProps {
    badgeText?: string;
    heading?: string;
    subheading?: string;
    services?: {
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
    useGlobalServices?: boolean;
}

export const ModernServicesBlockConfig: ComponentConfig<ModernServicesBlockProps> = {
    fields: {
        badgeText: { type: "text" },
        heading: { type: "text" },
        subheading: { type: "textarea" },
        services: {
            type: "array",
            getItemSummary: (s: any) => s.title || "Service",
            arrayFields: {
                showMedia: sharedFields.showMedia,
                mediaType: sharedFields.mediaType,
                mediaIcon: sharedFields.mediaIcon,
                mediaImage: sharedFields.mediaImage,
                title: { type: "text" },
                description: { type: "textarea" },
                showButton: sharedFields.showButton,
                buttonText: sharedFields.buttonText,
                buttonLink: sharedFields.buttonLink,
            }
        },
        useGlobalServices: { type: "radio", label: "Use Global Services", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        ...sharedFields
    },
    render: (props) => {
        const globalServices = useQuery(api.siteData.getServices);
        const finalServices = props.useGlobalServices ? (globalServices || []) : props.services;
        return <ModernServices {...props} services={finalServices as any} id={props.sectionId} />;
    }
};
