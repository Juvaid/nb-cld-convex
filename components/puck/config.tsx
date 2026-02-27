import { Config } from "@puckeditor/core";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";

// Shared Fields
import { sharedFields } from "./fields/shared";

// Modular Blocks
import { SectionBlockConfig } from "./blocks/SectionBlock";
import { DynamicLayoutBlockConfig } from "./blocks/DynamicLayoutBlock";
import { ServiceGridBlockConfig } from "./blocks/ServiceGridBlock";
import { CTABlockConfig } from "./blocks/CTABlock";
import { IconBenefitsBlockConfig } from "./blocks/IconBenefitsBlock";
import { ProcessTimelineBlockConfig } from "./blocks/ProcessTimelineBlock";
import { FAQAccordionBlockConfig } from "./blocks/FAQAccordionBlock";
import { SuccessStoryBlockConfig } from "./blocks/SuccessStoryBlock";
import { BlogPostStoryBlockConfig } from "./blocks/BlogPostStoryBlock";
import { FeatureGridBlockConfig } from "./blocks/FeatureGridBlock";
import { ModernHeroBlockConfig } from "./blocks/ModernHeroBlock";
import { ModernServicesBlockConfig } from "./blocks/ModernServicesBlock";
import { OrbitalHeroBlockConfig } from "./blocks/OrbitalHeroBlock";
import { SpacerBlockConfig } from "./blocks/SpacerBlock";
import { ProductGridHeroBlockConfig } from "./blocks/ProductGridHeroBlock";
import { TestimonialsSliderBlockConfig } from "./blocks/TestimonialsSliderBlock";
import { BentoGridHeroBlockConfig } from "./blocks/BentoGridHeroBlock";
import { LayeredDepthHeroBlockConfig } from "./blocks/LayeredDepthHeroBlock";
import { KineticMarqueeHeroBlockConfig } from "./blocks/KineticMarqueeHeroBlock";
import { JourneyHeroBlockConfig } from "./blocks/JourneyHeroBlock";
import { StackedCardHeroBlockConfig } from "./blocks/StackedCardHeroBlock";
import { SwissStyleHeroBlockConfig } from "./blocks/SwissStyleHeroBlock";
import { BentoServicesBlockConfig } from "./blocks/BentoServicesBlock";

// Components that still need minimal config or are handled specifically
import { NatureBoonHeroConfig } from "./blocks/NatureBoonHeroBlock";
import { NatureBoonExpertiseConfig } from "./blocks/NatureBoonExpertiseBlock";
import { NatureBoonStatsConfig } from "./blocks/NatureBoonStatsBlock";
import { CategoryPortfolioConfig } from "./blocks/CategoryPortfolioBlock";
import { PagePicker } from "@/components/PagePicker";
import { ImagePicker } from "@/components/ImagePicker";
import AboutHero from '../blocks/AboutHero';
import AboutJourney from '../blocks/AboutJourney';
import WhyChooseUs from '../blocks/WhyChooseUs';
import ProductBrowser from '../blocks/ProductBrowser';
import CallToAction from '../blocks/CallToAction';
import ServiceDetailList from '../blocks/ServiceDetailList';
import ProcessSteps from '../blocks/ProcessSteps';
import ContactSection from '../blocks/ContactSection';
import ModernStats from '../blocks/StatsCounter';
import ModernTestimonials from '../blocks/TestimonialSlider';
import ProductCard from "../blocks/ProductCard";
import { ProductSelector } from "./ProductSelector";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Footer } from "./blocks/Footer";
import { Section } from "../ui/Section";
import LogoMarquee from '../blocks/LogoMarquee';
import ImageCarousel from '../blocks/ImageCarousel';
import VideoCarousel from '../blocks/VideoCarousel';
import { QuickOrderPad } from "./blocks/QuickOrderPad";
import { ComplianceBadges } from "./blocks/ComplianceBadges";

export const config: Config = {
    root: {
        fields: {
            inquiryEmail: { type: "text", label: "Inquiry Notification Email" },
            enableInquiryNotifications: { type: "radio", label: "Enable Email Alerts", options: [{ label: "Yes", value: true }, { label: "No", value: false }] }
        },
        render: ({ children }: import("@puckeditor/core").DefaultRootProps) => {
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
        "Carousel & Marquee": { components: ["LogoMarquee", "ImageCarousel", "VideoCarousel"] },
        Hero: { components: ["NatureBoonHero", "ModernHero", "OrbitalHero", "ProductGridHero", "BentoGridHero", "LayeredDepthHero", "KineticMarqueeHero", "SwissStyleHero", "StackedCardHero"] },
        Themed: { components: ["NatureBoonExpertise", "NatureBoonStats", "CategoryPortfolio"] },
        "Modern Blocks": { components: ["FeatureGrid", "ModernHero", "ModernServices", "ModernStats", "ModernTestimonials", "AboutHero", "AboutJourney", "WhyChooseUs", "ProductBrowser", "CallToAction", "ServiceDetailList", "ProcessSteps", "ContactSection", "ProductShowcase"] },
        Layout: { components: ["DynamicLayout", "Section", "Spacer"] },
        Marketing: { components: ["ServiceGrid", "CTA", "SuccessStory", "IconBenefits"] },
        B2B: { components: ["QuickOrderPad", "ComplianceBadges"] },
        Blog: { components: ["BlogPostStory"] },
        Content: { components: ["ProcessTimeline", "FAQAccordion", "Section"] },
        Sections: { components: ["TestimonialsSlider", "JourneyHero", "BentoServices"] },
        Footer: { components: ["Footer"] },
    },
    components: {
        Section: SectionBlockConfig,
        Spacer: SpacerBlockConfig,
        DynamicLayout: DynamicLayoutBlockConfig,
        NatureBoonHero: NatureBoonHeroConfig as any,
        NatureBoonExpertise: NatureBoonExpertiseConfig as any,
        NatureBoonStats: NatureBoonStatsConfig as any,
        CategoryPortfolio: CategoryPortfolioConfig as any,
        ServiceGrid: ServiceGridBlockConfig,
        CTA: CTABlockConfig,
        IconBenefits: IconBenefitsBlockConfig,
        ProcessTimeline: ProcessTimelineBlockConfig,
        FAQAccordion: FAQAccordionBlockConfig,
        SuccessStory: SuccessStoryBlockConfig,
        BlogPostStory: BlogPostStoryBlockConfig,
        FeatureGrid: FeatureGridBlockConfig,
        ModernHero: ModernHeroBlockConfig,
        OrbitalHero: OrbitalHeroBlockConfig,
        ProductGridHero: ProductGridHeroBlockConfig,
        BentoGridHero: BentoGridHeroBlockConfig,
        LayeredDepthHero: LayeredDepthHeroBlockConfig,
        KineticMarqueeHero: KineticMarqueeHeroBlockConfig,
        SwissStyleHero: SwissStyleHeroBlockConfig,
        StackedCardHero: StackedCardHeroBlockConfig,
        TestimonialsSlider: TestimonialsSliderBlockConfig,
        JourneyHero: JourneyHeroBlockConfig,
        BentoServices: BentoServicesBlockConfig,
        ModernServices: ModernServicesBlockConfig,
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
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        },
                        title: { type: "text" },
                        desc: { type: "textarea" }
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <AboutJourney {...props} id={props.sectionId} />
        },
        WhyChooseUs: {
            fields: {
                heading: { type: "text" },
                items: {
                    type: "array",
                    getItemSummary: (item: any) => item.title || "Feature Item",
                    arrayFields: {
                        icon: {
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        },
                        title: { type: "text" },
                        desc: { type: "textarea" }
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <WhyChooseUs {...props} id={props.sectionId} />
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
                                sku: { type: "text" },
                                slug: { type: "text" },
                                images: {
                                    type: "array",
                                    getItemSummary: (img: any) => img.url || "Image URL",
                                    arrayFields: {
                                        url: {
                                            type: "custom",
                                            render: ({ value, onChange }: any) => (
                                                <ImagePicker value={value} onChange={onChange} />
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            render: (props: any) => {
                const transformedCategories = props.categories?.map((cat: any) => ({
                    ...cat,
                    products: cat.products?.map((prod: any) => ({
                        ...prod,
                        images: prod.images?.map((img: any) => img.url)
                    }))
                }));

                return <ProductBrowser {...props} categories={transformedCategories} />;
            }
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
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        },
                        slug: { type: "text" }
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <ServiceDetailList {...props} id={props.sectionId} />
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
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        }
                    }
                },
                ...sharedFields
            },
            render: (props: any) => <ProcessSteps {...props} id={props.sectionId} />
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
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
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
                },
                ...sharedFields
            },
            render: (props: any) => <ContactSection {...props} id={props.sectionId} />
        },
        ModernStats: {
            fields: {
                stats: {
                    type: "array",
                    getItemSummary: (s: any) => s.label || "Stat",
                    arrayFields: {
                        showMedia: sharedFields.showMedia,
                        mediaType: sharedFields.mediaType,
                        mediaIcon: sharedFields.mediaIcon,
                        mediaImage: sharedFields.mediaImage,
                        value: { type: "text" },
                        label: { type: "text" },
                    }
                },
                useGlobalStats: { type: "radio", label: "Use Global Company Stats", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                ...sharedFields
            },
            render: (props: any) => {
                const globalStats = useQuery(api.siteData.getStats);
                const finalStats = props.useGlobalStats ? (globalStats || []) : props.stats;
                return <ModernStats {...props} stats={finalStats as any} id={props.sectionId} />
            }
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
        LogoMarquee: {
            fields: {
                title: { type: "text" },
                logos: {
                    type: "array",
                    getItemSummary: (l: any) => l.alt || "Logo",
                    arrayFields: {
                        url: {
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        },
                        alt: { type: "text" }
                    }
                },
                speed: { type: "number", label: "Speed (seconds, higher = slower)" },
                direction: {
                    type: "select",
                    label: "Scroll Direction",
                    options: [
                        { label: "← Left", value: "left" },
                        { label: "→ Right", value: "right" }
                    ]
                },
                pauseOnHover: {
                    type: "radio",
                    label: "Pause on Hover",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false }
                    ]
                }
            },
            render: (props: any) => <LogoMarquee {...props} />
        },
        ImageCarousel: {
            fields: {
                items: {
                    type: "array",
                    getItemSummary: (i: any) => i.title || "Carousel Item",
                    arrayFields: {
                        url: {
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        },
                        alt: { type: "text" },
                        title: { type: "text" },
                        subtitle: { type: "text" }
                    }
                },
                autoPlay: { type: "radio", label: "Auto Play", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                interval: { type: "number", label: "Interval (ms)" },
                showControls: { type: "radio", label: "Show Controls", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                showDots: { type: "radio", label: "Show Dots", options: [{ label: "Yes", value: true }, { label: "No", value: false }] }
            },
            render: (props: any) => <ImageCarousel {...props} />
        },
        VideoCarousel: {
            fields: {
                badgeText: { type: "text" },
                title: { type: "text" },
                videos: {
                    type: "array",
                    getItemSummary: (v: any) => v.title || "Video",
                    arrayFields: {
                        url: { type: "text", label: "YouTube/Direct URL" },
                        title: { type: "text" },
                        description: { type: "textarea" },
                        thumbnail: {
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        }
                    }
                }
            },
            render: (props: any) => <VideoCarousel {...props} />
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
        },
        QuickOrderPad: {
            render: () => <QuickOrderPad />
        },
        ComplianceBadges: {
            render: () => <ComplianceBadges />
        },
    },
};
