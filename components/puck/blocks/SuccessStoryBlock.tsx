import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { Button } from "../../ui/Button";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface SuccessStoryBlockProps extends SharedFieldProps {
    title?: string;
    stories?: Array<{
        brand?: string;
        metrics?: string;
        product?: string;
        description?: string;
    }>;
}

export const SuccessStoryBlockConfig: ComponentConfig<SuccessStoryBlockProps> = {
    fields: {
        title: { type: "text", contentEditable: true },
        stories: {
            type: "array",
            getItemSummary: (s: any) => s.brand || "Case Study",
            arrayFields: {
                brand: { type: "text", contentEditable: true },
                metrics: { type: "text", contentEditable: true },
                product: { type: "text", contentEditable: true },
                description: { type: "textarea", contentEditable: true },
            }
        },
        ...sharedFields
    },
    render: (props: any) => (
        <Section
            {...props}
            id={props.sectionId}
        >
            <Flex direction="col" gap="16">
                <Typography variant="h2" color="slate-900" className="max-w-xl">
                    {props.title || "Helping Global Brands Redefine Beauty Standards"}
                </Typography>

                <Flex
                    direction={props.flexDirection || "row"}
                    justify={props.flexJustify || "center"}
                    align={props.flexAlign || "stretch"}
                    gap={props.gap || "10"}
                    wrap
                    className="w-full"
                >
                    {(props.stories || []).map((story: any, i: number) => (
                        <Flex
                            key={i}
                            direction="col"
                            justify="between"
                            className="bg-white p-12 rounded-[48px] shadow-sm hover:shadow-2xl border border-slate-50 transition-all flex-1 min-w-[340px]"
                        >
                            <Flex direction="col" gap="6">
                                <Flex align="center" gap="3">
                                    <div className="w-8 h-[2px] bg-nb-green" />
                                    <Typography variant="detail" color="nb-green">
                                        {story.metrics}
                                    </Typography>
                                </Flex>
                                <div className="space-y-2">
                                    <Typography variant="h3" color="slate-900">
                                        {story.brand}
                                    </Typography>
                                    <Typography variant="small" color="slate-400" className="italic font-bold">
                                        {story.product}
                                    </Typography>
                                </div>
                                <Typography variant="body" color="slate-600">
                                    {story.description}
                                </Typography>
                            </Flex>
                            <div className="mt-10 pt-8 border-t border-slate-50">
                                <Button variant="ghost" size="sm" icon={<span className="text-lg">→</span>} className="text-nb-green p-0 hover:bg-transparent hover:translate-x-2">
                                    EXPLORE CASE STUDY
                                </Button>
                            </div>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Section>
    )
};
