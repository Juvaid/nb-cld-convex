import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { sharedFields } from "../fields/shared";

export interface SectionBlockProps {
    heading?: string;
    subheading?: string;
    sectionId?: string;
    [key: string]: any;
}

export const SectionBlock = ({ children, heading, subheading, sectionId, ...props }: SectionBlockProps) => (
    <Section {...props} id={sectionId}>
        <div puck-editable="heading">{heading}</div>
        <div puck-editable="subheading">{subheading}</div>
        {children}
    </Section>
);

export const SectionBlockConfig: ComponentConfig<SectionBlockProps> = {
    fields: {
        heading: { type: "text" },
        subheading: { type: "text" },
        ...sharedFields
    },
    render: SectionBlock as any
};
