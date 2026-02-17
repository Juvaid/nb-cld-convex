"use client";

import { DropZone } from "@measured/puck";
import { Section } from "../../ui/Section";
import { Flex } from "../../ui/Flex";

interface DynamicLayoutProps {
    type?: "grid" | "flex";
    columns?: number;
    gap?: string;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between" | "evenly";
    mobileColumns?: number;
    [key: string]: any;
}

export const DynamicLayout = ({
    type = "grid",
    columns = 3,
    gap = "6",
    align = "stretch",
    justify = "start",
    mobileColumns = 1,
    ...sectionProps
}: DynamicLayoutProps) => {
    const colClass = {
        1: "md:grid-cols-1",
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
        5: "md:grid-cols-5",
        6: "md:grid-cols-6",
    }[columns as 1 | 2 | 3 | 4 | 5 | 6] || "md:grid-cols-3";

    return (
        <Section {...sectionProps}>
            {type === "grid" ? (
                <div className={`grid grid-cols-1 ${colClass} gap-${gap}`}>
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={i} className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-3xl p-4 hover:border-nb-green/30 transition-colors">
                            <DropZone zone={`column-${i}`} />
                        </div>
                    ))}
                </div>
            ) : (
                <Flex
                    direction="row"
                    align={align}
                    justify={justify}
                    gap={gap}
                    wrap
                    className="w-full"
                >
                    <div className="w-full min-h-[100px] border-2 border-dashed border-slate-100 rounded-3xl p-4">
                        <DropZone zone="flex-content" />
                    </div>
                </Flex>
            )}
        </Section>
    );
};
