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
        badgeText: { type: "text", contentEditable: true },
        heading: { type: "text", contentEditable: true },
        subheading: { type: "textarea", contentEditable: true },
        services: {
            type: "array",
            getItemSummary: (s: any) => s.title || "Service",
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
            }
        },
        useGlobalServices: { type: "radio", label: "Use Global Services", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        ...sharedFields
    },
    defaultProps: {
        useDesignSystem: true,
        badgeText: "Our Capability",
        heading: "Expert Solutions for Your Brand",
        subheading: "We provide comprehensive, end-to-end manufacturing services to help you build a world-class personal care brand.",
        services: [
            {
                title: 'Label & Packaging Designing',
                description: 'Label and packaging designing is an essential aspect of branding and marketing strategy.',
                showMedia: true,
                mediaType: "icon",
                mediaIcon: 'Palette',
                buttonText: "Explore Service",
                showButton: true,
            },
            {
                title: 'Customised Finished Product',
                description: 'A personal care product design must account for market demand.',
                showMedia: true,
                mediaType: "icon",
                mediaIcon: 'FlaskConical',
                buttonText: "Explore Service",
                showButton: true,
            },
            {
                title: 'Trademark & Logo',
                description: 'We create trademarks and logos that effectively represent your brand.',
                showMedia: true,
                mediaType: "icon",
                mediaIcon: 'BadgeCheck',
                buttonText: "Explore Service",
                showButton: true,
            },
            {
                title: 'Digital Marketing',
                description: 'We help brands promote their products and services to their target audience.',
                showMedia: true,
                mediaType: "icon",
                mediaIcon: 'Megaphone',
                buttonText: "Explore Service",
                showButton: true,
            },
        ]
    },
    render: (props) => {
        const globalServices = useQuery(api.siteData.getServices);
        const finalServices = props.useGlobalServices ? (globalServices || []) : props.services;
        return <ModernServices {...props} services={finalServices as any} id={props.sectionId} />;
    }
};
