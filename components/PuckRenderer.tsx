import { Action, Config } from "@puckeditor/core";
import { config } from "./puck/config";
import { SiteHeader } from "./SiteHeader";
import { ThemeProvider } from "./ThemeProvider";
import { Section } from "./ui/Section";
import { Flex } from "./ui/Flex";
import { Typography } from "./ui/Typography";

const legacyMap: Record<string, string> = {
    Hero: "ModernHero",
    Services: "ModernServices",
    Stats: "ModernStats",
    Testimonial: "ModernTestimonials",
    SiteFooter: "Footer",
};

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
                        const type = legacyMap[block.type] || block.type;
                        const componentConfig = (config.components as any)[type];

                        if (componentConfig && componentConfig.render) {
                            return (
                                <div key={i}>
                                    {componentConfig.render({ ...block.props, puck: { renderDropZone: () => null } } as any)}
                                </div>
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

