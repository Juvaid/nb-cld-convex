import { Config } from "@measured/puck";
import { ImagePicker } from "@/components/ImagePicker";
import { Section } from "@/components/ui/Section";
import { Flex } from "@/components/ui/Flex";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";

import { NatureBoonHero } from "@/components/sections/NatureBoonHero";
import { NatureBoonExpertise } from "@/components/sections/NatureBoonExpertise";
import { NatureBoonStats } from "@/components/sections/NatureBoonStats";
import { CategoryPortfolio } from "@/components/sections/CategoryPortfolio";
import { PagePicker } from "@/components/PagePicker";
import { theme } from "@/src/theme";
import { FeatureGrid, FeatureGridProps } from "@/components/sections/FeatureGrid";
import ModernHero from '../scraped/Hero';
import ModernServices from '../scraped/ServicesGrid';
import ModernStats from '../scraped/StatsCounter';
import ModernTestimonials from '../scraped/TestimonialSlider';
import AboutHero from '../scraped/AboutHero';
import AboutJourney from '../scraped/AboutJourney';
import WhyChooseUs from '../scraped/WhyChooseUs';
import ProductBrowser from '../scraped/ProductBrowser';
import CallToAction from '../scraped/CallToAction';
import ServiceDetailList from '../scraped/ServiceDetailList';
import ProcessSteps from '../scraped/ProcessSteps';
import ContactSection from '../scraped/ContactSection';
import { ProductSelector } from "./ProductSelector";
import ProductCard from "../scraped/ProductCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Footer } from "./blocks/Footer";
import { DynamicLayout } from "./blocks/DynamicLayout";

import Link from "next/link";

export const sharedFields = {
    paddingTop: {
        type: "select" as const,
        options: [
            { label: "X-Large (128px)", value: "32" },
            { label: "Large (96px)", value: "24" },
            { label: "Medium (64px)", value: "16" },
            { label: "Small (48px)", value: "12" },
            { label: "X-Small (32px)", value: "8" },
            { label: "None", value: "0" }
        ]
    },
    paddingBottom: {
        type: "select" as const,
        options: [
            { label: "X-Large (128px)", value: "32" },
            { label: "Large (96px)", value: "24" },
            { label: "Medium (64px)", value: "16" },
            { label: "Small (48px)", value: "12" },
            { label: "X-Small (32px)", value: "8" },
            { label: "None", value: "0" }
        ]
    },
    backgroundVariant: {
        type: "select" as const,
        options: [
            { label: "White", value: "white" },
            { label: "Slate 50", value: "slate-50" },
            { label: "Slate 900", value: "slate-900" },
            { label: "Brand Green", value: "nb-green" },
            { label: "Glass White", value: "glass-white" },
            { label: "Glass Dark", value: "glass-dark" }
        ]
    },
    // Flex Controls
    flexDirection: {
        type: "select" as const,
        options: [
            { label: "Horizontal (Row)", value: "row" },
            { label: "Vertical (Column)", value: "col" },
            { label: "Reverse Row", value: "row-reverse" },
            { label: "Reverse Column", value: "col-reverse" }
        ]
    },
    flexAlign: {
        type: "select" as const,
        options: [
            { label: "Start", value: "start" },
            { label: "Center", value: "center" },
            { label: "End", value: "end" },
            { label: "Stretch", value: "stretch" }
        ]
    },
    flexJustify: {
        type: "select" as const,
        options: [
            { label: "Start", value: "start" },
            { label: "Center", value: "center" },
            { label: "End", value: "end" },
            { label: "Space Between", value: "between" },
            { label: "Space Evenly", value: "evenly" }
        ]
    },
    gap: {
        type: "select" as const,
        options: [
            { label: "None", value: "0" },
            { label: "X-Small", value: "4" },
            { label: "Small", value: "8" },
            { label: "Medium", value: "12" },
            { label: "Large", value: "16" },
            { label: "X-Large", value: "20" }
        ]
    },
    // Custom Background & Effects
    backgroundColor: { type: "text" }, // For hex/css colors
    isGlass: { type: "radio", options: [{ label: "Solid", value: false }, { label: "Glass", value: true }] },
    blur: {
        type: "select" as const,
        options: [
            { label: "None", value: "0" },
            { label: "Small (4px)", value: "blur-sm" },
            { label: "Medium (8px)", value: "blur-md" },
            { label: "Large (16px)", value: "blur-lg" },
            { label: "X-Large (24px)", value: "blur-xl" }
        ]
    },
    animation: {
        type: "select" as const,
        options: [
            { label: "None", value: "none" },
            { label: "Fade Up", value: "fade-up" },
            { label: "Fade In", value: "fade-in" },
            { label: "Slide Left", value: "slide-left" },
            { label: "Slide Right", value: "slide-right" },
        ],
    },
    // Professional Design Controls
    shadowIntensity: {
        type: "select" as const,
        options: [
            { label: "None", value: "none" },
            { label: "Soft (Low)", value: "shadow-sm" },
            { label: "Medium", value: "shadow-md" },
            { label: "Large", value: "shadow-lg" },
            { label: "X-Large", value: "shadow-xl" },
            { label: "Intense (2XL)", value: "shadow-2xl" },
            { label: "Inner", value: "shadow-inner" },
        ]
    },
    borderWidth: {
        type: "select" as const,
        options: [
            { label: "None", value: "0" },
            { label: "Thin (1px)", value: "1" },
            { label: "Medium (2px)", value: "2" },
            { label: "Thick (4px)", value: "4" },
            { label: "Heavy (8px)", value: "8" },
        ]
    },
    borderColor: { type: "text" }, // Hex or tailwind class
    borderRadius: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "None", value: "rounded-none" },
            { label: "Small", value: "rounded-sm" },
            { label: "Medium", value: "rounded-md" },
            { label: "Large", value: "rounded-lg" },
            { label: "X-Large", value: "rounded-xl" },
            { label: "Full (Pill)", value: "rounded-full" },
            { label: "Premium (32px)", value: "rounded-[32px]" },
            { label: "Ultra (48px)", value: "rounded-[48px]" },
        ]
    },
    marginTop: {
        type: "select" as const,
        options: [
            { label: "None", value: "0" },
            { label: "Small (16px)", value: "4" },
            { label: "Medium (32px)", value: "8" },
            { label: "Large (64px)", value: "16" },
            { label: "X-Large (128px)", value: "32" },
        ]
    },
    marginBottom: {
        type: "select" as const,
        options: [
            { label: "None", value: "0" },
            { label: "Small (16px)", value: "4" },
            { label: "Medium (32px)", value: "8" },
            { label: "Large (64px)", value: "16" },
            { label: "X-Large (128px)", value: "32" },
        ]
    },
    // Finer Typography Controls
    textColor: { type: "text" },
    fontSize: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "XS (12px)", value: "text-xs" },
            { label: "SM (14px)", value: "text-sm" },
            { label: "Base (16px)", value: "text-base" },
            { label: "LG (18px)", value: "text-lg" },
            { label: "XL (20px)", value: "text-xl" },
            { label: "2XL (24px)", value: "text-2xl" },
            { label: "3XL (30px)", value: "text-3xl" },
            { label: "4XL (36px)", value: "text-4xl" },
            { label: "5XL (48px)", value: "text-5xl" },
            { label: "6XL (60px)", value: "text-6xl" },
        ]
    },
    fontWeight: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "Thin (100)", value: "font-thin" },
            { label: "Light (300)", value: "font-light" },
            { label: "Regular (400)", value: "font-normal" },
            { label: "Medium (500)", value: "font-medium" },
            { label: "SemiBold (600)", value: "font-semibold" },
            { label: "Bold (700)", value: "font-bold" },
            { label: "ExtraBold (800)", value: "font-extrabold" },
            { label: "Black (900)", value: "font-black" },
        ]
    },
    lineHeight: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "None (1)", value: "leading-none" },
            { label: "Tight (1.25)", value: "leading-tight" },
            { label: "Snug (1.375)", value: "leading-snug" },
            { label: "Normal (1.5)", value: "leading-normal" },
            { label: "Relaxed (1.625)", value: "leading-relaxed" },
            { label: "Loose (2)", value: "leading-loose" },
        ]
    },
    letterSpacing: {
        type: "select" as const,
        options: [
            { label: "Default", value: "" },
            { label: "Tighter", value: "tracking-tighter" },
            { label: "Tight", value: "tracking-tight" },
            { label: "Normal", value: "tracking-normal" },
            { label: "Wide", value: "tracking-wide" },
            { label: "Wider", value: "tracking-wider" },
            { label: "Widest", value: "tracking-widest" },
        ]
    },
    textTransform: {
        type: "select" as const,
        options: [
            { label: "None", value: "normal-case" },
            { label: "Uppercase", value: "uppercase" },
            { label: "Lowercase", value: "lowercase" },
            { label: "Capitalize", value: "capitalize" },
        ]
    }
};

export const config: Config = {
    root: {
        fields: {
        },
        render: ({ children }: any) => {
            return (
                <ThemeProvider>
                    <div className="flex flex-col min-h-screen font-sans bg-white">
                        <SiteHeader />
                        <main className="flex-grow">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            );
        }
    },
    categories: {
        Hero: { components: ["NatureBoonHero", "ModernHero"] },
        Themed: { components: ["NatureBoonExpertise", "NatureBoonStats", "CategoryPortfolio"] },
        "Modern Blocks": { components: ["FeatureGrid", "ModernHero", "ModernServices", "ModernStats", "ModernTestimonials", "AboutHero", "AboutJourney", "WhyChooseUs", "ProductBrowser", "CallToAction", "ServiceDetailList", "ProcessSteps", "ContactSection", "ProductShowcase"] },
        Layout: { components: ["DynamicLayout", "Section"] },
        Marketing: { components: ["ServiceGrid", "CTA", "SuccessStory", "IconBenefits"] },
        Content: { components: ["FeatureGridLegacy", "ProcessTimeline", "FAQAccordion", "Section"] },
        Footer: { components: ["Footer"] },
    },
    components: {
        Section: {
            fields: {
                heading: { type: "text" },
                subheading: { type: "text" },
                ...sharedFields
            },
            render: ({ children, ...props }: any) => <Section {...props}>{children}</Section>
        },
        DynamicLayout: {
            fields: {
                type: {
                    type: "radio",
                    options: [
                        { label: "Grid", value: "grid" },
                        { label: "Flex", value: "flex" }
                    ]
                },
                columns: {
                    type: "number",
                    label: "Columns (Desktop)",
                },
                justify: {
                    type: "select",
                    options: [
                        { label: "Start", value: "start" },
                        { label: "Center", value: "center" },
                        { label: "End", value: "end" },
                        { label: "Between", value: "between" },
                        { label: "Evenly", value: "evenly" }
                    ]
                },
                ...sharedFields
            },
            defaultProps: {
                type: "grid",
                columns: 3,
                gap: "8",
                paddingTop: "16",
                paddingBottom: "16"
            },
            render: (props: any) => <DynamicLayout {...props} />
        },
        NatureBoonHero: {
            fields: {
                title: { type: "text" },
                subtitle: { type: "text" },
                description: { type: "textarea" },
                buttonText: { type: "text" },
                buttonHref: {
                    type: "custom",
                    render: ({ value, onChange }: any) => (
                        <PagePicker value={value} onChange={onChange} />
                    )
                },
                image: {
                    type: "custom",
                    render: ({ value, onChange }: any) => (
                        <ImagePicker value={value} onChange={onChange} />
                    )
                },
                ...sharedFields
            },
            render: (props: any) => <NatureBoonHero {...props} />
        },
        NatureBoonExpertise: {
            fields: {
                title: { type: "text" },
                description: { type: "textarea" },
                items: {
                    type: "array",
                    getItemSummary: (item: any) => item.title || "Service Item",
                    arrayFields: {
                        title: { type: "text" },
                        description: { type: "textarea" },
                        icon: { type: "text" },
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <NatureBoonExpertise {...props} />
        },
        NatureBoonStats: {
            fields: {
                stats: {
                    type: "array",
                    getItemSummary: (s: any) => s.label || "Stat",
                    arrayFields: {
                        value: { type: "text" },
                        label: { type: "text" },
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <NatureBoonStats {...props} />
        },
        CategoryPortfolio: {
            fields: {
                title: { type: "text" },
                description: { type: "textarea" },
                categories: {
                    type: "array",
                    getItemSummary: (c: any) => c.title || "Category",
                    arrayFields: {
                        title: { type: "text" },
                        description: { type: "textarea" },
                        tags: { type: "array", arrayFields: { type: "text" } as any },
                        image: {
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        },
                        accentColor: { type: "text" },
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <CategoryPortfolio {...props} />
        },
        ServiceGrid: {
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
                    variant={props.backgroundVariant}
                    paddingTop={props.paddingTop}
                    paddingBottom={props.paddingBottom}
                    backgroundColor={props.backgroundColor}
                    isGlass={props.isGlass}
                    blur={props.blur}
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
        },
        CTA: {
            fields: {
                title: { type: "text" },
                buttonText: { type: "text" },
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
                    variant={props.backgroundVariant}
                    paddingTop={props.paddingTop}
                    paddingBottom={props.paddingBottom}
                    backgroundColor={props.backgroundColor}
                    isGlass={props.isGlass}
                    blur={props.blur}
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
        },
        IconBenefits: {
            fields: {
                title: { type: "text" },
                benefits: {
                    type: "array",
                    getItemSummary: (b: any) => b.title || "Benefit",
                    arrayFields: {
                        title: { type: "text" },
                        description: { type: "textarea" },
                    }
                },
                ...sharedFields
            },
            render: (props: any) => (
                <Section
                    variant={props.backgroundVariant}
                    paddingTop={props.paddingTop}
                    paddingBottom={props.paddingBottom}
                    backgroundColor={props.backgroundColor}
                    isGlass={props.isGlass}
                    blur={props.blur}
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
                            {(props.benefits || []).map((benefit: any, i: number) => (
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
                                            {benefit.title}
                                        </Typography>
                                        <Typography variant="small" color="slate-500">
                                            {benefit.description}
                                        </Typography>
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                </Section>
            )
        },
        ProcessTimeline: {
            fields: {
                title: { type: "text" },
                steps: {
                    type: "array",
                    getItemSummary: (s: any) => s.title || "Timeline Step",
                    arrayFields: {
                        title: { type: "text" },
                        description: { type: "textarea" },
                    }
                },
                ...sharedFields
            },
            render: (props: any) => (
                <Section
                    variant={props.backgroundVariant}
                    paddingTop={props.paddingTop}
                    paddingBottom={props.paddingBottom}
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
                            {(props.steps || []).map((step: any, i: number) => (
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
                                            {step.title}
                                        </Typography>
                                        <Typography variant="small" color="slate-500">
                                            {step.description}
                                        </Typography>
                                    </div>
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                </Section>
            )
        },
        FAQAccordion: {
            fields: {
                title: { type: "text" },
                questions: {
                    type: "array",
                    getItemSummary: (q: any) => q.question || "FAQ Item",
                    arrayFields: {
                        question: { type: "text" },
                        answer: { type: "textarea" },
                    }
                },
                ...sharedFields
            },
            render: (props: any) => (
                <Section
                    variant={props.backgroundVariant}
                    paddingTop={props.paddingTop}
                    paddingBottom={props.paddingBottom}
                >
                    <Flex direction="col" align="center" gap="16" className="max-w-4xl mx-auto">
                        <Flex direction="col" align="center" gap="4" className="text-center">
                            <Typography variant="h2" color="slate-900">
                                {props.title || "Industrial FAQ"}
                            </Typography>
                            <Typography variant="detail" color="slate-500">
                                Everything you need to know about partnering with us
                            </Typography>
                        </Flex>

                        <Flex
                            direction="col"
                            gap="4"
                            className="w-full"
                        >
                            {(props.questions || []).map((item: any, i: number) => (
                                <Flex
                                    key={i}
                                    direction="col"
                                    align="stretch"
                                    className="bg-white border border-slate-100 rounded-[32px] overflow-hidden group hover:border-nb-green transition-all shadow-sm"
                                >
                                    <Flex justify="between" className="p-10 cursor-pointer group-hover:text-nb-green transition-colors">
                                        <Typography variant="h6">
                                            {item.question}
                                        </Typography>
                                        <Flex align="center" justify="center" className="w-10 h-10 rounded-full bg-slate-50 text-nb-green font-light group-hover:bg-nb-green group-hover:text-slate-900 transition-all">
                                            +
                                        </Flex>
                                    </Flex>
                                    <div className="px-10 pb-10">
                                        <Typography variant="small" color="slate-600">
                                            {item.answer}
                                        </Typography>
                                    </div>
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                </Section>
            )
        },
        SuccessStory: {
            fields: {
                title: { type: "text" },
                stories: {
                    type: "array",
                    getItemSummary: (s: any) => s.brand || "Case Study",
                    arrayFields: {
                        brand: { type: "text" },
                        metrics: { type: "text" },
                        product: { type: "text" },
                        description: { type: "textarea" },
                    }
                },
                ...sharedFields
            },
            render: (props: any) => (
                <Section
                    variant={props.backgroundVariant}
                    paddingTop={props.paddingTop}
                    paddingBottom={props.paddingBottom}
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
        },
        FeatureGrid: {
            fields: {
                heading: { type: "text" },
                subheading: { type: "text" },
                columns: {
                    type: "radio",
                    options: [
                        { label: "2 Columns", value: "2" },
                        { label: "3 Columns", value: "3" },
                        { label: "4 Columns", value: "4" },
                    ],
                },
                features: {
                    type: "array",
                    getItemSummary: (item: any) => item.title || "Feature",
                    arrayFields: {
                        icon: { type: "text" },
                        title: { type: "text" },
                        description: { type: "textarea" },
                    },
                    defaultItemProps: {
                        icon: "✨",
                        title: "Amazing Feature",
                        description: "Describe how this helps your users stand out.",
                    },
                },
                ...sharedFields
            },
            defaultProps: {
                heading: "Core Manufacturing Expertise",
                subheading: "Leveraging state-of-the-art facilities and scientific precision to bring your vision to market.",
                columns: "3",
                features: [
                    {
                        icon: "🏭",
                        title: "OEM Manufacturing",
                        description: "Full-scale production using your proprietary formulations with rigorous quality control protocols.",
                    },
                    {
                        icon: "🏷️",
                        title: "Private Label Solutions",
                        description: "Ready-to-market formulations tailored to your brand identity with customizable packaging options.",
                    },
                    {
                        icon: "🔬",
                        title: "R&D Innovation",
                        description: "In-house scientists developing next-generation active ingredients and breakthrough textures.",
                    },
                ],
            },
            render: (props: any) => <FeatureGrid {...props} />
        },
        FeatureGridLegacy: {
            fields: {
                items: {
                    type: "array",
                    getItemSummary: (item: any) => item.title || "Feature Item",
                    arrayFields: {
                        title: { type: "text" },
                        description: { type: "text" },
                    }
                },
                ...sharedFields
            },
            render: (props: any) => (
                <Section
                    variant={props.backgroundVariant}
                    paddingTop={props.paddingTop}
                    paddingBottom={props.paddingBottom}
                >
                    <Flex
                        direction={props.flexDirection || "row"}
                        justify={props.flexJustify || "center"}
                        align={props.flexAlign || "stretch"}
                        gap={props.gap || "8"}
                        wrap
                        className="max-w-7xl mx-auto"
                    >
                        {(props.items || []).map((item: any, i: number) => (
                            <Flex
                                key={i}
                                direction="col"
                                gap="3"
                                className="bg-white p-8 rounded-3xl border border-slate-50 shadow-sm flex-1 min-w-[280px]"
                            >
                                <Typography variant="h6" color="slate-900">
                                    {item.title}
                                </Typography>
                                <Typography variant="small" color="slate-600">
                                    {item.description}
                                </Typography>
                            </Flex>
                        ))}
                    </Flex>
                </Section>
            )
        },
        ModernHero: {
            fields: {
                badgeText: { type: "text" },
                title: { type: "text" },
                titleGradient: { type: "text" },
                description: { type: "textarea" },
                primaryButtonText: { type: "text" },
                primaryButtonHref: { type: "text" },
                secondaryButtonText: { type: "text" },
                secondaryButtonHref: { type: "text" },
                stats: {
                    type: "array",
                    getItemSummary: (s: any) => s.label || "Stat",
                    arrayFields: {
                        value: { type: "text" },
                        label: { type: "text" },
                    }
                },
                cards: {
                    type: "array",
                    getItemSummary: (c: any) => c.title || "Card",
                    arrayFields: {
                        icon: {
                            type: "select",
                            options: [
                                { label: "Factory", value: "Factory" },
                                { label: "Flask", value: "FlaskConical" },
                                { label: "Shield", value: "ShieldCheck" },
                                { label: "Award", value: "Award" },
                                { label: "Zap", value: "Zap" },
                            ]
                        },
                        title: { type: "text" },
                        desc: { type: "text" },
                    }
                },
            },
            render: (props: any) => <ModernHero {...props} />
        },
        ModernServices: {
            fields: {
                badgeText: { type: "text" },
                heading: { type: "text" },
                subheading: { type: "textarea" },
                services: {
                    type: "array",
                    getItemSummary: (s: any) => s.title || "Service",
                    arrayFields: {
                        title: { type: "text" },
                        description: { type: "textarea" },
                        icon: {
                            type: "select",
                            options: [
                                { label: "Palette", value: "Palette" },
                                { label: "Flask", value: "FlaskConical" },
                                { label: "Badge", value: "BadgeCheck" },
                                { label: "Megaphone", value: "Megaphone" },
                            ]
                        }
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <ModernServices {...props} />
        },
        AboutHero: {
            fields: {
                badgeText: { type: "text" },
                title: { type: "text" },
                description: { type: "textarea" },
                ...sharedFields
            },
            render: (props: any) => <AboutHero {...props} />
        },
        AboutJourney: {
            fields: {
                heading: { type: "text" },
                introduction: { type: "textarea" },
                paragraphs: {
                    type: "array",
                    arrayFields: {
                        "Paragraph": { type: "textarea" }
                    }
                },
                cards: {
                    type: "array",
                    getItemSummary: (item: any) => item.title || "Journey Card",
                    arrayFields: {
                        icon: {
                            type: "select",
                            options: [
                                { label: "Factory", value: "Factory" },
                                { label: "Users", value: "Users" },
                                { label: "Award", value: "Award" },
                                { label: "Target", value: "Target" }
                            ]
                        },
                        title: { type: "text" },
                        desc: { type: "textarea" }
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <AboutJourney {...props} />
        },
        WhyChooseUs: {
            fields: {
                heading: { type: "text" },
                items: {
                    type: "array",
                    getItemSummary: (item: any) => item.title || "Feature Item",
                    arrayFields: {
                        icon: {
                            type: "select",
                            options: [
                                { label: "CheckCircle", value: "CheckCircle" },
                                { label: "FlaskConical", value: "FlaskConical" },
                                { label: "Factory", value: "Factory" }
                            ]
                        },
                        title: { type: "text" },
                        desc: { type: "textarea" }
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <WhyChooseUs {...props} />
        },
        ProductBrowser: {
            fields: {
                useDynamicData: { type: "radio", options: [{ label: "Manual (Editor)", value: false }, { label: "Dynamic (Convex)", value: true }] },
                categories: {
                    type: "array",
                    getItemSummary: (item: any) => item.name || "Category",
                    arrayFields: {
                        name: { type: "text" },
                        slug: { type: "text" },
                        description: { type: "textarea" },
                        products: {
                            type: "array",
                            getItemSummary: (item: any) => item.name || "Product",
                            arrayFields: {
                                name: { type: "text" },
                                usp: { type: "text" },
                                images: { type: "array", arrayFields: { type: "text" } as any }
                            }
                        }
                    }
                }
            },
            render: (props: any) => <ProductBrowser {...props} />
        },
        CallToAction: {
            fields: {
                heading: { type: "text" },
                description: { type: "textarea" },
                buttonText: { type: "text" },
                buttonLink: { type: "text" },
            },
            render: (props: any) => <CallToAction {...props} />
        },
        ServiceDetailList: {
            fields: {
                services: {
                    type: "array",
                    getItemSummary: (item: any) => item.title || "Service",
                    arrayFields: {
                        title: { type: "text" },
                        description: { type: "textarea" },
                        icon: {
                            type: "select",
                            options: [
                                { label: "Palette", value: "Palette" },
                                { label: "Flask", value: "FlaskConical" },
                                { label: "Badge", value: "BadgeCheck" },
                                { label: "Megaphone", value: "Megaphone" },
                            ]
                        },
                        slug: { type: "text" }
                    }
                }
            },
            render: (props: any) => <ServiceDetailList {...props} />
        },
        ProcessSteps: {
            fields: {
                heading: { type: "text" },
                subheading: { type: "text" },
                steps: {
                    type: "array",
                    getItemSummary: (item: any) => item.title || "Step",
                    arrayFields: {
                        title: { type: "text" },
                        description: { type: "textarea" },
                        icon: {
                            type: "select",
                            options: [
                                { label: "Clipboard", value: "ClipboardList" },
                                { label: "Beaker", value: "Beaker" },
                                { label: "Factory", value: "Factory" },
                                { label: "Rocket", value: "Rocket" },
                            ]
                        }
                    }
                }
            },
            render: (props: any) => <ProcessSteps {...props} />
        },
        ContactSection: {
            fields: {
                heading: { type: "text" },
                infoItems: {
                    type: "array",
                    getItemSummary: (item: any) => item.label || "Info Item",
                    arrayFields: {
                        label: { type: "text" },
                        value: { type: "text" },
                        icon: {
                            type: "select",
                            options: [
                                { label: "Phone", value: "Phone" },
                                { label: "Mail", value: "Mail" },
                                { label: "MapPin", value: "MapPin" },
                                { label: "Clock", value: "Clock" },
                            ]
                        }
                    }
                },
                departmentEmails: {
                    type: "array",
                    getItemSummary: (item: any) => item.label || "Department",
                    arrayFields: {
                        label: { type: "text" },
                        email: { type: "text" }
                    }
                }
            },
            render: (props: any) => <ContactSection {...props} />
        },
        ModernStats: {
            fields: {
                stats: {
                    type: "array",
                    getItemSummary: (s: any) => s.label || "Stat",
                    arrayFields: {
                        value: { type: "text" },
                        label: { type: "text" },
                    }
                }
            },
            render: (props: any) => <ModernStats {...props} />
        },
        ModernTestimonials: {
            fields: {
                badgeText: { type: "text" },
                heading: { type: "text" },
                description: { type: "textarea" },
                testimonials: {
                    type: "array",
                    getItemSummary: (t: any) => t.author || "Testimonial",
                    arrayFields: {
                        author: { type: "text" },
                        company: { type: "text" },
                        content: { type: "textarea" },
                        rating: { type: "number" },
                    }
                }
            },
            render: (props: any) => <ModernTestimonials {...props} />
        },
        ProductShowcase: {
            fields: {
                selectedProduct: {
                    type: "custom",
                    render: ({ value, onChange }: any) => (
                        <ProductSelector value={value} onChange={onChange} />
                    ),
                },
                ...sharedFields
            },
            render: ({ selectedProduct, ...props }: any) => {
                const product = useQuery(api.product_mutations.getProduct, { id: selectedProduct || "" });

                return (
                    <Section
                        variant={props.backgroundVariant}
                        paddingTop={props.paddingTop}
                        paddingBottom={props.paddingBottom}
                        backgroundColor={props.backgroundColor}
                        isGlass={props.isGlass}
                        blur={props.blur}
                    >
                        <div className="max-w-xl mx-auto">
                            {!selectedProduct ? (
                                <div className="p-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                                    <div className="text-4xl mb-4">🛒</div>
                                    <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        Select a product from the sidebar
                                    </div>
                                </div>
                            ) : !product ? (
                                <div className="p-20 text-center animate-pulse">
                                    <div className="w-12 h-12 bg-nb-green/20 rounded-full mx-auto mb-4" />
                                    <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        Fetching product details...
                                    </div>
                                </div>
                            ) : (
                                <ProductCard category={product as any} />
                            )}
                        </div>
                    </Section>
                );
            }
        },
        Footer: {
            fields: {
                logoText: { type: "text" },
                description: { type: "textarea" },
                copyrightText: { type: "text" },
                backgroundColor: {
                    type: "select",
                    options: [
                        { label: "Dark (Default)", value: "bg-slate-900" },
                        { label: "White", value: "bg-white" },
                        { label: "Light Gray", value: "bg-slate-50" },
                        { label: "Brand Green", value: "bg-nb-green" },
                    ]
                },
                textColor: {
                    type: "select",
                    options: [
                        { label: "White", value: "text-white" },
                        { label: "Slate 900", value: "text-slate-900" },
                        { label: "Slate 500", value: "text-slate-500" },
                    ]
                },
                socialLinks: {
                    type: "array",
                    getItemSummary: (link: any) => link.platform || "Social Link",
                    arrayFields: {
                        platform: {
                            type: "select",
                            options: [
                                { label: "Facebook", value: "facebook" },
                                { label: "Instagram", value: "instagram" },
                                { label: "Twitter", value: "twitter" },
                                { label: "LinkedIn", value: "linkedin" },
                                { label: "GitHub", value: "github" },
                            ]
                        },
                        href: { type: "text" },
                    }
                }
            },
            render: (props: any) => <Footer {...props} />
        }
    },
};
