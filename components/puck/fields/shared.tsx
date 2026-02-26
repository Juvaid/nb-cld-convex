import React from "react";
import { ImagePicker } from "@/components/ImagePicker";
import { VisualColorPicker } from "./VisualColorPicker";
import { SpacingControl } from "./SpacingControl";

export const sharedFields = {
    sectionId: { type: "text" as const, label: "Anchor Section ID (for navigation)" },
    paddingTop: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <SpacingControl label="Top Padding" value={value} onChange={onChange} />
        )
    },
    paddingBottom: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <SpacingControl label="Bottom Padding" value={value} onChange={onChange} />
        )
    },
    containerWidth: {
        type: "select" as const,
        options: [
            { label: "Normal (Default)", value: "normal" },
            { label: "Narrow (768px)", value: "narrow" },
            { label: "Wide (1280px)", value: "wide" },
            { label: "Full (100%)", value: "full" }
        ]
    },
    backgroundVariant: {
        type: "select" as const,
        options: [
            { label: "White", value: "white" },
            { label: "Slate 50", value: "slate-50" },
            { label: "Slate 900", value: "slate-900" },
            { label: "Brand Green", value: "nb-green" },
            { label: "Glass White", value: "glass-white" },
            { label: "Glass Dark", value: "glass-dark" }
        ]
    },
    // Flex Controls
    flexDirection: {
        type: "select" as const,
        options: [
            { label: "Horizontal (Row)", value: "row" },
            { label: "Vertical (Column)", value: "col" },
            { label: "Reverse Row", value: "row-reverse" },
            { label: "Reverse Column", value: "col-reverse" }
        ]
    },
    flexAlign: {
        type: "select" as const,
        options: [
            { label: "Start", value: "start" },
            { label: "Center", value: "center" },
            { label: "End", value: "end" },
            { label: "Stretch", value: "stretch" }
        ]
    },
    flexJustify: {
        type: "select" as const,
        options: [
            { label: "Start", value: "start" },
            { label: "Center", value: "center" },
            { label: "End", value: "end" },
            { label: "Space Between", value: "between" },
            { label: "Space Evenly", value: "evenly" }
        ]
    },
    gap: {
        type: "select" as const,
        options: [
            { label: "None", value: "0" },
            { label: "X-Small", value: "4" },
            { label: "Small", value: "8" },
            { label: "Medium", value: "12" },
            { label: "Large", value: "16" },
            { label: "X-Large", value: "20" }
        ]
    },
    // Custom Background & Effects
    backgroundImage: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <ImagePicker value={value} onChange={onChange} />
        )
    },
    backgroundSize: {
        type: "select" as const,
        options: [
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
            { label: "Auto", value: "auto" }
        ]
    },
    backgroundPosition: {
        type: "select" as const,
        options: [
            { label: "Center", value: "center" },
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" }
        ]
    },
    backgroundColor: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <VisualColorPicker value={value} onChange={onChange} />
        )
    },
    overlayColor: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <VisualColorPicker value={value} onChange={onChange} />
        )
    },
    overlayOpacity: {
        type: "select" as const,
        options: [
            { label: "0%", value: "0" },
            { label: "10%", value: "0.1" },
            { label: "20%", value: "0.2" },
            { label: "30%", value: "0.3" },
            { label: "40%", value: "0.4" },
            { label: "50%", value: "0.5" },
            { label: "60%", value: "0.6" },
            { label: "70%", value: "0.7" },
            { label: "80%", value: "0.8" },
            { label: "90%", value: "0.9" }
        ]
    },
    isGlass: { type: "radio" as const, label: "Glassmorphism Effect", options: [{ label: "On", value: true }, { label: "Off", value: false }] },
    blur: {
        type: "select" as const,
        label: "Glass Blur Level",
        options: [
            { label: "None", value: "0" },
            { label: "Soft", value: "blur-sm" },
            { label: "Medium", value: "blur-md" },
            { label: "Large", value: "blur-lg" },
            { label: "High", value: "blur-xl" },
        ]
    },
    animation: {
        type: "select" as const,
        options: [
            { label: "None", value: "none" },
            { label: "Fade Up", value: "fade-up" },
            { label: "Fade In", value: "fade-in" },
            { label: "Slide Left", value: "slide-left" },
            { label: "Slide Right", value: "slide-right" },
        ],
    },
    // Professional Design Controls
    shadowIntensity: {
        type: "select" as const,
        options: [
            { label: "None", value: "none" },
            { label: "Soft (Low)", value: "shadow-sm" },
            { label: "Medium", value: "shadow-md" },
            { label: "Large", value: "shadow-lg" },
            { label: "X-Large", value: "shadow-xl" },
            { label: "Intense (2XL)", value: "shadow-2xl" },
            { label: "Inner", value: "shadow-inner" },
        ]
    },
    borderWidth: {
        type: "select" as const,
        options: [
            { label: "None", value: "0" },
            { label: "Thin (1px)", value: "1" },
            { label: "Medium (2px)", value: "2" },
            { label: "Thick (4px)", value: "4" },
            { label: "Heavy (8px)", value: "8" },
        ]
    },
    borderColor: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <VisualColorPicker value={value} onChange={onChange} />
        )
    },
    borderRadius: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "None", value: "rounded-none" },
            { label: "Small", value: "rounded-sm" },
            { label: "Medium", value: "rounded-md" },
            { label: "Large", value: "rounded-lg" },
            { label: "X-Large", value: "rounded-xl" },
            { label: "Full (Pill)", value: "rounded-full" },
            { label: "Premium (32px)", value: "rounded-[32px]" },
            { label: "Ultra (48px)", value: "rounded-[48px]" },
        ]
    },
    marginTop: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <SpacingControl label="Margin Top" value={value} onChange={onChange} />
        )
    },
    marginBottom: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <SpacingControl label="Margin Bottom" value={value} onChange={onChange} />
        )
    },
    // Finer Typography Controls
    textColor: {
        type: "custom" as const,
        render: ({ value, onChange }: any) => (
            <VisualColorPicker value={value} onChange={onChange} />
        )
    },
    fontSize: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "XS (12px)", value: "text-xs" },
            { label: "SM (14px)", value: "text-sm" },
            { label: "Base (16px)", value: "text-base" },
            { label: "LG (18px)", value: "text-lg" },
            { label: "XL (20px)", value: "text-xl" },
            { label: "2XL (24px)", value: "text-2xl" },
            { label: "3XL (30px)", value: "text-3xl" },
            { label: "4XL (36px)", value: "text-4xl" },
            { label: "5XL (48px)", value: "text-5xl" },
            { label: "6XL (60px)", value: "text-6xl" },
        ]
    },
    fontWeight: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "Thin (100)", value: "font-thin" },
            { label: "Light (300)", value: "font-light" },
            { label: "Regular (400)", value: "font-normal" },
            { label: "Medium (500)", value: "font-medium" },
            { label: "SemiBold (600)", value: "font-semibold" },
            { label: "Bold (700)", value: "font-bold" },
            { label: "ExtraBold (800)", value: "font-extrabold" },
            { label: "Black (900)", value: "font-black" },
        ]
    },
    lineHeight: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "None (1)", value: "leading-none" },
            { label: "Tight (1.25)", value: "leading-tight" },
            { label: "Snug (1.375)", value: "leading-snug" },
            { label: "Normal (1.5)", value: "leading-normal" },
            { label: "Relaxed (1.625)", value: "leading-relaxed" },
            { label: "Loose (2)", value: "leading-loose" },
        ]
    },
    letterSpacing: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "Tighter", value: "tracking-tighter" },
            { label: "Tight", value: "tracking-tight" },
            { label: "Normal", value: "tracking-normal" },
            { label: "Wide", value: "tracking-wide" },
            { label: "Wider", value: "tracking-wider" },
            { label: "Widest", value: "tracking-widest" },
        ]
    },
    textTransform: {
        type: "select" as const,
        options: [
            { label: "None", value: "normal-case" },
            { label: "Uppercase", value: "uppercase" },
            { label: "Lowercase", value: "lowercase" },
            { label: "Capitalize", value: "capitalize" },
        ]
    },
    // Media Controls
    showMedia: { type: "radio" as const, label: "Show Icon/Image", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    mediaType: {
        type: "radio" as const,
        label: "Media Type",
        options: [
            { label: "Icon", value: "icon" },
            { label: "Image", value: "image" }
        ]
    },
    mediaIcon: { type: "text" as const, label: "Icon (Lucide Name or Emoji)" },
    mediaImage: {
        type: "custom" as const,
        label: "Image",
        render: ({ value, onChange }: any) => (
            <ImagePicker value={value} onChange={onChange} />
        )
    },
    // Button Controls
    showButton: { type: "radio" as const, label: "Show Button", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    buttonText: { type: "text" as const, label: "Button Text" },
    buttonLink: { type: "text" as const, label: "Button Link (URL or #anchor)" },
    buttonVariant: {
        type: "select" as const,
        options: [
            { label: "Primary (Green)", value: "primary" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
            { label: "Link", value: "link" }
        ]
    }
};

export interface SharedFieldProps {
    sectionId?: string;
    paddingTop?: string;
    paddingBottom?: string;
    containerWidth?: "normal" | "narrow" | "wide" | "full";
    backgroundVariant?: "white" | "slate-50" | "slate-900" | "nb-green" | "glass-white" | "glass-dark";
    flexDirection?: "row" | "col" | "row-reverse" | "col-reverse";
    flexAlign?: "start" | "center" | "end" | "stretch";
    flexJustify?: "start" | "center" | "end" | "between" | "evenly";
    gap?: string;
    backgroundImage?: string;
    backgroundSize?: "cover" | "contain" | "auto";
    backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
    backgroundColor?: string;
    overlayColor?: string;
    overlayOpacity?: string;
    isGlass?: boolean;
    blur?: string;
    animation?: "none" | "fade-up" | "fade-in" | "slide-left" | "slide-right";
    shadowIntensity?: "none" | "shadow-sm" | "shadow-md" | "shadow-lg" | "shadow-xl" | "shadow-2xl" | "shadow-inner";
    borderWidth?: string;
    borderColor?: string;
    borderRadius?: string;
    marginTop?: string;
    marginBottom?: string;
    textColor?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: "normal-case" | "uppercase" | "lowercase" | "capitalize";
    // Media Props
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
    // Button Props
    showButton?: boolean;
    buttonText?: string;
    buttonLink?: string;
    buttonVariant?: "primary" | "outline" | "ghost" | "link";
}
