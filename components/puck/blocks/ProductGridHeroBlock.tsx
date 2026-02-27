import React from "react";
import { ComponentConfig } from "@puckeditor/core";
import { ImagePicker } from "@/components/ImagePicker";
import ProductGridHero, {
    ProductGridHeroProps,
    OverlayStyle,
} from "@/components/sections/ProductGridHero";

const OVERLAY_OPTIONS: { label: string; value: OverlayStyle }[] = [
    { label: "Emerald Gradient (dark)", value: "emerald-gradient" },
    { label: "Green Solid (brand)", value: "green-solid" },
    { label: "Sage Solid (muted)", value: "sage-solid" },
    { label: "White / Light (bright)", value: "white-light" },
];

export const ProductGridHeroBlockConfig: ComponentConfig<ProductGridHeroProps> = {
    label: "Product Grid Hero",
    fields: {
        badgeText: { type: "text", contentEditable: true, label: "Badge Text" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subtext: { type: "textarea", contentEditable: true, label: "Subtext" },
        sectionId: { type: "text", contentEditable: true, label: "Section ID (anchor)" },
        horizontalPadding: {
            type: "select",
            label: "Horizontal Padding (Left & Right)",
            options: [
                { label: "None (Full Bleed)", value: "0px" },
                { label: "Small (16px)", value: "16px" },
                { label: "Medium (32px)", value: "32px" },
                { label: "Large (48px)", value: "48px" },
                { label: "X-Large (64px)", value: "64px" },
                { label: "2X-Large (96px)", value: "96px" },
            ],
        },
        cards: {
            type: "array",
            label: "Category Cards",
            getItemSummary: (item: any) => item.title || "Card",
            arrayFields: {
                title: { type: "text", contentEditable: true, label: "Title" },
                formulaCount: { type: "text", contentEditable: true, label: "Formula Count Label" },
                image: {
                    type: "custom",
                    label: "Background Image",
                    render: ({ value, onChange }: any) => (
                        <ImagePicker value={value} onChange={onChange} />
                    ),
                },
                href: { type: "text", contentEditable: true, label: "Link URL" },
                overlayStyle: {
                    type: "select",
                    label: "Overlay Style",
                    options: OVERLAY_OPTIONS,
                },
                buttonLabel: { type: "text", contentEditable: true, label: "Button Label" },
            },
        },
    },

    defaultProps: {
        badgeText: "1500+ Formulations Available",
        headline: "What will you create?",
        subtext:
            "Partner with the leading B2B manufacturer for premium personal care products. From concept to shelf, we bring your vision to life.",
        cards: [
            {
                title: "Skin Care",
                formulaCount: "420+ Formulas",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAlrqKkOmY72Ayvh-I_Y6BngOFZk2kOPyS1vD-3KhaxvJZubQ9bOxIBxnj8YKtc_X-lAJ_S6rS4NG7onBfmicvFFQrg3c0jWFPxgrBSFBOdmM23cZEOvdgAq8FtQt6KRmSCt9LuY4fK1pOJXwVNtW5ICNDdP4Dvu32wopuq7w8qOmHnW22BNs2FOs3SBh4mnfjPQfOQm7rakxssJzL5O9HVDpmgZqDvKGL1SumnPgOZViajlxZkQyhiDGHMy_ZO_0-WYHbdl7s8zJ4",
                href: "/products/skin-care",
                overlayStyle: "emerald-gradient",
                buttonLabel: "Explore Category",
            },
            {
                title: "Hair Care",
                formulaCount: "380+ Formulas",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCS9tXjRVDQ4gDt7UEt27b2_oF9DWfx206m4K7WK3yLseEfyIwSQMwZKEYcT5q7eygjY_NEoT81GMekx6XfLLYe7KAbc9ZvBtpYHyBpaAiD-D2FIK5y-uhaYiH3tigozO6GHmnFjtsX8r10p7pf287E_RHJZiv9TKLf2jJeVJUQM0IUbzxkLe5Ua74oLd8DKDi93Pz8GeeOGnOTjmVwqpjIU1HkEwp4KNhYACkgFgYs0DyJXn_hfuepCaUDUG3XYxZUeVaEVhWS6cY",
                href: "/products/hair-care",
                overlayStyle: "green-solid",
                buttonLabel: "Explore Category",
            },
            {
                title: "Body Care",
                formulaCount: "290+ Formulas",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDFkjDWKoPCZePBIXN3hVnK1TPszWUniu27qYpLdagTWFDE7ZIGKBManozPaCgYnl3nOIcSw7vlOzn88PtjE2PFyUNPNyZrTIKA8QLDm-8P_-exG5lajBrLZ4U9SMPQ1p5tDKabiBYO5g2nLEAnf1Rp-jbY5xengR3iqR_sefj9EzVPmTGFctKyHBOSgR06noxAL_8BH9NJG4TNV_ODjdPqLrGpr99mUKNLewpjD0wu_w1IoINqg-BFsKBQ45mcBkm-H1ygEcXtZCU",
                href: "/products/body-care",
                overlayStyle: "sage-solid",
                buttonLabel: "Explore Category",
            },
            {
                title: "Sun Care",
                formulaCount: "110+ Formulas",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3HfCD3lfRmFMsL3QSo1i5foyZ5GZSvblUY3VbbIXsKHYCrfHdajA8cB7MhZWrEFtbCCl7_vj_kQ9VMeWTXzqipHoi-X-88g3dFdYCTLCRzoC-V15M2W9gnbC_QiYmDebK2RkZBHOM370TWGduayc6lnOasC-fCW_KjyM384mkeKJSFff4YH5plj9wBC7660lq32loKRlcUIku_UvxresNQGDmkxKmsGLVu_zFDpVxzQ9xJUFazCzCJibC-dPHkIxYKUisKD1BBN0",
                href: "/products/sun-care",
                overlayStyle: "white-light",
                buttonLabel: "Explore Category",
            },
        ],
    },

    render: (props: any) => <ProductGridHero {...props} />,
};
