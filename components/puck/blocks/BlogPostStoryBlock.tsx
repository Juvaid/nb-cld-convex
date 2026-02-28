import React from "react";
import { ComponentConfig, DropZone } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { ImagePicker } from "@/components/ImagePicker";
import { RichText } from "../RichText";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface BlogPostStoryBlockProps extends SharedFieldProps {
    title?: string;
    author?: string;
    date?: string;
    image?: string;
    [key: string]: any;
}

export const BlogPostStoryBlockConfig: ComponentConfig<BlogPostStoryBlockProps> = {
    fields: {
        title: { type: "text", contentEditable: true },
        author: { type: "text", contentEditable: true },
        date: { type: "text", contentEditable: true },
        image: {
            type: "custom",
            render: ({ value, onChange }: any) => (
                <ImagePicker value={value} onChange={onChange} />
            )
        },
        ...sharedFields
    },
    defaultProps: {
        title: "New Nature Story",
        author: "Nature's Boon Team",
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    },
    render: (props: any) => (
        <Section {...props} sectionId={props.sectionId} containerWidth="narrow">
            <div className="space-y-8 py-12">
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                        {props.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                        <span>{props.author}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-nb-green" />
                        <span>{props.date}</span>
                    </div>
                </div>

                {props.image && (
                    <div className="aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 ring-1 ring-slate-200/50">
                        <img src={props.image} alt={props.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="w-full">
                    <DropZone zone="content" />
                </div>
            </div>
        </Section>
    )
};
