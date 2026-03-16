import { Config } from "@puckeditor/core";


// Blocks
import { TextBlockConfig } from "./blocks/TextBlock";
import { SpacerBlockConfig } from "./blocks/SpacerBlock";
import { InlineImageBlockConfig } from "./blocks/InlineImageBlock";
import { FAQBlockConfig } from "./blocks/FAQBlock";

export const blogConfig: Config = {
    components: {
        TextBlock: TextBlockConfig,
        InlineImage: InlineImageBlockConfig,
        Spacer: SpacerBlockConfig,
        FAQ: FAQBlockConfig,
    },
    categories: {
        "Blog Content": {
            components: ["TextBlock", "InlineImage", "FAQ", "Spacer"],
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
