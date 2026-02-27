import { ComponentConfig } from "@puckeditor/core";

export interface SpacerBlockProps {
    height?: string;
    maxWidth?: string;
    backgroundColor?: string;
}

const HEIGHT_OPTIONS = [
    { label: "4px", value: "4px" },
    { label: "8px", value: "8px" },
    { label: "12px", value: "12px" },
    { label: "16px", value: "16px" },
    { label: "24px", value: "24px" },
    { label: "32px", value: "32px" },
    { label: "40px", value: "40px" },
    { label: "48px", value: "48px" },
    { label: "64px", value: "64px" },
    { label: "80px", value: "80px" },
    { label: "96px", value: "96px" },
    { label: "128px", value: "128px" },
];

const WIDTH_OPTIONS = [
    { label: "Full Width", value: "100%" },
    { label: "Wide (1280px)", value: "1280px" },
    { label: "Normal (1024px)", value: "1024px" },
    { label: "Narrow (768px)", value: "768px" },
    { label: "Small (512px)", value: "512px" },
];

export const SpacerBlockConfig: ComponentConfig<SpacerBlockProps> = {
    label: "Spacer",
    fields: {
        height: {
            type: "select",
            label: "Vertical Height",
            options: HEIGHT_OPTIONS,
        },
        maxWidth: {
            type: "select",
            label: "Horizontal Width",
            options: WIDTH_OPTIONS,
        },
        backgroundColor: {
            type: "select",
            label: "Background Color",
            options: [
                { label: "Transparent", value: "transparent" },
                { label: "White", value: "#ffffff" },
                { label: "Sage Green", value: "#f0fdf4" },
                { label: "Slate 50", value: "#f8fafc" },
                { label: "Brand Green", value: "#15803d" },
            ],
        },
    },
    defaultProps: {
        height: "32px",
        maxWidth: "100%",
        backgroundColor: "transparent",
    },
    render: ({ height = "32px", maxWidth = "100%", backgroundColor = "transparent" }) => (
        <div
            style={{ backgroundColor, width: "100%", display: "flex", justifyContent: "center" }}
            aria-hidden="true"
        >
            <div style={{ height, width: maxWidth, maxWidth: "100%" }} />
        </div>
    ),
};
