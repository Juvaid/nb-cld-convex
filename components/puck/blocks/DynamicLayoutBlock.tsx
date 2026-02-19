import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { DynamicLayout } from "./DynamicLayout";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface DynamicLayoutBlockProps extends SharedFieldProps {
    type: "grid" | "flex";
    columns?: number;
    justify?: "start" | "center" | "end" | "between" | "evenly";
    [key: string]: any;
}

export const DynamicLayoutBlockConfig: ComponentConfig<DynamicLayoutBlockProps> = {
    fields: {
        type: {
            type: "radio",
            options: [
                { label: "Grid", value: "grid" },
                { label: "Flex", value: "flex" }
            ]
        },
        columns: {
            type: "number",
            label: "Columns (Desktop)",
        },
        justify: {
            type: "select",
            options: [
                { label: "Start", value: "start" },
                { label: "Center", value: "center" },
                { label: "End", value: "end" },
                { label: "Between", value: "between" },
                { label: "Evenly", value: "evenly" }
            ]
        },
        ...sharedFields
    },
    defaultProps: {
        type: "grid",
        columns: 3,
        gap: "8",
        paddingTop: "16",
        paddingBottom: "16"
    },
    render: (props: any) => <DynamicLayout {...props} id={props.sectionId} />
};
