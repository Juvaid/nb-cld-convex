export const productsPageData = {
    content: [
        {
            type: "AboutHero",
            props: {
                badgeText: "Our Range",
                title: "Product Catalog",
                description: "Premium personal care products manufactured with the finest ingredients and cutting-edge technology."
            }
        },
        {
            type: "ProductBrowser",
            props: {
                categories: [
                    {
                        name: 'Skin Care',
                        slug: 'skin-care',
                        description: 'Comprehensive solutions for radiant and healthy skin.',
                        products: [
                            { name: 'Face Wash', usp: 'Sulphate Free' },
                            { name: 'Facial Kit', usp: 'Premium Ingredients' },
                            { name: 'Face Serum', usp: 'Vitamin C Enriched' },
                            { name: 'Face Cream', usp: 'Deep Moisturizing' },
                            { name: 'D-Tan', usp: 'Natural Extracts' },
                            { name: 'Face Scrub', usp: 'Gentle Exfoliation' },
                            { name: 'Face Mist / Skin Toner', usp: 'pH Balanced' },
                            { name: 'Cleansing Milk', usp: 'Hydrating Formula' },
                            { name: 'Moisturizer', usp: 'All Skin Types' },
                            { name: 'SPF Sunscreen', usp: 'Broad Spectrum' },
                            { name: 'Face Pack & Mask', usp: 'Herbal Blend' },
                            { name: 'Massage Cream', usp: 'Professional Grade' },
                        ]
                    },
                    {
                        name: 'Hair Care',
                        slug: 'hair-care',
                        description: 'Nourishing formulas for strong and shiny hair.',
                        products: [
                            { name: 'Hair Shampoo', usp: 'Paraben Free' },
                            { name: 'Hair Oil', usp: 'Ayurvedic Blend' },
                            { name: 'Hair Serum', usp: 'Frizz Control' },
                        ]
                    },
                    {
                        name: 'Body & Personal Care',
                        slug: 'body-personal-care',
                        description: 'Complete care for your body from head to toe.',
                        products: [
                            { name: 'Body Lotion', usp: 'Deep Nourishing' },
                            { name: 'Hand & Foot Care', usp: 'Intensive Repair' },
                            { name: 'Lip Care', usp: 'Natural SPF' },
                            { name: 'Body Wash', usp: 'Gentle Cleansing' },
                            { name: 'Roll-on Deodorant', usp: '48hr Protection' },
                            { name: 'Hair Removal Wax', usp: 'Skin Friendly' },
                            { name: 'Body Scrub', usp: 'Exfoliating' },
                            { name: 'Body Cream', usp: 'Moisturizing' },
                        ]
                    },
                    {
                        name: "Men's Grooming",
                        slug: 'mens-grooming',
                        description: 'Specialized grooming products designed for men.',
                        products: [
                            { name: 'Beard Oil', usp: 'Natural Growth' },
                            { name: 'Hair Wax', usp: 'Strong Hold' },
                        ]
                    }
                ]
            }
        },
        {
            type: "CallToAction",
            props: {
                heading: "Need a Custom Formulation?",
                description: "Our in-house R&D team can develop unique formulations tailored to your brand's requirements.",
                buttonText: "Request Custom Formula",
                buttonLink: "/contact"
            }
        }
    ],
    root: {
        props: {
            title: "Our Products"
        }
    }
};
