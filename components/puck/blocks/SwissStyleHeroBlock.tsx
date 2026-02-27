import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import SwissStyleHero, { SwissStyleHeroProps } from "@/components/sections/SwissStyleHero";

export const SwissStyleHeroBlockConfig: ComponentConfig<SwissStyleHeroProps> = {
    label: "Swiss Style Hero",
    fields: {
        category: { type: "text", contentEditable: true, label: "Top Bar Category" },
        issueNumber: { type: "text", contentEditable: true, label: "Top Bar Cert/Issue" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        leftStat: { type: "text", contentEditable: true, label: "Left Stat Value" },
        leftStatLabel: { type: "text", contentEditable: true, label: "Left Stat Label" },
        centerStat: { type: "text", contentEditable: true, label: "Center Stat Value (green)" },
        centerStatLabel: { type: "text", contentEditable: true, label: "Center Stat Label" },
        rightStat: { type: "text", contentEditable: true, label: "Right Stat Value" },
        rightStatLabel: { type: "text", contentEditable: true, label: "Right Stat Label" },
        primaryButtonText: { type: "text", contentEditable: true, label: "CTA Text" },
        primaryButtonHref: { type: "text", contentEditable: true, label: "CTA URL" },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
    },
    defaultProps: {
        category: "MANUFACTURING",
        issueNumber: "ISO 9001",
        headline: "Precision. Purity. Performance.",
        subtext: "B2B personal care manufacturing at its most refined — where botanical heritage meets clinical precision.",
        leftStat: "18+", leftStatLabel: "Years",
        centerStat: "1500+", centerStatLabel: "Formulations",
        rightStat: "750T", rightStatLabel: "Monthly",
        primaryButtonText: "Partner With Us →",
        primaryButtonHref: "/contact",
    },
    render: (props: any) => <SwissStyleHero {...props} />,
};

export default SwissStyleHeroBlockConfig;
