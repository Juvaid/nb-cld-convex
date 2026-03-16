"use client";

import { Action, Config } from "@puckeditor/core";
import { config } from "./puck/config";
import { SiteHeader } from "./SiteHeader";
import { Section } from "./ui/Section";
import { Flex } from "./ui/Flex";
import { Typography } from "./ui/Typography";
import { ErrorBoundary } from "./ui/ErrorBoundary";
import { Footer } from "./puck/blocks/Footer";

const legacyMap: Record<string, string> = {
    Hero: "ModernHero",
    Services: "ModernServices",
    Stats: "ModernStats",
    Testimonial: "ModernTestimonials",
    SiteFooter: "Footer",
    CatalogSection: "CategoryPortfolio",
};

export function PuckRenderer({ data, initialData, configOverride, siteSettings }: { data: any; initialData?: any; configOverride?: Config; siteSettings?: any }) {
    const root = data?.root || {};
    const content = Array.isArray(data?.content) ? data.content : [];
    const { header = {}, footer = {}, ...rootProps } = root.props || {};
    // Use the override config if provided, otherwise fallback to the default global config.
    const activeConfig = configOverride || config;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-nb-green/30">
                <SiteHeader {...header} initialSettings={siteSettings} />
                <main id="main-content" className="flex-grow" aria-label="Page content">
                    {content.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-slate-500">No content found for this section.</p>
                        </div>
                    ) : (
                        content.map((block: any, index: number) => {
                            if (!block || !block.type) return null;

                            const type = legacyMap[block.type] || block.type;
                            const componentConfig = (activeConfig.components as any)[type];
                            // Defensive guard for block.props
                            const safeProps = block.props || {};

                            if (componentConfig && componentConfig.render) {
                                const Render = componentConfig.render;
                                return (
                                    <ErrorBoundary key={safeProps.id || block.id || `${block.type}-${index}`}>
                                        <Render 
                                            {...safeProps} 
                                            id={safeProps.id || block.id || `${block.type}-${index}`}
                                            data-block={block.type}
                                            dataBlock={block.type}
                                            puck={{ renderDropZone: () => null }} 
                                            initialData={initialData} 
                                        />
                                    </ErrorBoundary>
                                );
                            }

                            // Special handling for legacy UI components not in config if any
                            if (type === "Section") return <Section key={index} {...block.props} />;
                            if (type === "Flex") return <Flex key={index} {...block.props} />;
                            if (type === "Typography") return <Typography key={index} {...block.props} />;

                            return <div key={index} className="p-4 bg-red-50 text-red-500 text-xs text-center">Unknown block: {block.type}</div>;
                        })
                    )}
                </main>

                {/* Render footer from root.props if no Footer block exists in content */}
                {footer && Object.keys(footer).length > 0 && 
                 !content.some((b: any) => b.type === "Footer" || b.type === "SiteFooter") && (
                    <Footer {...footer} />
                )}
            </div>
    );
};
