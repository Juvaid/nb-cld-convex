import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface IconBenefitsBlockProps extends SharedFieldProps {
    title?: string;
    items?: Array<{
        title?: string;
        description?: string;
        icon?: string;
    }>;
}

export const IconBenefitsBlockConfig: ComponentConfig<IconBenefitsBlockProps> = {
    fields: {
        title: { type: "text" },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.title || "Benefit Item",
            arrayFields: {
                title: { type: "text" },
                description: { type: "text" },
                icon: { type: "text" },
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
                            gap="6"
                            className="p-8 rounded-[32px] bg-white border border-slate-50 shadow-sm hover:border-nb-green/30 transition-all flex-1 min-w-[320px]"
                        >
                            <Flex align="center" justify="center" className="w-14 h-14 bg-nb-green/10 rounded-full flex-shrink-0 text-nb-green shadow-inner">
                                <Flex align="center" justify="center" className="w-7 h-7 border-4 border-current rounded-full font-black text-xs">
                                    {i + 1}
                                </Flex>
                            </Flex>
                            <Flex direction="col" gap="3">
                                <Typography variant="h6" color="slate-900">
                                    {item.title}
                                </Typography>
                                <Typography variant="small" color="slate-500">
                                    {item.description}
                                </Typography>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    )
};
