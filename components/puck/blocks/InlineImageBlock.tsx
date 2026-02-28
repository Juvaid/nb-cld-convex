import { ComponentConfig } from "@puckeditor/core";
import { ImagePicker } from "@/components/ImagePicker";
import { sharedFields } from "../fields/shared";

export interface InlineImageProps {
    imageUrl: string;
    caption?: string;
    altText?: string;
    size?: "small" | "medium" | "large" | "full";
}

export const InlineImageBlockConfig: ComponentConfig<InlineImageProps> = {
    fields: {
        imageUrl: {
            type: "custom",
            render: ({ value, onChange }: any) => (
                <ImagePicker value={value} onChange={onChange} />
            )
        },
        caption: { type: "text" },
        altText: { type: "text" },
        size: {
            type: "select",
            options: [
                { label: "Small", value: "small" },
                { label: "Medium", value: "medium" },
                { label: "Large", value: "large" },
                { label: "Full Width", value: "full" },
            ]
        }
    },
    defaultProps: {
        imageUrl: "",
        size: "large"
    },
    render: ({ imageUrl, caption, altText, size }) => {
        if (!imageUrl) {
            return (
                <div className="w-full bg-slate-100 rounded-2xl flex items-center justify-center p-12 text-slate-400 border-2 border-dashed border-slate-200">
                    <span className="font-semibold text-sm">Select an Image</span>
                </div>
            );
        }

        const sizeClasses = {
            small: "max-w-md",
            medium: "max-w-2xl",
            large: "max-w-4xl",
            full: "max-w-full rounded-none"
        };

        return (
            <figure className={`mx-auto w-full flex flex-col items-center my-10 ${sizeClasses[size || "large"]}`}>
                <div className={`relative w-full overflow-hidden ${size === 'full' ? '' : 'rounded-2xl'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={altText || caption || "Blog Image"}
                        className="w-full h-auto object-cover"
                    />
                </div>
                {caption && (
                    <figcaption className="mt-4 text-center text-sm font-medium text-slate-500 max-w-2xl px-4">
                        {caption}
                    </figcaption>
                )}
            </figure>
        );
    }
};
