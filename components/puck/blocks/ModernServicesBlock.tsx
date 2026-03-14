import { useState, useEffect } from "react";
import { ComponentConfig } from "@puckeditor/core";
import ModernServices from "../../blocks/ServicesGrid";
import { ImagePicker } from "@/components/ImagePicker";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface ModernServicesProps {
    sectionId?: string;
    badgeText?: string;
    heading?: string;
    subheading?: string;
    useGlobalServices?: boolean;
    services: Array<{
        title: string;
        description: string;
        mediaType?: "icon" | "image";
        mediaIcon?: string;
        mediaImage?: string;
        showMedia?: boolean;
        link?: string;
        showButton?: boolean;
        buttonText?: string;
        buttonLink?: string;
    }>;
}

/**
 * Inner component to handle live updates on the client.
 */
function LiveServices({ onServicesFound }: { onServicesFound: (s: any) => void }) {
    const liveServices = useQuery(api.siteData.getServices);
    useEffect(() => {
        if (liveServices) onServicesFound(liveServices);
    }, [liveServices, onServicesFound]);
    return null;
}

export const ModernServicesBlockConfig: ComponentConfig<ModernServicesProps> = {
    fields: {
        sectionId: { type: "text" },
        badgeText: { type: "text" },
        heading: { type: "text", label: "Heading" },
        subheading: { type: "text", label: "Subheading" },
        useGlobalServices: { type: "radio", options: [{ label: "Global", value: true }, { label: "Manual", value: false }] },
        services: {
            type: "array",
            getItemSummary: (item) => item.title || "Service",
            defaultItemProps: { 
                title: "New Service", 
                description: "Service description", 
                mediaIcon: "Palette", 
                mediaType: "icon", 
                showMedia: true,
                showButton: true,
                buttonText: "EXPLORE SERVICE",
                buttonLink: "#"
            },
            arrayFields: {
                title: { type: "text" },
                description: { type: "text" },
                showMedia: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                mediaType: { type: "radio", options: [{ label: "Icon", value: "icon" }, { label: "Image", value: "image" }] },
                mediaIcon: { type: "text", label: "Icon (Lucide Name)" },
                mediaImage: { type: "custom", render: ({ value, onChange }: any) => <ImagePicker value={value || ""} onChange={onChange} /> as any },
                showButton: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                buttonText: { type: "text" },
                buttonLink: { type: "text" },
                link: { type: "text", label: "Card Link (Optional)" },
            }
        }
    },
    defaultProps: {
        sectionId: "services",
        badgeText: "Our Capability",
        heading: "Expert Solutions for Your Brand",
        subheading: "Comprehensive solutions tailored to your needs.",
        useGlobalServices: true,
        services: [],
    },
    render: (props) => {
        const [currentServices] = useState<any[]>([]);

        // initialData is passed by PuckRenderer
        const initialGlobal = (props as { initialData?: { globalServices?: any[] } }).initialData?.globalServices || [];
        const globalRaw = currentServices.length > 0 ? currentServices : initialGlobal;

        // Map Global services (icon -> mediaIcon)
        const mappedGlobal = globalRaw.map((s: any) => ({
            ...s,
            mediaIcon: s.icon,
            mediaType: "icon",
            showMedia: true,
            showButton: true,
            buttonText: "EXPLORE SERVICE",
            buttonLink: `/services#${s.slug}`,
            link: `/services#${s.slug}`
        }));

        const finalServices = props.useGlobalServices ? mappedGlobal : props.services;
        
        return (
            <>
                <ModernServices 
                    {...props} 
                    heading={props.heading}
                    subheading={props.subheading}
                    services={finalServices as any} 
                    id={props.sectionId} 
                />
            </>
        );
    }
};
