import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { RichText } from "../RichText";
import { Section } from "../../ui/Section";
import { sharedFields, SharedFieldProps } from "../fields/shared";
import { cn } from "@/lib/utils";

export interface TextBlockProps extends SharedFieldProps {
    content: string;
    alignment?: "left" | "center" | "right" | "justify";
    maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
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
                { label: "5X-Large (5xl)", value: "5xl" },
                { label: "6X-Large (6xl)", value: "6xl" },
                { label: "7X-Large (7xl)", value: "7xl" },
            ]
        },
        ...sharedFields
    },
    defaultProps: {
        useDesignSystem: true,
        content: "<p>Start writing your article here...</p>",
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
                        className={cn(
                            // Text Typography
                            "[&_h2]:text-3xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:leading-tight",
                            "[&_h3]:text-2xl [&_h3]:font-black [&_h3]:text-slate-800 [&_h3]:mt-10 [&_h3]:mb-4",
                            "[&_p]:text-slate-700 [&_p]:text-lg [&_p]:leading-[1.8] [&_p]:mb-6",
                            "[&_a]:text-nb-green [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-nb-green-deep transition-colors",
                            "[&_ul]:pl-6 [&_ul]:my-6 [&_ul>li]:list-disc [&_ul>li]:text-slate-700 [&_ul>li]:text-lg [&_ul>li]:mb-2 [&_ul>li]:pl-2",
                            "[&_ol]:pl-6 [&_ol]:my-6 [&_ol>li]:list-decimal [&_ol>li]:text-slate-700 [&_ol>li]:text-lg [&_ol>li]:mb-2 [&_ol>li]:pl-2",
                            "[&_blockquote]:border-l-4 [&_blockquote]:border-nb-green [&_blockquote]:bg-slate-50 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:my-8 [&_blockquote>p]:text-slate-800 [&_blockquote>p]:italic [&_blockquote>p]:text-xl [&_blockquote>p]:mb-0",

                            // Image Magic - Support for inline styles and floating
                            "[&_img]:max-w-full [&_img]:rounded-2xl [&_img]:my-6 sm:[&_img]:my-10 [&_img]:border [&_img]:border-slate-200/60 [&_img]:shadow-sm [&_img]:object-cover [&_img]:relative [&_img]:z-10",
                            "[&_.float-img-left]:float-left [&_.float-img-left]:mr-8 [&_.float-img-left]:mb-4",
                            "[&_.float-img-right]:float-right [&_.float-img-right]:ml-8 [&_.float-img-right]:mb-4",
                            "[&_.block-img-center]:block [&_.block-img-center]:mx-auto",

                            // Native FAQ Accordion Magic
                            "[&_details]:mb-4 [&_details]:border [&_details]:border-slate-200 [&_details]:rounded-2xl [&_details]:bg-white [&_details]:shadow-sm [&_details]:overflow-hidden [&_details]:group",
                            "[&_summary]:font-bold [&_summary]:text-lg [&_summary]:text-slate-900 [&_summary]:p-6 [&_summary]:cursor-pointer [&_summary]:bg-slate-50/50 hover:[&_summary]:bg-slate-50 transition-colors [&_summary]:outline-none",
                            "[&_details>div]:px-6 [&_details>div]:pb-6 [&_details>div]:pt-2 [&_details>div]:text-slate-700",
                            "[&_details[open]_summary]:border-b [&_details[open]_summary]:border-slate-100",

                            "focus:outline-none",
                            maxWidthClass
                        )}
                        dangerouslySetInnerHTML={{ __html: props.content }}
                    />
                </div>
            </Section>
        );
    }
};
