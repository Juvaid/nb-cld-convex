"use client";

import { Config } from "@puckeditor/core";
import { SiteHeader } from "@/components/SiteHeader";

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
import { TextBlockConfig } from "./blocks/TextBlock";
import { HeroCarouselBlockConfig } from "./blocks/HeroCarouselBlock";
import { ProductCategoryCarouselBlockConfig } from "./blocks/ProductCategoryCarouselBlock";
import { GoogleReviewsBlockConfig } from "./blocks/GoogleReviewsBlock";

// Composite Macro Blocks
import { HomeEssentialsBlockConfig } from "./blocks/HomeEssentialsBlock";
import { AboutCoreBlockConfig } from "./blocks/AboutCoreBlock";
import { ProductShowcaseBlockConfig } from "./blocks/ProductShowcaseBlock";

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

import { Footer } from "./blocks/Footer";
import { Section } from "../ui/Section";
import LogoMarquee from '../blocks/LogoMarquee';
import ImageCarousel from '../blocks/ImageCarousel';
import VideoCarousel from '../blocks/VideoCarousel';
import { QuickOrderPad } from "./blocks/QuickOrderPad";
import { ComplianceBadges, ComplianceBadgesConfig } from "./blocks/ComplianceBadges";
import { DownloadCenterBlock, DownloadCenterBlockConfig } from "./blocks/DownloadCenterBlock";
import { InstagramCarouselBlockConfig } from "./blocks/InstagramCarouselBlock";
import { ProductDetailBlockConfig } from "./blocks/ProductDetailBlock";

export const config: Config = {
    root: {
        fields: {
            title: { type: "text", label: "Page Title (SEO)" },
            description: { type: "textarea", label: "Meta Description" },
            keywords: { type: "text", label: "Keywords (Comma separated)" },
            ogImage: { 
                type: "custom", 
                label: "OG Image (1200x600)",
                render: ({ value, onChange }: any) => <ImagePicker value={value} onChange={onChange} /> as any
            },
            schemaType: {
                type: "select",
                label: "Schema Type",
                options: [
                    { label: "None (Global Only)", value: "none" },
                    { label: "Product List", value: "product-list" },
                    { label: "Service", value: "service" },
                    { label: "About / Person", value: "about" },
                    { label: "Blog Post", value: "blog-post" },
                    { label: "Contact", value: "contact" }
                ]
            },
            inquiryEmail: { type: "text", label: "Inquiry Notification Email" },
            enableInquiryNotifications: { type: "radio", label: "Enable Email Alerts", options: [{ label: "Yes", value: true }, { label: "No", value: false }] }
        },
        render: ({ children }: import("@puckeditor/core").DefaultRootProps) => {
            return (
                <div className="flex flex-col min-h-screen font-sans bg-white">
                        <SiteHeader />
                        <main className="flex-grow">
                            {children}
                        </main>
                    </div>
            );
        }
    },
    categories: {
        "Carousel & Marquee": { components: ["LogoMarquee", "ImageCarousel", "VideoCarousel", "InstagramCarousel", "ProductCategoryCarousel"] },
        Hero: { components: ["HeroCarousel", "NatureBoonHero", "ModernHero", "OrbitalHero", "ProductGridHero", "BentoGridHero", "LayeredDepthHero", "KineticMarqueeHero", "SwissStyleHero", "StackedCardHero"] },
        Themed: { components: ["NatureBoonExpertise", "NatureBoonStats", "CategoryPortfolio"] },
        "Modern Blocks": { components: ["FeatureGrid", "ModernHero", "ModernServices", "ModernStats", "ModernTestimonials", "AboutHero", "AboutJourney", "WhyChooseUs", "ProductBrowser", "CallToAction", "ServiceDetailList", "ProcessSteps", "ContactSection", "ProductShowcase", "GoogleReviews"] },
        Layout: { components: ["DynamicLayout", "Section", "Spacer"] },
        Marketing: { components: ["ServiceGrid", "CTA", "SuccessStory", "IconBenefits"] },
        B2B: { components: ["QuickOrderPad", "ComplianceBadges", "DownloadCenter", "ProductDetail"] },
        Blog: { components: ["BlogPostStory"] },
        Content: { components: ["TextBlock", "ProcessTimeline", "FAQAccordion", "Section"] },
        Sections: { components: ["TestimonialsSlider", "JourneyHero", "BentoServices"] },
        Footer: { components: ["Footer"] },
        "Page Templates": { components: ["HomeEssentials", "AboutCore", "ProductShowcase"] },
    },
    components: {
        Section: SectionBlockConfig,
        ProductDetail: ProductDetailBlockConfig as any,
        TextBlock: TextBlockConfig,
        Spacer: SpacerBlockConfig,
        DynamicLayout: DynamicLayoutBlockConfig,
        HomeEssentials: HomeEssentialsBlockConfig as any,
        AboutCore: AboutCoreBlockConfig as any,
        NatureBoonHero: NatureBoonHeroConfig as any,
        NatureBoonExpertise: NatureBoonExpertiseConfig as any,
        NatureBoonStats: NatureBoonStatsConfig as any,
        CategoryPortfolio: CategoryPortfolioConfig as any,
        ProductCategoryCarousel: ProductCategoryCarouselBlockConfig as any,
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
        HeroCarousel: HeroCarouselBlockConfig,
        GoogleReviews: GoogleReviewsBlockConfig,
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

                const { initialDbCategories, initialDbProducts } = props.initialData || {};

                return (
                    <ProductBrowser
                        {...props}
                        categories={transformedCategories}
                        initialDbCategories={initialDbCategories}
                        initialDbProducts={initialDbProducts}
                    />
                );
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
                        title: { type: "text", contentEditable: true },
                        description: { type: "textarea", contentEditable: true },
                        icon: {
                            type: "custom",
                            label: "Small Icon (Lucide Name or Image)",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        },
                        image: {
                            type: "custom",
                            label: "Large Card Image (Optional)",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        },
                        slug: { type: "text" }
                    }
                },
                ...sharedFields
            },
            defaultProps: {
                useDesignSystem: true,
                services: []
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
                heading: { type: "text" },
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
                const globalStats = props.initialData?.globalStats;
                const finalStats = props.useGlobalStats && globalStats?.length > 0
                  ? globalStats
                  : (props.stats || []);
                return <ModernStats {...props} stats={finalStats as any} id={props.id} />
            }
        },
        ModernTestimonials: {
            fields: {
                badgeText: { type: "text" },
                heading: { type: "text" },
                description: { type: "textarea" },
                layout: {
                    type: "radio",
                    options: [
                        { label: "Split", value: "split" },
                        { label: "Centered", value: "centered" }
                    ]
                },
                animationType: {
                    type: "radio",
                    options: [
                        { label: "Spring", value: "spring" },
                        { label: "Fade", value: "fade" },
                        { label: "Slide", value: "slide" }
                    ]
                },
                themeColor: { type: "text", label: "Accent Color (HEX)" },
                testimonials: {
                    type: "array",
                    getItemSummary: (t: any) => t.author || "Testimonial",
                    arrayFields: {
                        author: { type: "text" },
                        company: { type: "text" },
                        content: { type: "textarea" },
                        rating: { type: "number" },
                        avatar: {
                            type: "custom",
                            render: ({ value, onChange }: any) => (
                                <ImagePicker value={value} onChange={onChange} />
                            )
                        }
                    }
                }
            },
            render: (props: any) => <ModernTestimonials {...props} />
        },
        LogoMarquee: {
            fields: {
                title: { type: "text", label: "Heading (Leave empty to hide)" },
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
                        alt: { type: "text", label: "Brand Name / Alt Text" },
                    }
                },
                size: {
                    type: "radio", label: "Logo Size",
                    options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }]
                },
                colorMode: {
                    type: "select", label: "Color Treatment",
                    options: [
                        { label: "Grayscale to Color On Hover", value: "grayscale-to-color" },
                        { label: "Always Grayscale", value: "grayscale" },
                        { label: "Always Color", value: "color" }
                    ]
                },
                gap: { type: "number", label: "Gap Between Logos (rem)" },
                speed: { type: "number", label: "Speed (seconds, higher = slower)" },
                direction: {
                    type: "select", label: "Scroll Direction",
                    options: [{ label: "← Left", value: "left" }, { label: "→ Right", value: "right" }]
                },
                pauseOnHover: {
                    type: "radio", label: "Pause on Hover",
                    options: [{ label: "Yes", value: true }, { label: "No", value: false }]
                },
                paddingTop: { type: "number", label: "Top Padding (rem)" },
                paddingBottom: { type: "number", label: "Bottom Padding (rem)" }
            },
            defaultProps: {
                title: "Trusted by Industry Leaders",
                logos: [{ url: "", alt: "Brand 1" }, { url: "", alt: "Brand 2" }, { url: "", alt: "Brand 3" }],
                speed: 40, direction: 'left', pauseOnHover: true, size: 'md', colorMode: 'grayscale-to-color', gap: 5, paddingTop: 6, paddingBottom: 6
            },
            render: (props: any) => {
                if (!props.logos || props.logos.length === 0) {
                    return (
                        <div className="p-8 text-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 my-8">
                            Logo Marquee Empty. Add logos or this section will be entirely hidden on the live site.
                        </div>
                    );
                }
                return <LogoMarquee {...props} />;
            }
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
        InstagramCarousel: InstagramCarouselBlockConfig,
        ProductShowcase: ProductShowcaseBlockConfig as any,
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
        ComplianceBadges: ComplianceBadgesConfig as any,
        DownloadCenter: DownloadCenterBlockConfig as any,
    },
};

// Force re-evaluation of config to pick up block export changes
