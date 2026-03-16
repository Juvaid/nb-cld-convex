import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { RichText } from "../RichText";
import { Section } from "../../ui/Section";
import { sharedFields, SharedFieldProps } from "../fields/shared";
import { cn } from "@/lib/utils";

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
        useDesignSystem: true,
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

        const useDesignSystem = props.useDesignSystem !== false;

        return (
            <Section {...props} sectionId={props.sectionId}>
                <div className={`w-full ${alignClass}`}>
                    <div
                        className={cn(
                            // Explicit element styles — no @tailwindcss/typography plugin needed
                            "[&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:mt-10 [&_h1]:mb-5 [&_h1]:leading-tight",
                            "[&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:leading-tight",
                            "[&_h3]:text-xl [&_h3]:font-black [&_h3]:text-slate-800 [&_h3]:mt-7 [&_h3]:mb-3",
                            "[&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-slate-800 [&_h4]:mt-5 [&_h4]:mb-2",
                            "[&_p]:text-slate-700 [&_p]:text-lg [&_p]:leading-[1.85] [&_p]:mb-5",
                            "[&_ul]:pl-6 [&_ul]:my-4 [&_ul>li]:list-disc [&_ul>li]:text-slate-700 [&_ul>li]:text-lg [&_ul>li]:mb-1.5",
                            "[&_ol]:pl-6 [&_ol]:my-4 [&_ol>li]:list-decimal [&_ol>li]:text-slate-700 [&_ol>li]:text-lg [&_ol>li]:mb-1.5",
                            "[&_a]:text-nb-green [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-nb-green-deep",
                            "[&_strong]:font-bold [&_strong]:text-slate-900",
                            "[&_em]:italic [&_em]:text-slate-600",
                            "[&_blockquote]:border-l-4 [&_blockquote]:border-nb-green [&_blockquote]:bg-nb-green/5 [&_blockquote]:pl-5 [&_blockquote]:py-3 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-xl [&_blockquote]:my-6 [&_blockquote>p]:text-slate-700 [&_blockquote>p]:italic [&_blockquote>p]:mb-0",
                            "[&_code]:bg-slate-100 [&_code]:text-nb-green-deep [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
                            "[&_hr]:border-t [&_hr]:border-slate-100 [&_hr]:my-8",
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
