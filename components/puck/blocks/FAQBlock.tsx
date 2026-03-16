import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { Typography } from "../../ui/Typography";
import { sharedFields, SharedFieldProps } from "../fields/shared";
import { cn } from "@/lib/utils";

export interface FAQBlockProps extends SharedFieldProps {
    title?: string;
    intro?: string;
    items?: Array<{
        question?: string;
        answer?: string;
    }>;
}

export const FAQBlockConfig: ComponentConfig<FAQBlockProps> = {
    fields: {
        title: { type: "text" },
        intro: { type: "textarea" },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.question || "FAQ Item",
            arrayFields: {
                question: { type: "text" },
                answer: { type: "textarea" },
            }
        },
        ...sharedFields
    },
    defaultProps: {
        title: "Frequently Asked Questions",
        intro: "Find answers to commonly asked questions about our products and services.",
        items: [
            { question: "What is your main product?", answer: "Our main products are premium botanical formulations." }
        ],
        paddingTop: "16",
        paddingBottom: "16",
    },
    render: (props: any) => (
        <Section {...props} sectionId={props.sectionId}>
            <div className="max-w-[760px] mx-auto">
                {props.title && (
                    <Typography variant="h3" className="text-slate-900 mb-4 font-black">
                        {props.title}
                    </Typography>
                )}
                {props.intro && (
                    <Typography variant="body" className="text-slate-600 mb-8 leading-relaxed">
                        {props.intro}
                    </Typography>
                )}
                <div className="space-y-4">
                    {(props.items || []).map((item: any, i: number) => (
                        <details 
                            key={i} 
                            className="group border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:border-nb-green/30 transition-all [&_summary::-webkit-details-marker]:hidden"
                        >
                            <summary className="list-none flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none">
                                <Typography variant="h6" className="text-slate-900 font-bold pr-4">
                                    {item.question}
                                </Typography>
                                <span className="text-nb-green transition-transform group-open:rotate-45 text-2xl font-light">
                                    +
                                </span>
                            </summary>
                            <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                                <Typography variant="body" className="text-slate-700 leading-relaxed text-lg mb-0">
                                    {item.answer}
                                </Typography>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </Section>
    )
};
