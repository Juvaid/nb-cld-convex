import { Action, Config } from "@puckeditor/core";
import { config } from "./puck/config";
import { SiteHeader } from "./SiteHeader";
import { ThemeProvider } from "./ThemeProvider";
import { Section } from "./ui/Section";
import { Flex } from "./ui/Flex";
import { Typography } from "./ui/Typography";
import { ErrorBoundary } from "./ui/ErrorBoundary";

const legacyMap: Record<string, string> = {
    Hero: "ModernHero",
    Services: "ModernServices",
    Stats: "ModernStats",
    Testimonial: "ModernTestimonials",
    SiteFooter: "Footer",
};

export function PuckRenderer({ data, initialData, configOverride, siteSettings }: { data: any; initialData?: any; configOverride?: Config; siteSettings?: any }) {
    const root = data?.root || {};
    const content = Array.isArray(data?.content) ? data.content : [];
    const { header = {}, footer = {}, ...rootProps } = root.props || {};

    if (typeof window !== "undefined") {
        console.log("PuckRenderer starting - Data:", !!data, "Content Length:", content.length);
    }

    // Use the override config if provided, otherwise fallback to the default global config.
    const activeConfig = configOverride || config;

    return (
        <ThemeProvider>
            <div className="flex flex-col min-h-screen font-sans selection:bg-nb-green/30">
                <SiteHeader {...header} initialSettings={siteSettings} />
                <main className="flex-grow">
                    {content.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-slate-500">No content found for this section.</p>
                        </div>
                    ) : (
                        content.map((block: any, index: number) => {
                            if (!block || !block.type) return null;

                            const type = legacyMap[block.type] || block.type;
                            const componentConfig = (activeConfig.components as any)[type];

                            if (typeof window !== "undefined") {
                                console.log(`PuckRenderer: Rendering block type "${block.type}" (mapped to "${type}") with props:`, block.props);
                            }

                            // Defensive guard for block.props
                            const safeProps = block.props || {};

                            if (componentConfig && componentConfig.render) {
                                return (
                                    <ErrorBoundary key={safeProps.id || `${block.type}-${index}`}>
                                        <div className="puck-block">
                                            {componentConfig.render({ ...safeProps, puck: { renderDropZone: () => null }, initialData } as any)}
                                        </div>
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
            </div>
        </ThemeProvider>
    );
};

