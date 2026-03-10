import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { sharedFields } from "../fields/shared";
import { Typography } from "../../ui/Typography";

export interface SectionBlockProps {
    useDesignSystem?: boolean;
    heading?: string;
    subheading?: string;
    sectionId?: string;
    [key: string]: any;
}

export const SectionBlock = ({ useDesignSystem = true, children, heading, subheading, sectionId, ...props }: SectionBlockProps) => (
    <Section {...props} id={sectionId}>
        {heading && (
            useDesignSystem ? (
                <Typography variant="section-title" color="slate-900" className="mb-2" puck-editable="heading">
                    {heading}
                </Typography>
            ) : (
                <div puck-editable="heading" className="text-3xl font-bold text-slate-900 mb-2">{heading}</div>
            )
        )}
        {subheading && (
            useDesignSystem ? (
                <Typography variant="section-subtitle" color="slate-600" className="mb-6" puck-editable="subheading">
                    {subheading}
                </Typography>
            ) : (
                <div puck-editable="subheading" className="text-slate-600 mb-6">{subheading}</div>
            )
        )}
        {children}
    </Section>
);

export const SectionBlockConfig: ComponentConfig<SectionBlockProps> = {
    fields: {
        heading: { type: "text", contentEditable: true },
        subheading: { type: "text", contentEditable: true },
        ...sharedFields
    },
    defaultProps: {
        useDesignSystem: true
    },
    render: SectionBlock as any
};
