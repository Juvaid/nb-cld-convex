"use client";

import React from "react";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";

export interface DynamicLayoutProps {
    children: React.ReactNode;
    type: "grid" | "flex";
    columns?: number;
    justify?: "start" | "center" | "end" | "between" | "evenly";
    gap?: string;
    [key: string]: any;
}

export const DynamicLayout = ({
    children,
    type = "grid",
    columns = 3,
    justify = "start",
    gap = "8",
    ...props
}: DynamicLayoutProps) => {
    if (type === "grid") {
        const gridCols = {
            1: "grid-cols-1",
            2: "grid-cols-1 md:grid-cols-2",
            3: "grid-cols-1 md:grid-cols-3",
            4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
            6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
        }[columns] || "grid-cols-1 md:grid-cols-3";

        const gapClass = `gap-${gap}`;

        return (
            <Section {...props}>
                <div className={`grid ${gridCols} ${gapClass} w-full`}>
                    {children}
                </div>
            </Section>
        );
    }

    return (
        <Section {...props}>
            <Flex
                direction={props.flexDirection || "row"}
                justify={justify as any}
                align={props.flexAlign || "stretch"}
                gap={gap}
                wrap
                className="w-full"
            >
                {children}
            </Flex>
        </Section>
    );
};
