import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { RichText } from "../RichText";
import { Section } from "../../ui/Section";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface TextBlockProps extends SharedFieldProps {
    content: string;
    alignment?: "left" | "center" | "right" | "justify";
    maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
}

export const TextBlockConfig: ComponentConfig<TextBlockProps> = {
    fields: {
        content: {
            type: "custom",
            render: (props: any) => <RichText {...props} />
        },
        alignment: {
            type: "select",
            label: "Text Alignment",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
                { label: "Justify", value: "justify" },
            ]
        },
        maxWidth: {
            type: "select",
            label: "Max Width constraint",
            options: [
                { label: "None (Full)", value: "none" },
                { label: "Small (sm)", value: "sm" },
                { label: "Medium (md)", value: "md" },
                { label: "Large (lg)", value: "lg" },
                { label: "X-Large (xl)", value: "xl" },
                { label: "2X-Large (2xl)", value: "2xl" },
                { label: "3X-Large (3xl)", value: "3xl" },
                { label: "4X-Large (4xl)", value: "4xl" },
            ]
        },
        ...sharedFields
    },
    defaultProps: {
        content: "<p>Write your amazing text here...</p>",
        alignment: "left",
        maxWidth: "none"
    },
    render: (props: any) => {
        let alignClass = "text-left";
        if (props.alignment === "center") alignClass = "text-center mx-auto";
        if (props.alignment === "right") alignClass = "text-right ml-auto";
        if (props.alignment === "justify") alignClass = "text-justify";

        let maxWidthClass = "max-w-none";
        if (props.maxWidth && props.maxWidth !== "none") {
            maxWidthClass = `max-w-${props.maxWidth} mx-auto`;
        }

        return (
            <Section {...props} sectionId={props.sectionId}>
                <div className={`w-full ${alignClass}`}>
                    <div
                        className={`prose prose-slate prose-lg lg:prose-xl prose-nb ${maxWidthClass} prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 focus:outline-none`}
                        dangerouslySetInnerHTML={{ __html: props.content }}
                    />
                </div>
            </Section>
        );
    }
};
