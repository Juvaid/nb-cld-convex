import { ComponentConfig } from "@puckeditor/core";
import { ImagePicker } from "@/components/ImagePicker";
import OrbitalHero, { OrbitalHeroProps } from "@/components/sections/OrbitalHero";

export const OrbitalHeroBlockConfig: ComponentConfig<OrbitalHeroProps> = {
    label: "Orbital Hero",
    fields: {
        /* ── Content ── */
        headline: {
            type: "text", contentEditable: true,
            label: "Headline",
        },
        highlightWord: {
            type: "text", contentEditable: true,
            label: "Highlight Word/Phrase (must appear in headline)",
        },
        subtext: {
            type: "textarea", contentEditable: true,
            label: "Subtext",
        },

        /* ── Buttons ── */
        primaryButtonText: { type: "text", contentEditable: true, label: "Primary Button Text" },
        primaryButtonHref: { type: "text", contentEditable: true, label: "Primary Button Link" },
        secondaryButtonText: { type: "text", contentEditable: true, label: "Secondary Button Text" },
        secondaryButtonHref: { type: "text", contentEditable: true, label: "Secondary Button Link" },

        /* ── Center Image ── */
        centerImage: {
            type: "custom",
            label: "Center Circle Image",
            render: ({ value, onChange }: any) => (
                <ImagePicker value={value} onChange={onChange} />
            ),
        },

        /* ── Orbit Stats ── */
        stat1Value: { type: "text", contentEditable: true, label: "Stat 1 Value (right card)" },
        stat1Label: { type: "text", contentEditable: true, label: "Stat 1 Label" },
        stat2Value: { type: "text", contentEditable: true, label: "Stat 2 Value (left card)" },
        stat2Label: { type: "text", contentEditable: true, label: "Stat 2 Label" },
        badge1Text: { type: "text", contentEditable: true, label: "Badge 1 Text (ISO / top-left)" },
        badge2Text: { type: "text", contentEditable: true, label: "Badge 2 Text (Est. / top-right)" },

        /* ── Journey Strip ── */
        showJourney: {
            type: "radio",
            label: "Show Journey Animation",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        journeyStep1Label: { type: "text", contentEditable: true, label: "Journey Step 1 Label" },
        journeyStep2Label: { type: "text", contentEditable: true, label: "Journey Step 2 Label" },
        journeyStep3Label: { type: "text", contentEditable: true, label: "Journey Step 3 Label" },

        /* ── Anchor ── */
        sectionId: { type: "text", contentEditable: true, label: "Section ID (for nav anchors)" },
    },

    defaultProps: {
        headline: "Crafting Premium Personal Care",
        highlightWord: "Personal Care",
        subtext:
            "B2B personal care manufacturing powered by botanical innovation, ISO 9001 certified and delivered at global scale.",
        primaryButtonText: "Get a Quote",
        primaryButtonHref: "/contact",
        secondaryButtonText: "Our Story",
        secondaryButtonHref: "/about",
        stat1Value: "750+",
        stat1Label: "Monthly Tons",
        stat2Value: "1500+",
        stat2Label: "Formulations",
        badge1Text: "ISO 9001:2015 ✓",
        badge2Text: "Est. 2006",
        showJourney: true,
        journeyStep1Label: "Manufacturing",
        journeyStep2Label: "Your Brand",
        journeyStep3Label: "Delivered",
    },

    render: (props: any) => <OrbitalHero {...props} />,
};
