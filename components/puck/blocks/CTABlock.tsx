import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";
import { Typography } from "../../ui/Typography";
import { Button } from "../../ui/Button";
import { PagePicker } from "@/components/PagePicker";
import Link from "next/link";
import { sharedFields, SharedFieldProps } from "../fields/shared";

export interface CTABlockProps extends SharedFieldProps {
    title?: string;
    buttonText?: string;
    buttonHref?: string;
}

export const CTABlockConfig: ComponentConfig<CTABlockProps> = {
    fields: {
        title: { type: "text", contentEditable: true },
        buttonHref: {
            type: "custom",
            render: ({ value, onChange }: any) => (
                <PagePicker value={value} onChange={onChange} />
            )
        },
        ...sharedFields
    },
    render: (props: any) => (
        <Section
            {...props}
            id={props.sectionId}
        >
            <Flex
                direction={props.flexDirection || "col"}
                mobileDirection="col"
                align={props.flexAlign || "center"}
                justify={props.flexJustify || "center"}
                gap={props.gap || "12"}
                className="bg-slate-900 p-20 rounded-[80px] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] w-full text-center"
            >
                {/* Animated Bg Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-nb-green/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-nb-green/5 rounded-full blur-[100px]" />

                <Typography variant="h2" color="white" className="relative z-10 max-w-2xl">
                    {props.title || "Ready to build your brand?"}
                </Typography>

                <Link href={props.buttonHref || "#"}>
                    <Button variant="primary" size="xl" className="relative z-10">
                        {props.buttonText || "Request Consultation"}
                    </Button>
                </Link>
            </Flex>
        </Section>
    )
};
