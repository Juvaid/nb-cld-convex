import { useState, useEffect } from "react";
import { ComponentConfig } from "@puckeditor/core";
import ModernServices from "../../blocks/ServicesGrid";
import { ImagePicker } from "@/components/ImagePicker";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface ModernServicesProps {
    sectionId?: string;
    title?: string;
    subtitle?: string;
    useGlobalServices?: boolean;
    services: Array<{
        title: string;
        description: string;
        icon: string;
        link?: string;
        image?: string;
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
        title: { type: "text" },
        subtitle: { type: "text" },
        useGlobalServices: { type: "radio", options: [{ label: "Global", value: true }, { label: "Manual", value: false }] },
        services: {
            type: "array",
            getItemSummary: (item) => item.title || "Service",
            defaultItemProps: { title: "New Service", description: "Service description", icon: "Package" },
            arrayFields: {
                title: { type: "text" },
                description: { type: "text" },
                icon: { type: "text" },
                link: { type: "text" },
                image: { type: "custom", render: ({ value, onChange }: any) => <ImagePicker value={value || ""} onChange={onChange} /> as any }
            }
        }
    },
    defaultProps: {
        sectionId: "services",
        title: "Our Specialized Services",
        subtitle: "Comprehensive solutions tailored to your needs.",
        useGlobalServices: true,
        services: [],
    },
    render: (props) => {
        const [currentServices, setCurrentServices] = useState<any[]>([]);

        // initialData is passed by PuckRenderer
        const initialGlobal = (props as { initialData?: { globalServices?: any[] } }).initialData?.globalServices || [];
        const globalServices = currentServices.length > 0 ? currentServices : initialGlobal;

        const finalServices = props.useGlobalServices ? globalServices : props.services;
        
        return (
            <>
                {typeof window !== "undefined" && props.useGlobalServices && (
                    <LiveServices onServicesFound={setCurrentServices} />
                )}
                <ModernServices {...props} services={finalServices} id={props.sectionId} />
            </>
        );
    }
};
