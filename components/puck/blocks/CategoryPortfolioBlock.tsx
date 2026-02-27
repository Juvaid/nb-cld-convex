import { ComponentConfig } from "@puckeditor/core";
import { CategoryPortfolio } from "@/components/sections/CategoryPortfolio";
import { ImagePicker } from "@/components/ImagePicker";
import { sharedFields } from "../fields/shared";

export type PortfolioCategory = {
    title: string;
    description: string;
    tags: { name: string }[];
    image: string;
    accentColor: string;
};

export type CategoryPortfolioProps = {
    title: string;
    description: string;
    categories: PortfolioCategory[];
    sectionId?: string;
};

export const CategoryPortfolioConfig: ComponentConfig<CategoryPortfolioProps> = {
    fields: {
        title: { type: "text", contentEditable: true },
        description: { type: "textarea", contentEditable: true },
        categories: {
            type: "array",
            getItemSummary: (c) => c.title || "Category",
            arrayFields: {
                title: { type: "text", contentEditable: true },
                description: { type: "textarea", contentEditable: true },
                tags: {
                    type: "array",
                    getItemSummary: (tag: any) => tag.name || "Tag",
                    arrayFields: {
                        name: { type: "text", contentEditable: true }
                    }
                },
                image: {
                    type: "custom",
                    render: ({ value, onChange }) => (
                        <ImagePicker value={value} onChange={onChange} />
                    )
                },
                accentColor: { type: "text", contentEditable: true },
            }
        },
        ...sharedFields
    },
    render: (props: any) => <CategoryPortfolio {...props} />
};
