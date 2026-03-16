"use client";

import { Section } from "@/components/ui/Section";
import { Flex } from "@/components/ui/Flex";
import { Typography } from "@/components/ui/Typography";
import NextImage from "next/image";

interface CategoryPortfolioProps {
    title?: string;
    description?: string;
    categories?: {
        title: string;
        description: string;
        tags: string[];
        image?: string;
        accentColor: string;
    }[];
    paddingTop?: string;
    paddingBottom?: string;
    backgroundVariant?: "white" | "slate-50" | "slate-900" | "nb-green" | "glass-white" | "glass-dark";
}

export const CategoryPortfolio = ({
    title = "Category Portfolios",
    description = "Tailored solutions for every niche of the personal care market, from organic cleansers to professional scalp treatments.",
    categories = [
        {
            title: "Hair Care",
            description: "Shampoos, conditioners, and specialized scalp treatments engineered for professional results.",
            tags: ["Sulfate Free", "Organic", "Scalp Care"],
            accentColor: "#2BEE6C",
        },
        {
            title: "Skin Care",
            description: "Anti-aging serums, moisturizers, and organic cleansers with breakthrough active textures.",
            tags: ["Anti-Aging", "Hydrating", "Vegan"],
            accentColor: "#1e293b",
        },
        {
            title: "Grooming",
            description: "Modern male grooming, beard care, and daily essentials for the contemporary professional.",
            tags: ["Beard Care", "Styling", "Essentials"],
            accentColor: "#64748b",
        }
    ],
    paddingTop = "32",
    paddingBottom = "32",
    backgroundVariant = "white",
    id,
    catalogs,
    ...props
}: CategoryPortfolioProps & Record<string, any>) => {
    const displayCategories = categories || catalogs || [];
    return (
        <Section
            variant={backgroundVariant}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
            id={id || (props as any).id}
            dataBlock={(props as any)["data-block"]}
        >
            <Flex direction="col" gap="16">
                <div className="max-w-xl space-y-6">
                    <div className="w-12 h-1 bg-nb-green rounded-full" />
                    <Typography variant="section-title" color="slate-900">
                        {title}
                    </Typography>
                    <Typography variant="body" color="slate-600">
                        {description}
                    </Typography>
                </div>

                <Flex direction="row" mobileDirection="col" gap="8" className="w-full">
                    {displayCategories.map((category, i) => (
                        <div
                            key={i}
                            className="group relative flex-1 aspect-[3/4] rounded-[48px] overflow-hidden bg-slate-100 flex flex-col justify-end p-10 hover:-translate-y-4 transition-all duration-700 shadow-2xl"
                        >
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10" />

                            {/* Image placeholder/rendering */}
                            {category.image ? (
                                <NextImage 
                                    src={category.image} 
                                    alt={category.title} 
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">
                                    {category.title === "Hair Care" ? "🧴" : category.title === "Skin Care" ? "✨" : "🧔"}
                                </div>
                            )}

                            <div className="relative z-20 space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {(category.tags || []).map((tag: any, j: number) => {
                                        const tagName = typeof tag === 'string' ? tag : (tag?.name || "");
                                        if (!tagName) return null;
                                        return (
                                            <span key={j} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/10">
                                                {tagName}
                                            </span>
                                        );
                                    })}
                                </div>

                                <h3 className="text-4xl font-black text-white italic">
                                    {category.title}
                                </h3>

                                <p className="text-slate-300 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {category.description}
                                </p>

                                <button className="w-12 h-12 bg-nb-green rounded-full flex items-center justify-center text-slate-900 shadow-xl transform translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-xl font-bold">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </Flex>
            </Flex>
        </Section>
    );
};
