import { ComponentConfig } from "@puckeditor/core";
import ModernServices from "../../scraped/ServicesGrid";
import { ImagePicker } from "@/components/ImagePicker";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface ModernServicesBlockProps extends SharedFieldProps {
    badgeText?: string;
    heading?: string;
    subheading?: string;
    services?: {
        title: string;
        description: string;
        icon: string;
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
                title: { type: "text" },
                description: { type: "textarea" },
                icon: {
                    type: "custom",
                    render: ({ value, onChange }: any) => (
                        <ImagePicker value={value} onChange={onChange} />
                    )
                }
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
