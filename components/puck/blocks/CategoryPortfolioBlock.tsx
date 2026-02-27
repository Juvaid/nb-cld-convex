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
        title: { type: "text" },
        description: { type: "textarea" },
        categories: {
            type: "array",
            getItemSummary: (c) => c.title || "Category",
            arrayFields: {
                title: { type: "text" },
                description: { type: "textarea" },
                tags: {
                    type: "array",
                    getItemSummary: (tag: any) => tag.name || "Tag",
                    arrayFields: {
                        name: { type: "text" }
                    }
                },
                image: {
                    type: "custom",
                    render: ({ value, onChange }) => (
                        <ImagePicker value={value} onChange={onChange} />
                    )
                },
                accentColor: { type: "text" },
            }
        },
        ...sharedFields
    },
    render: (props: any) => <CategoryPortfolio {...props} />
};
