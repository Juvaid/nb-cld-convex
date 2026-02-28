import React from "react";
import Image from "next/image";
import { ComponentConfig } from "@puckeditor/core";
import { sharedFields } from "../fields/shared";
import { ImagePicker } from "@/components/ImagePicker";

export interface AboutCoreProps {
    heading: string;
    missionStatement: string;
    stats: {
        value: string;
        label: string;
    }[];
    image: string;
    imageAlt: string;
    paddingTop?: string;
    paddingBottom?: string;
}

export const AboutCoreBlock = ({
    heading,
    missionStatement,
    stats,
    image,
    imageAlt,
    paddingTop = "py-24",
    paddingBottom = "pb-24",
}: AboutCoreProps) => {
    return (
        <section className={`w-full bg-slate-50 px-6 ${paddingTop} ${paddingBottom}`}>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
                {/* Text Content Area */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="w-16 h-1.5 bg-nb-green mb-8 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
                        {heading}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-12">
                        {missionStatement}
                    </p>

                    {/* Stat Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col border-l-2 border-nb-green/30 pl-6">
                                <span className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tighter">
                                    {stat.value}
                                </span>
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Image Area */}
                <div className="w-full lg:w-1/2">
                    <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
                        {image ? (
                            <Image
                                src={image}
                                alt={imageAlt || "About Core Image"}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Image Selected</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export const AboutCoreBlockConfig: ComponentConfig<AboutCoreProps> = {
    fields: {
        heading: { type: "text" },
        missionStatement: { type: "textarea" },
        stats: {
            type: "array",
            getItemSummary: (item) => item.label || "Stat",
            arrayFields: {
                value: { type: "text" },
                label: { type: "text" },
            },
        },
        image: {
            type: "custom",
            render: ({ value, onChange }) => (
                <ImagePicker value={value} onChange={onChange} />
            ),
        },
        imageAlt: { type: "text", label: "Image Alt Text" },
        ...sharedFields,
    },
    defaultProps: {
        heading: "Leading the Future of Personal Care Manufacturing",
        missionStatement: "At Nature's Boon, our mission is to deliver unparalleled quality through cutting-edge formulation science and sustainable manufacturing practices, empowering brands to scale globally.",
        stats: [
            { value: "15+", label: "Years Experience" },
            { value: "750+", label: "Monthly Tons" },
            { value: "1500+", label: "Formulations" },
            { value: "ISO", label: "Certified Facility" },
        ],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
        imageAlt: "Laboratory Research Facility",
    },
    render: (props) => <AboutCoreBlock {...props} />,
};
