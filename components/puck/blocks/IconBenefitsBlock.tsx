import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface IconBenefitsBlockProps extends SharedFieldProps {
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

export const IconBenefitsBlockConfig: ComponentConfig<IconBenefitsBlockProps> = {
    fields: {
        title: { type: "text" },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.title || "Benefit Item",
            arrayFields: {
                showMedia: sharedFields.showMedia,
                mediaType: sharedFields.mediaType,
                mediaIcon: sharedFields.mediaIcon,
                mediaImage: sharedFields.mediaImage,
                title: { type: "text" },
                description: { type: "text" },
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
            <Flex direction="col" align="center" gap="16">
                <Typography variant="h2" align="center" color="slate-900">
                    {props.title || "Why Partner With Us?"}
                </Typography>

                <Flex
                    direction={props.flexDirection || "row"}
                    mobileDirection="col"
                    justify={props.flexJustify || "center"}
                    align={props.flexAlign || "stretch"}
                    gap={props.gap || "10"}
                    wrap
                    className="w-full"
                >
                    {(props.items || []).map((item: any, i: number) => (
                        <Flex
                            key={i}
                            direction="col"
                            gap="6"
                            className="p-8 rounded-[32px] bg-white border border-slate-50 shadow-sm hover:border-nb-green/30 transition-all flex-1 min-w-[320px] h-full"
                        >
                            <Flex gap="6" align="start">
                                {item.showMedia !== false && (
                                    <Flex align="center" justify="center" className="w-14 h-14 bg-nb-green/10 rounded-full flex-shrink-0 text-nb-green shadow-inner overflow-hidden">
                                        {item.mediaType === "image" && item.mediaImage ? (
                                            <img
                                                src={item.mediaImage.startsWith('http') ? item.mediaImage : `/api/storage/${item.mediaImage}`}
                                                className="w-full h-full object-cover"
                                                alt={item.title || ""}
                                            />
                                        ) : (
                                            <div className="text-xl">
                                                {item.mediaIcon || (i + 1)}
                                            </div>
                                        )}
                                    </Flex>
                                )}
                                <Flex direction="col" gap="3" className="flex-grow">
                                    <Typography variant="h6" color="slate-900">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="small" color="slate-500">
                                        {item.description}
                                    </Typography>
                                </Flex>
                            </Flex>

                            {item.showButton && item.buttonText && (
                                <div className="mt-auto pt-4 border-t border-slate-900/5">
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
