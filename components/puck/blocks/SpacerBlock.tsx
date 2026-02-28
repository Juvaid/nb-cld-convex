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

const HEIGHT_MAP: Record<string, string> = {
    "4px": "h-1",
    "8px": "h-2",
    "12px": "h-3",
    "16px": "h-4",
    "24px": "h-6",
    "32px": "h-8",
    "40px": "h-10",
    "48px": "h-12",
    "64px": "h-16",
    "80px": "h-20",
    "96px": "h-24",
    "128px": "h-32",
};

const WIDTH_MAP: Record<string, string> = {
    "100%": "w-full max-w-full",
    "1280px": "w-full max-w-screen-xl",
    "1024px": "w-full max-w-screen-lg",
    "768px": "w-full max-w-screen-md",
    "512px": "w-full max-w-lg",
};

const BG_COLOR_MAP: Record<string, string> = {
    "transparent": "bg-transparent",
    "#ffffff": "bg-white",
    "#f0fdf4": "bg-green-50",
    "#f8fafc": "bg-slate-50",
    "#15803d": "bg-nb-green",
};

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
    render: ({ height = "32px", maxWidth = "100%", backgroundColor = "transparent" }) => {
        const bgClass = BG_COLOR_MAP[backgroundColor] || "bg-transparent";
        const heightClass = HEIGHT_MAP[height] || "h-8";
        const widthClass = WIDTH_MAP[maxWidth] || "w-full max-w-full";

        return (
            <div
                className={`${bgClass} w-full flex justify-center`}
                aria-hidden="true"
            >
                <div className={`${heightClass} ${widthClass}`} />
            </div>
        );
    },
};
