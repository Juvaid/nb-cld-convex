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

export function PuckRenderer({ data, initialData, configOverride }: { data: any; initialData?: any; configOverride?: Config }) {
    const root = data?.root || {};
    const content = data?.content || [];
    const { header = {}, footer = {}, ...rootProps } = root.props || {};

    // Use the override config if provided, otherwise fallback to the default global config.
    const activeConfig = configOverride || config;

    return (
        <ThemeProvider>
            <div className="flex flex-col min-h-screen font-sans selection:bg-nb-green/30">
                <SiteHeader {...header} />
                <main className="flex-grow">
                    {content.map((block: any, i: number) => {
                        const type = legacyMap[block.type] || block.type;
                        const componentConfig = (activeConfig.components as any)[type];

                        if (componentConfig && componentConfig.render) {
                            return (
                                <ErrorBoundary key={i}>
                                    <div>
                                        {componentConfig.render({ ...block.props, puck: { renderDropZone: () => null }, initialData } as any)}
                                    </div>
                                </ErrorBoundary>
                            );
                        }

                        // Special handling for legacy UI components not in config if any
                        if (type === "Section") return <Section key={i} {...block.props} />;
                        if (type === "Flex") return <Flex key={i} {...block.props} />;
                        if (type === "Typography") return <Typography key={i} {...block.props} />;

                        return <div key={i} className="p-4 bg-red-50 text-red-500 text-xs text-center">Unknown block: {block.type}</div>;
                    })}
                </main>
            </div>
        </ThemeProvider>
    );
}

