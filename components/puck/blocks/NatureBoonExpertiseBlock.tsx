import { ComponentConfig } from "@puckeditor/core";
import { NatureBoonExpertise } from "@/components/sections/NatureBoonExpertise";
import { sharedFields } from "../fields/shared";

export type ExpertiseItem = {
    title: string;
    description: string;
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
};

export type NatureBoonExpertiseProps = {
    title: string;
    description: string;
    items: ExpertiseItem[];
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
    sectionId?: string;
};

export const NatureBoonExpertiseConfig: ComponentConfig<NatureBoonExpertiseProps> = {
    fields: {
        title: { type: "text", contentEditable: true },
        description: { type: "textarea", contentEditable: true },
        items: {
            type: "array",
            getItemSummary: (item) => item.title || "Service Item",
            arrayFields: {
                showMedia: sharedFields.showMedia as any,
                mediaType: sharedFields.mediaType as any,
                mediaIcon: sharedFields.mediaIcon as any,
                mediaImage: sharedFields.mediaImage as any,
                title: { type: "text", contentEditable: true },
                description: { type: "textarea", contentEditable: true },
            }
        },
        ...sharedFields
    },
    render: (props) => <NatureBoonExpertise {...props} />
};
