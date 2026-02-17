"use client";

import { Section } from "@/components/ui/Section";
import { Flex } from "@/components/ui/Flex";
import { Typography } from "@/components/ui/Typography";

interface NatureBoonStatsProps {
    stats?: { value: string; label: string }[];
    paddingTop?: string;
    paddingBottom?: string;
    backgroundVariant?: "white" | "slate-50" | "slate-900" | "nb-green" | "glass-white" | "glass-dark";
}

export const NatureBoonStats = ({
    stats = [
        { value: "15+", label: "Years Experience" },
        { value: "200+", label: "Annual SKUs" },
        { value: "750+", label: "Tons Capacity" },
        { value: "65+", label: "Strong Family" }
    ],
    paddingTop = "12",
    paddingBottom = "12",
    backgroundVariant = "white",
}: NatureBoonStatsProps) => {
    return (
        <Section
            variant={backgroundVariant}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
            className="border-y border-slate-100"
        >
            <Flex direction="row" mobileDirection="col" wrap gap="12" justify="between" className="w-full">
                {stats.map((stat, i) => (
                    <Flex key={i} direction="col" align="center" gap="2" className="flex-1 min-w-[150px] p-6 text-center group">
                        <div className="text-5xl font-black text-slate-900 tabular-nums group-hover:text-nb-green transition-colors duration-500">
                            {stat.value}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {stat.label}
                        </div>
                    </Flex>
                ))}
            </Flex>
        </Section>
    );
};
