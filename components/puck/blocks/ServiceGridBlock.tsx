import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface ServiceGridBlockProps extends SharedFieldProps {
    title?: string;
    items?: Array<{
        title?: string;
        description?: string;
    }>;
}

export const ServiceGridBlockConfig: ComponentConfig<ServiceGridBlockProps> = {
    fields: {
        title: { type: "text" },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.title || "Service Item",
            arrayFields: {
                title: { type: "text" },
                description: { type: "text" },
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
                            className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex-1 min-w-[280px]"
                        >
                            <Flex align="center" justify="center" className="w-16 h-16 bg-nb-green/10 rounded-2xl text-nb-green font-black text-xl">
                                {i + 1}
                            </Flex>
                            <Typography variant="h4" color="slate-900">
                                {item.title}
                            </Typography>
                            <Typography variant="small" color="slate-500">
                                {item.description}
                            </Typography>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    )
};
