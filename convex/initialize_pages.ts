import { mutation } from "./_generated/server";

export const setupCorePages = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        const pages = [
            {
                path: "/",
                title: "Nature's Boon | Home",
                description: "Your Global Partner in Personal Care Excellence - OEM, Private Label & Contract Manufacturing.",
                data: JSON.stringify({
                    root: {
                        props: {
                            title: "Nature's Boon | Home",
                            header: {
                                contactText: "Expert Advice",
                                links: [
                                    { label: "Home", href: "/" },
                                    { label: "Services", href: "/services" },
                                    { label: "Products", href: "/products" },
                                    { label: "About", href: "/about" },
                                    { label: "Blogs", href: "/blogs" }
                                ]
                            }
                        }
                    },
                    content: [
                        {
                            type: "ModernHero",
                            props: {
                                id: "ModernHero-home",
                                badgeText: "15+ Years of Manufacturing Excellence",
                                title: "Your Global Partner in",
                                titleGradient: "Personal Care Excellence",
                                description: "From formulation to finished product — we manufacture premium personal care products for world-class brands. OEM, Private Label & Contract Manufacturing.",
                                primaryButtonText: "Inquire Now",
                                primaryButtonHref: "/contact",
                                secondaryButtonText: "View Products Range",
                                secondaryButtonHref: "/products",
                                stats: [
                                    { value: "750+", label: "Tons Capacity" },
                                    { value: "200+", label: "SKUs" },
                                    { value: "20+", label: "Global Clients" }
                                ],
                                cards: [
                                    { icon: "Factory", title: "OEM Manufacturing", desc: "Precision production" },
                                    { icon: "FlaskConical", title: "Private Label", desc: "Tailored for your brand" },
                                    { icon: "ShieldCheck", title: "Quality Assurance", desc: "ISO global standards" },
                                    { icon: "Award", title: "R&D Innovation", desc: "Herbal formulations" }
                                ]
                            }
                        },
                        {
                            type: "ModernStats",
                            props: {
                                id: "ModernStats-home",
                                stats: [
                                    { value: "15+", label: "Years of Experience" },
                                    { value: "65+", label: "Strong Family" },
                                    { value: "200+", label: "SKUs Produced Annually" },
                                    { value: "75+", label: "Products by In-house R&D" },
                                    { value: "20+", label: "Happy Clients" },
                                    { value: "750+", label: "Tons Annual Capacity" }
                                ]
                            }
                        },
                        {
                            type: "ModernServices",
                            props: {
                                id: "ModernServices-home",
                                badgeText: "Our Expertise",
                                heading: "Comprehensive Manufacturing Solutions",
                                subheading: "We offer end-to-end solutions for all your personal care manufacturing needs.",
                                services: [
                                    { icon: "Palette", title: "Private Label", description: "Launch your own brand with our ready-to-market formulations and custom packaging solutions." },
                                    { icon: "FlaskConical", title: "Custom Formulation", description: "Our R&D team develops unique, high-performance formulas tailored to your specific requirements." },
                                    { icon: "BadgeCheck", title: "Quality Assurance", description: "Rigorous quality control at every stage ensures products meet the highest international standards." },
                                    { icon: "Megaphone", title: "Contract Manufacturing", description: "Large-scale production capabilities to meet the demands of established global brands." }
                                ]
                            }
                        },
                        {
                            type: "CallToAction",
                            props: {
                                id: "CallToAction-home",
                                heading: "Ready to Scale Your Brand?",
                                description: "Partner with Nature's Boon for world-class manufacturing excellence.",
                                buttonText: "Get a Quote",
                                buttonLink: "/contact"
                            }
                        },
                        {
                            type: "Footer",
                            props: {
                                id: "Footer-home",
                                logoText: "Nature's Boon",
                                description: "Your Global Partner in Personal Care Excellence - OEM, Private Label & Contract Manufacturing.",
                                copyrightText: "© 2026 Nature's Boon Manufacturing. All rights reserved.",
                                backgroundColor: "bg-slate-900",
                                textColor: "text-white",
                                socialLinks: [
                                    { platform: "facebook", href: "#" },
                                    { platform: "instagram", href: "#" },
                                    { platform: "linkedin", href: "#" }
                                ]
                            }
                        }
                    ]
                })
            },
            {
                path: "/about",
                title: "About Us | Nature's Boon",
                description: "A legacy of excellence in personal care manufacturing since 2006.",
                data: JSON.stringify({
                    content: [
                        {
                            type: "AboutHero",
                            props: {
                                id: "about-hero",
                                badgeText: "Our Story",
                                title: "About Nature's Boon",
                                description: "A legacy of excellence in personal care manufacturing since 2006."
                            }
                        },
                        {
                            type: "AboutJourney",
                            props: {
                                id: "about-journey",
                                heading: "Our Journey",
                                introduction: "Established in the year 2006 at Ludhiana (Punjab, India), Nature's Boon is recognized as one of the most trusted Manufacturers and Suppliers of high quality personal care products.",
                                paragraphs: [
                                    "In our journey of manufacturing, we have formulated & packaged for quality brands such as Luster Cosmetics, True Derma Essentials, Man Pride, Pukhraj Herbals, The Man Company, Glamveda, Skinnatura, Nuskhe By Paras, Studd Muffyn, Organic Essence, Taryansh Herbals, and many more.",
                                    "Our own products are marketed under the brand names \"Luster Cosmetics, True Derma Essentials, Man Pride\". These products are processed using best quality ingredients and sophisticated processing technology, formulated as per set industry norms and in compliance with international standards."
                                ],
                                cards: [
                                    { icon: 'Factory', title: 'Advanced Infrastructure', desc: 'State-of-the-art manufacturing, quality testing, warehousing, and packaging facilities.' },
                                    { icon: 'Users', title: 'Experienced Team', desc: 'Skilled professionals ensuring smooth operations at every stage of production.' },
                                    { icon: 'Award', title: 'Quality Commitment', desc: 'Experienced quality controllers monitor the complete process from procurement to dispatch.' },
                                    { icon: 'Target', title: 'Visionary Leadership', desc: 'Under the leadership of Founder & Mentor, Ms. Archana Dhingra, we continue to reach new heights.' }
                                ]
                            }
                        },
                        {
                            type: "WhyChooseUs",
                            props: {
                                id: "about-why-choose-us",
                                heading: "Why Choose Nature's Boon?",
                                items: [
                                    { icon: 'CheckCircle', title: 'ISO Certified Quality', desc: 'All products meet international quality standards with rigorous testing at every stage.' },
                                    { icon: 'FlaskConical', title: 'In-house R&D', desc: '75+ products developed by our dedicated research and development team.' },
                                    { icon: 'Factory', title: 'Scalable Operations', desc: '750+ tons annual capacity with flexible production for brands of all sizes.' },
                                ]
                            }
                        },
                        {
                            type: "Footer",
                            props: {
                                id: "Footer-about",
                                logoText: "Nature's Boon",
                                description: "A legacy of excellence in personal care manufacturing since 2006.",
                                copyrightText: "© 2026 Nature's Boon Manufacturing. All rights reserved.",
                                backgroundColor: "bg-slate-900",
                                textColor: "text-white",
                                socialLinks: [
                                    { platform: "facebook", href: "#" },
                                    { platform: "instagram", href: "#" },
                                    { platform: "linkedin", href: "#" }
                                ]
                            }
                        }
                    ],
                    root: {
                        props: {
                            title: "About Us",
                            header: {
                                logoText: "Nature's Boon",
                                contactText: "Expert Advice",
                                links: [
                                    { label: "Home", href: "/" },
                                    { label: "Services", href: "/services" },
                                    { label: "Products", href: "/products" },
                                    { label: "About", href: "/about" },
                                    { label: "Blogs", href: "/blogs" }
                                ]
                            }
                        }
                    }
                })
            },
            {
                path: "/services",
                title: "Our Services | Nature's Boon",
                description: "From concept to shelf — we provide comprehensive services to build, grow, and scale your brand.",
                data: JSON.stringify({
                    content: [
                        {
                            type: "AboutHero",
                            props: {
                                id: "services-hero",
                                badgeText: "What We Offer",
                                title: "End-to-End Solutions for Your Personal Care Brand",
                                description: "From concept to shelf — we provide comprehensive services to build, grow, and scale your brand."
                            }
                        },
                        {
                            type: "ServiceDetailList",
                            props: {
                                id: "services-list",
                                services: [
                                    {
                                        title: 'Label & Packaging Designing',
                                        description: 'Label and packaging designing is an essential aspect of branding and marketing strategy. We create market-ready packaging that makes your products stand out.',
                                        icon: 'Palette',
                                        slug: 'label-packaging-designing',
                                    },
                                    {
                                        title: 'Customised Finished Product',
                                        description: 'A personal care product design must account for market demand. We develop tailored formulas that satisfy diverse consumer needs.',
                                        icon: 'FlaskConical',
                                        slug: 'customised-finished-product',
                                    },
                                    {
                                        title: 'Trademark & Logo',
                                        description: 'We create trademarks and logos that effectively represent your brand, establish identity, and build customer trust.',
                                        icon: 'BadgeCheck',
                                        slug: 'trademark-logo',
                                    },
                                    {
                                        title: 'Digital Marketing',
                                        description: 'We help brands promote their products and services to their target audience with effective digital marketing strategies.',
                                        icon: 'Megaphone',
                                        slug: 'digital-marketing',
                                    },
                                ]
                            }
                        },
                        {
                            type: "ProcessSteps",
                            props: {
                                id: "services-process",
                                heading: "Our Process",
                                subheading: "How It Works",
                                steps: [
                                    { icon: 'ClipboardList', title: 'Consultation', description: 'Discuss your brand vision, target market, and product requirements.' },
                                    { icon: 'Beaker', title: 'R&D / Formulation', description: 'Our in-house R&D team develops custom formulas tailored to your brand.' },
                                    { icon: 'Factory', title: 'Production', description: 'Scalable manufacturing with rigorous quality control at every stage.' },
                                    { icon: 'Rocket', title: 'Launch Support', description: 'Packaging design, branding, and marketing support for a successful launch.' },
                                ]
                            }
                        },
                        {
                            type: "CallToAction",
                            props: {
                                id: "services-cta",
                                heading: "Start Your Brand Journey With Us",
                                description: "Let our team of experts help you create the perfect personal care product line.",
                                buttonText: "Request a Consultation",
                                buttonLink: "/contact"
                            }
                        },
                        {
                            type: "Footer",
                            props: {
                                id: "Footer-services",
                                logoText: "Nature's Boon",
                                description: "From concept to shelf — we provide comprehensive services to build, grow, and scale your brand.",
                                copyrightText: "© 2026 Nature's Boon Manufacturing. All rights reserved.",
                                backgroundColor: "bg-slate-900",
                                textColor: "text-white",
                                socialLinks: [
                                    { platform: "facebook", href: "#" },
                                    { platform: "instagram", href: "#" },
                                    { platform: "linkedin", href: "#" }
                                ]
                            }
                        }
                    ],
                    root: {
                        props: {
                            title: "Our Services",
                            header: {
                                logoText: "Nature's Boon",
                                contactText: "Expert Advice",
                                links: [
                                    { label: "Home", href: "/" },
                                    { label: "Services", href: "/services" },
                                    { label: "Products", href: "/products" },
                                    { label: "About", href: "/about" },
                                    { label: "Blogs", href: "/blogs" }
                                ]
                            }
                        }
                    }
                })
            },
            {
                path: "/products",
                title: "Our Products | Nature's Boon",
                description: "Premium personal care products manufactured with the finest ingredients and cutting-edge technology.",
                data: JSON.stringify({
                    content: [
                        {
                            type: "AboutHero",
                            props: {
                                id: "products-hero",
                                badgeText: "Our Range",
                                title: "Product Catalog",
                                description: "Premium personal care products manufactured with the finest ingredients and cutting-edge technology."
                            }
                        },
                        {
                            type: "ProductBrowser",
                            props: {
                                id: "products-browser",
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
                                id: "products-cta",
                                heading: "Need a Custom Formulation?",
                                description: "Our in-house R&D team can develop unique formulations tailored to your brand's requirements.",
                                buttonText: "Request Custom Formula",
                                buttonLink: "/contact"
                            }
                        },
                        {
                            type: "Footer",
                            props: {
                                id: "Footer-products",
                                logoText: "Nature's Boon",
                                description: "Premium personal care products manufactured with the finest ingredients and cutting-edge technology.",
                                copyrightText: "© 2026 Nature's Boon Manufacturing. All rights reserved.",
                                backgroundColor: "bg-slate-900",
                                textColor: "text-white",
                                socialLinks: [
                                    { platform: "facebook", href: "#" },
                                    { platform: "instagram", href: "#" },
                                    { platform: "linkedin", href: "#" }
                                ]
                            }
                        }
                    ],
                    root: {
                        props: {
                            title: "Our Products",
                            header: {
                                logoText: "Nature's Boon",
                                contactText: "Expert Advice",
                                links: [
                                    { label: "Home", href: "/" },
                                    { label: "Services", href: "/services" },
                                    { label: "Products", href: "/products" },
                                    { label: "About", href: "/about" },
                                    { label: "Blogs", href: "/blogs" }
                                ]
                            }
                        }
                    }
                })
            },
            {
                path: "/contact",
                title: "Contact Us | Nature's Boon",
                description: "Have a question or want to discuss a new project? We're here to help.",
                data: JSON.stringify({
                    content: [
                        {
                            type: "AboutHero",
                            props: {
                                id: "contact-hero",
                                badgeText: "Contact Us",
                                title: "Let's Build Something Great Together",
                                description: "Have a question or want to discuss a new project? We're here to help."
                            }
                        },
                        {
                            type: "ContactSection",
                            props: {
                                id: "contact-section",
                                heading: "Get in Touch",
                                infoItems: [
                                    { label: 'Phone', value: '+91 97818 00033', icon: 'Phone' },
                                    { label: 'Email', value: 'info@naturesboon.net', icon: 'Mail' },
                                    { label: 'Factory Address', value: 'Plot No 123, JLPL Industrial Area, Sector 82, Mohali, Punjab - 140308', icon: 'MapPin' },
                                    { label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM', icon: 'Clock' },
                                ],
                                departmentEmails: [
                                    { label: 'Sales', email: 'sales@naturesboon.net' },
                                    { label: 'Support', email: 'support@naturesboon.net' },
                                    { label: 'Export', email: 'exports@naturesboon.net' },
                                ]
                            }
                        },
                        {
                            type: "Footer",
                            props: {
                                id: "Footer-contact",
                                logoText: "Nature's Boon",
                                description: "Have a question or want to discuss a new project? We're here to help.",
                                copyrightText: "© 2026 Nature's Boon Manufacturing. All rights reserved.",
                                backgroundColor: "bg-slate-900",
                                textColor: "text-white",
                                socialLinks: [
                                    { platform: "facebook", href: "#" },
                                    { platform: "instagram", href: "#" },
                                    { platform: "linkedin", href: "#" }
                                ]
                            }
                        }
                    ],
                    root: {
                        props: {
                            title: "Contact Us",
                            header: {
                                logoText: "Nature's Boon",
                                contactText: "Expert Advice",
                                links: [
                                    { label: "Home", href: "/" },
                                    { label: "Services", href: "/services" },
                                    { label: "Products", href: "/products" },
                                    { label: "About", href: "/about" },
                                    { label: "Blogs", href: "/blogs" }
                                ]
                            }
                        }
                    }
                })
            },
            {
                path: "/privacy-policy",
                title: "Privacy Policy | Nature's Boon",
                description: "Our commitment to protecting your privacy and personal data.",
                data: JSON.stringify({
                    content: [
                        {
                            type: "TextBlock",
                            props: {
                                id: "privacy-policy-content",
                                content: `
                                    <h1>Privacy Policy</h1>
                                    <p>Last Updated: March 2026</p>
                                    <p>At Nature's Boon, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>
                                    <h2>1. Information We Collect</h2>
                                    <p>We collect information that you provide directly to us, such as when you fill out a contact form or inquire about our services.</p>
                                    <h2>2. How We Use Your Information</h2>
                                    <p>We use the information we collect to provide and improve our services, communicate with you, and comply with legal obligations.</p>
                                    <h2>3. Data Security</h2>
                                    <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access or disclosure.</p>
                                    <h2>4. Contact Us</h2>
                                    <p>If you have any questions about this Privacy Policy, please contact us at info@naturesboon.net.</p>
                                `,
                                alignment: "left",
                                maxWidth: "3xl"
                            }
                        },
                        {
                            type: "Footer",
                            props: {
                                id: "Footer-privacy",
                                logoText: "Nature's Boon",
                                description: "Our commitment to protecting your privacy and personal data.",
                                copyrightText: "© 2026 Nature's Boon Manufacturing. All rights reserved.",
                                backgroundColor: "bg-slate-900",
                                textColor: "text-white"
                            }
                        }
                    ],
                    root: {
                        props: {
                            title: "Privacy Policy"
                        }
                    }
                })
            },
            {
                path: "/terms-of-service",
                title: "Terms of Service | Nature's Boon",
                description: "The terms and conditions governing the use of our website and services.",
                data: JSON.stringify({
                    content: [
                        {
                            type: "TextBlock",
                            props: {
                                id: "terms-of-service-content",
                                content: `
                                    <h1>Terms of Service</h1>
                                    <p>Last Updated: March 2026</p>
                                    <p>Welcome to Nature's Boon. By accessing or using our website, you agree to comply with and be bound by these Terms of Service.</p>
                                    <h2>1. Use of Website</h2>
                                    <p>You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others.</p>
                                    <h2>2. Intellectual Property</h2>
                                    <p>All content on this website, including text, graphics, and logos, is the property of Nature's Boon and is protected by intellectual property laws.</p>
                                    <h2>3. Limitation of Liability</h2>
                                    <p>Nature's Boon shall not be liable for any damages arising out of your use of or inability to use our website.</p>
                                    <h2>4. Governing Law</h2>
                                    <p>These terms are governed by and construed in accordance with the laws of India.</p>
                                `,
                                alignment: "left",
                                maxWidth: "3xl"
                            }
                        },
                        {
                            type: "Footer",
                            props: {
                                id: "Footer-terms",
                                logoText: "Nature's Boon",
                                description: "The terms and conditions governing the use of our website and services.",
                                copyrightText: "© 2026 Nature's Boon Manufacturing. All rights reserved.",
                                backgroundColor: "bg-slate-900",
                                textColor: "text-white"
                            }
                        }
                    ],
                    root: {
                        props: {
                            title: "Terms of Service"
                        }
                    }
                })
            }
        ];

        let createdCount = 0;
        let updatedCount = 0;

        for (const page of pages) {
            const existing = await ctx.db
                .query("pages")
                .withIndex("by_path", (q) => q.eq("path", page.path))
                .unique();

            if (existing) {
                await ctx.db.patch(existing._id, {
                    ...page,
                    lastModified: now,
                    status: "published"
                });
                updatedCount++;
            } else {
                await ctx.db.insert("pages", {
                    ...page,
                    status: "published",
                    lastModified: now,
                    publishedAt: now
                });
                createdCount++;
            }
        }

        return `Success: Created ${createdCount} and updated ${updatedCount} core pages.`;
    }
});
