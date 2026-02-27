import { ComponentConfig } from "@puckeditor/core";
import { NatureBoonHero } from "@/components/sections/NatureBoonHero";
import { PagePicker } from "@/components/PagePicker";
import { ImagePicker } from "@/components/ImagePicker";
import { sharedFields } from "../fields/shared";

export type NatureBoonHeroProps = {
    title: string;
    subtitle: string;
    description: string;
    buttonHref: string;
    image: string;
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
    sectionId?: string;
};

export const NatureBoonHeroConfig: ComponentConfig<NatureBoonHeroProps> = {
    fields: {
        title: { type: "text", contentEditable: true },
        subtitle: { type: "text", contentEditable: true },
        description: { type: "richtext" },
        buttonHref: {
            type: "custom",
            render: ({ value, onChange }) => (
                <PagePicker value={value} onChange={onChange} />
            )
        },
        image: {
            type: "custom",
            render: ({ value, onChange }) => (
                <ImagePicker value={value} onChange={onChange} />
            )
        },
        ...sharedFields
    },
    render: (props) => <NatureBoonHero {...props} />
};
