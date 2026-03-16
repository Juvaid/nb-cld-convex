"use client";

import { Section } from "@/components/ui/Section";
import { Flex } from "@/components/ui/Flex";
import { Typography } from "@/components/ui/Typography";
import NextImage from "next/image";

interface ServiceItem {
    title: string;
    description: string;
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
}

interface NatureBoonExpertiseProps {
    title?: string;
    description?: string;
    items?: ServiceItem[];
    paddingTop?: string;
    paddingBottom?: string;
    backgroundVariant?: "white" | "slate-50" | "slate-900" | "nb-green" | "glass-white" | "glass-dark";
}

export const NatureBoonExpertise = ({
    title = "Core Manufacturing Expertise",
    description = "Leveraging state-of-the-art facilities and scientific precision to bring your vision to market.",
    items = [
        { title: "OEM Manufacturing", description: "Full-scale production using your proprietary formulations.", showMedia: true, mediaType: "icon", mediaIcon: "🏭" },
        { title: "Private Label Solutions", description: "Ready-to-market formulations tailored to your brand identity.", showMedia: true, mediaType: "icon", mediaIcon: "🏷️" },
        { title: "R&D Innovation", description: "In-house scientists developing next-generation active ingredients.", showMedia: true, mediaType: "icon", mediaIcon: "🧪" }
    ],
    paddingTop = "24",
    paddingBottom = "24",
    backgroundVariant = "slate-50",
}: NatureBoonExpertiseProps) => {
    return (
        <Section
            variant={backgroundVariant}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
        >
            <Flex direction="col" align="center" gap="16">
                <Flex direction="col" align="center" gap="4" className="max-w-3xl text-center">
                    <Typography variant="h2" color="slate-900">
                        {title}
                    </Typography>
                    <div className="w-24 h-2 bg-nb-green rounded-full shadow-sm" />
                    <Typography variant="body" color="slate-600" className="mt-4">
                        {description}
                    </Typography>
                </Flex>

                <Flex direction="row" mobileDirection="col" wrap gap="8" justify="center" className="w-full">
                    {items.map((item, i) => (
                        <Flex
                            key={i}
                            direction="col"
                            align="start"
                            gap="6"
                            className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex-1 min-w-[300px]"
                        >
                            {item.showMedia !== false && (
                                <div className="w-16 h-16 bg-nb-green/10 rounded-2xl flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                                    {item.mediaType === "image" && item.mediaImage ? (
                                        <div className="relative w-full h-full">
                                            <NextImage
                                                src={item.mediaImage.startsWith('http') ? item.mediaImage : `/api/storage/${item.mediaImage}`}
                                                fill
                                                className="object-cover"
                                                alt={item.title}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            {item.mediaIcon || "✨"}
                                        </div>
                                    )}
                                </div>
                            )}
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
    );
};
