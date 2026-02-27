import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface ProcessTimelineBlockProps extends SharedFieldProps {
    title?: string;
    items?: Array<{
        title?: string;
        description?: string;
        stepNumber?: string;
    }>;
}

export const ProcessTimelineBlockConfig: ComponentConfig<ProcessTimelineBlockProps> = {
    fields: {
        title: { type: "text", contentEditable: true },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.title || "Process Step",
            arrayFields: {
                title: { type: "text", contentEditable: true },
                description: { type: "text", contentEditable: true },
                stepNumber: { type: "text", contentEditable: true },
            }
        },
        ...sharedFields
    },
    render: (props: ProcessTimelineBlockProps) => (
        <Section
            {...props}
            id={props.sectionId}
        >
            <Flex direction="col" align="center" gap="16">
                <Typography variant="h2" align="center" color="slate-900">
                    {props.title || "Our Process"}
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
                            align="center"
                            gap="6"
                            className="text-center group flex-1 min-w-[280px]"
                        >
                            <Flex
                                align="center"
                                justify="center"
                                className="w-20 h-20 bg-nb-green text-slate-900 shadow-[0_15px_30px_rgba(43,238,108,0.3)] rounded-full text-3xl font-black group-hover:scale-110 transition-transform ring-8 ring-white"
                            >
                                {i + 1}
                            </Flex>
                            <div className="space-y-3">
                                <Typography variant="h4" color="slate-900" className="group-hover:text-nb-green transition-colors">
                                    {item.title}
                                </Typography>
                                <Typography variant="small" color="slate-500">
                                    {item.description}
                                </Typography>
                            </div>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    )
};
