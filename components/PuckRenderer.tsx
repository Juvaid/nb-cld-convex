"use client";

import React from "react";
import { Section } from "./ui/Section";
import { Flex } from "./ui/Flex";
import { Typography } from "./ui/Typography";
import { Button } from "./ui/Button";

import { NatureBoonHero } from "./sections/NatureBoonHero";
import { NatureBoonExpertise } from "./sections/NatureBoonExpertise";
import { NatureBoonStats } from "./sections/NatureBoonStats";
import { CategoryPortfolio } from "./sections/CategoryPortfolio";

import ModernHero from './scraped/Hero';
import ModernServices from './scraped/ServicesGrid';
import ModernStats from './scraped/StatsCounter';
import ModernTestimonials from './scraped/TestimonialSlider';
import AboutHero from './scraped/AboutHero';
import AboutJourney from './scraped/AboutJourney';
import WhyChooseUs from './scraped/WhyChooseUs';
import ProductBrowser from './scraped/ProductBrowser';
import CallToAction from './scraped/CallToAction';
import ServiceDetailList from './scraped/ServiceDetailList';
import ProcessSteps from './scraped/ProcessSteps';
import ContactSection from './scraped/ContactSection';

// Extracted Block Components
import { ServiceGrid } from "./puck/blocks/ServiceGrid";
import { IconBenefits } from "./puck/blocks/IconBenefits";
import { ProcessTimeline } from "./puck/blocks/ProcessTimeline";
import { SuccessStory } from "./puck/blocks/SuccessStory";
import { FAQAccordion } from "./puck/blocks/FAQAccordion";
import { CTA } from "./puck/blocks/CTA";
import { FeatureGrid } from "./puck/blocks/FeatureGrid";
import { Footer } from "./puck/blocks/Footer";

// Types for components
const componentMap: Record<string, React.FC<any>> = {
    NatureBoonHero: (props: any) => <NatureBoonHero {...props} />,
    NatureBoonExpertise: (props: any) => <NatureBoonExpertise {...props} />,
    NatureBoonStats: (props: any) => <NatureBoonStats {...props} />,
    CategoryPortfolio: (props: any) => <CategoryPortfolio {...props} />,

    // Scraped / Modern Components
    ModernHero: (props: any) => <ModernHero {...props} />,
    // Legacy / Fallback mappings
    Hero: (props: any) => <ModernHero {...props} />,
    Header: () => null,
    Navbar: () => null,
    SiteHeader: () => null,
    Footer: (props: any) => <Footer {...props} />,
    SiteFooter: (props: any) => <Footer {...props} />,

    Services: (props: any) => <ModernServices {...props} />,
    Stats: (props: any) => <ModernStats {...props} />,
    Testimonial: (props: any) => <ModernTestimonials {...props} />,

    ModernServices: (props: any) => <ModernServices {...props} />,
    ModernStats: (props: any) => <ModernStats {...props} />,
    ModernTestimonials: (props: any) => <ModernTestimonials {...props} />,
    AboutHero: (props: any) => <AboutHero {...props} />,
    AboutJourney: (props: any) => <AboutJourney {...props} />,
    WhyChooseUs: (props: any) => <WhyChooseUs {...props} />,
    ProductBrowser: (props: any) => <ProductBrowser {...props} />,
    CallToAction: (props: any) => <CallToAction {...props} />,
    ServiceDetailList: (props: any) => <ServiceDetailList {...props} />,
    ProcessSteps: (props: any) => <ProcessSteps {...props} />,
    ContactSection: (props: any) => <ContactSection {...props} />,

    ServiceGrid: (props: any) => <ServiceGrid {...props} />,
    IconBenefits: (props: any) => <IconBenefits {...props} />,
    ProcessTimeline: (props: any) => <ProcessTimeline {...props} />,
    SuccessStory: (props: any) => <SuccessStory {...props} />,
    FAQAccordion: (props: any) => <FAQAccordion {...props} />,
    CTA: (props: any) => <CTA {...props} />,
    Section: (props: any) => <Section {...props} />,
    Flex: (props: any) => <Flex {...props} />,
    Typography: (props: any) => <Typography {...props} />,
    FeatureGrid: (props: any) => <FeatureGrid {...props} />,
};

import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ThemeProvider } from "./ThemeProvider";

export function PuckRenderer({ data }: { data: any }) {
    if (!data || !data.content) return null;

    const root = data.root || {};
    const { header = {}, footer = {}, ...rootProps } = root.props || {};

    return (
        <ThemeProvider>
            <div className="flex flex-col min-h-screen font-sans selection:bg-nb-green/30">
                <SiteHeader {...header} />
                <main className="flex-grow">
                    {data.content.map((block: any, i: number) => {
                        const Component = componentMap[block.type];
                        if (!Component) return <div key={i}>Unknown block: {block.type}</div>;
                        return <Component key={i} {...block.props} />;
                    })}
                </main>
            </div>
        </ThemeProvider>
    );
}

