import { ComponentConfig } from "@puckeditor/core";
import { NatureBoonStats } from "@/components/sections/NatureBoonStats";
import { sharedFields } from "../fields/shared";

export type StatItem = {
    value: string;
    label: string;
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
};

export type NatureBoonStatsProps = {
    stats: StatItem[];
    sectionId?: string;
};

export const NatureBoonStatsConfig: ComponentConfig<NatureBoonStatsProps> = {
    fields: {
        stats: {
            type: "array",
            getItemSummary: (s) => s.label || "Stat",
            arrayFields: {
                showMedia: sharedFields.showMedia as any,
                mediaType: sharedFields.mediaType as any,
                mediaIcon: sharedFields.mediaIcon as any,
                mediaImage: sharedFields.mediaImage as any,
                value: { type: "text", contentEditable: true },
                label: { type: "text", contentEditable: true },
            }
        },
        ...sharedFields
    },
    render: (props) => <NatureBoonStats {...props} />
};
