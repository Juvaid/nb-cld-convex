import { Config } from "@puckeditor/core";


// Blocks
import { TextBlockConfig } from "./blocks/TextBlock";
import { SpacerBlockConfig } from "./blocks/SpacerBlock";
import { ModernHeroBlockConfig } from "./blocks/ModernHeroBlock";
import { CTABlockConfig } from "./blocks/CTABlock";
import { ModernServicesBlockConfig } from "./blocks/ModernServicesBlock";
import { SuccessStoryBlockConfig } from "./blocks/SuccessStoryBlock";

export const blogConfig: Config = {
    components: {
        TextBlock: TextBlockConfig,
        Spacer: SpacerBlockConfig,
        ModernHero: ModernHeroBlockConfig,
        CTA: CTABlockConfig,
        ModernServices: ModernServicesBlockConfig,
        SuccessStory: SuccessStoryBlockConfig,
    },
    categories: {
        "Blog Content": {
            components: ["TextBlock", "Spacer"],
        },
        "Marketing": {
            components: ["ModernHero", "CTA", "ModernServices", "SuccessStory"],
        }
    },
    root: {
        render: ({ children }: import("@puckeditor/core").DefaultRootProps) => {
            return (
                <div className="flex flex-col min-h-screen font-sans bg-white overflow-hidden max-w-[800px] mx-auto pt-10">
                        <main className="flex-grow">
                            {children}
                        </main>
                    </div>
            );
        }
    }
};
