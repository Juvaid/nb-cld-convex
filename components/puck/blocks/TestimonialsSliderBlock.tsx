import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import TestimonialsSlider, { TestimonialsSliderProps, Testimonial } from "@/components/sections/TestimonialsSlider";

export const TestimonialsSliderBlockConfig: ComponentConfig<TestimonialsSliderProps> = {
    label: "Testimonials Slider",
    fields: {
        badgeText: { type: "text", contentEditable: true, label: "Badge Text" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        backgroundColor: {
            type: "select",
            label: "Background Color",
            options: [
                { label: "Sage Green", value: "#f0fdf4" },
                { label: "White", value: "#ffffff" },
                { label: "Light Grey", value: "#f6f8f7" },
                { label: "Slate 50", value: "#f8fafc" },
            ],
        },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
        testimonials: {
            type: "array",
            label: "Testimonials",
            getItemSummary: (item: any) => item.name || "Testimonial",
            arrayFields: {
                name: { type: "text", contentEditable: true, label: "Name" },
                role: { type: "text", contentEditable: true, label: "Role" },
                company: { type: "text", contentEditable: true, label: "Company" },
                quote: { type: "textarea", contentEditable: true, label: "Quote" },
                rating: {
                    type: "select",
                    label: "Star Rating",
                    options: [1, 2, 3, 4, 5].map(n => ({ label: `${n} stars`, value: n })),
                },
            },
        },
    },
    defaultProps: {
        badgeText: "20+ Global Partners",
        headline: "Trusted by Leading Brands",
        subtext: "Hear from the brands that chose Nature's Boon for their manufacturing needs.",
        backgroundColor: "#f0fdf4",
        testimonials: [
            { name: "Sarah Jenkins", role: "CEO", company: "Aura Beauty", quote: "Nature's Boon transformed our product line. Their botanical formulations are second to none — our customers noticed the difference immediately.", rating: 5 },
            { name: "Michael Chen", role: "Founder", company: "GreenEarth", quote: "From first sample to final shelf product in under 3 months. Seamless, professional, and sustainable.", rating: 5 },
            { name: "Elena Rodriguez", role: "Director", company: "PureLife", quote: "With over 1,500 formulations to choose from, we found exactly what we needed. Quality certifications gave us complete confidence.", rating: 5 },
        ],
    },
    render: (props: any) => <TestimonialsSlider {...props} />,
};

export default TestimonialsSliderBlockConfig;
