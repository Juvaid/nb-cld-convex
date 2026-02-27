import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface ServiceGridBlockProps extends SharedFieldProps {
    title?: string;
    items?: Array<{
        showMedia?: boolean;
        mediaType?: "icon" | "image";
        mediaIcon?: string;
        mediaImage?: string;
        title?: string;
        description?: string;
        showButton?: boolean;
        buttonText?: string;
        buttonLink?: string;
    }>;
}

export const ServiceGridBlockConfig: ComponentConfig<ServiceGridBlockProps> = {
    fields: {
        title: { type: "text", contentEditable: true },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.title || "Service Item",
            arrayFields: {
                showMedia: sharedFields.showMedia,
                mediaType: sharedFields.mediaType,
                mediaIcon: sharedFields.mediaIcon,
                mediaImage: sharedFields.mediaImage,
                title: { type: "text", contentEditable: true },
                description: { type: "text", contentEditable: true },
                showButton: sharedFields.showButton,
                buttonText: sharedFields.buttonText,
                buttonLink: sharedFields.buttonLink,
            }
        },
        ...sharedFields
    },
    render: (props: any) => (
        <Section
            {...props}
            id={props.sectionId}
        >
            <Flex direction="col" align="center" gap="12">
                <Flex direction="col" align="center" gap="4" className="max-w-3xl text-center">
                    <Typography variant="h2" color="slate-900">
                        {props.title || "Our Professional Services"}
                    </Typography>
                    <div className="w-24 h-2 bg-nb-green rounded-full shadow-sm" />
                </Flex>

                <Flex
                    direction={props.flexDirection || "row"}
                    justify={props.flexJustify || "center"}
                    align={props.flexAlign || "stretch"}
                    gap={props.gap || "8"}
                    wrap
                    className="w-full"
                >
                    {(props.items || []).map((item: any, i: number) => (
                        <Flex
                            key={i}
                            direction="col"
                            align="start"
                            gap="6"
                            className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex-1 min-w-[280px] h-full"
                        >
                            {item.showMedia !== false && (
                                <Flex align="center" justify="center" className="w-16 h-16 bg-nb-green/10 rounded-2xl text-nb-green font-black text-xl overflow-hidden flex-shrink-0">
                                    {item.mediaType === "image" && item.mediaImage ? (
                                        <img
                                            src={item.mediaImage.startsWith('http') ? item.mediaImage : `/api/storage/${item.mediaImage}`}
                                            className="w-full h-full object-cover"
                                            alt={item.title || ""}
                                        />
                                    ) : (
                                        <div>
                                            {item.mediaIcon || (i + 1)}
                                        </div>
                                    )}
                                </Flex>
                            )}
                            <div className="flex-grow space-y-3">
                                <Typography variant="h4" color="slate-900">
                                    {item.title}
                                </Typography>
                                <Typography variant="small" color="slate-500">
                                    {item.description}
                                </Typography>
                            </div>

                            {item.showButton && item.buttonText && (
                                <div className="mt-4 pt-4 border-t border-slate-900/5 w-full">
                                    <a
                                        href={item.buttonLink || "#"}
                                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-nb-green hover:text-slate-900 transition-colors"
                                    >
                                        {item.buttonText}
                                        <span>→</span>
                                    </a>
                                </div>
                            )}
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    )
};
