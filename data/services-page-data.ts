export const servicesPageData = {
    content: [
        {
            type: "AboutHero",
            id: "services-hero",
            props: {
                badgeText: "What We Offer",
                title: "End-to-End Solutions for Your Personal Care Brand",
                description: "From concept to shelf — we provide comprehensive services to build, grow, and scale your brand."
            }
        },
        {
            type: "ServiceDetailList",
            id: "services-list",
            props: {
                services: [
                    {
                        title: 'Label & Packaging Designing',
                        description: 'Label and packaging designing is an essential aspect of branding and marketing strategy. It involves creating visual designs and layouts for product labels and packaging materials to attract consumers and communicate key information about the product.',
                        icon: 'Palette',
                        slug: 'label-packaging-designing',
                    },
                    {
                        title: 'Customised Finished Product',
                        description: 'A personal care product design must account for market demand. We help in creating products that are tailored to the specific needs of your target audience, ensuring success in the competitive market.',
                        icon: 'FlaskConical',
                        slug: 'customised-finished-product',
                    },
                    {
                        title: 'Trademark & Logo',
                        description: 'We create trademarks and logos that effectively represent your brand identity. Our team ensures that your brand stands out with a unique and memorable visual identity.',
                        icon: 'BadgeCheck',
                        slug: 'trademark-logo',
                    },
                    {
                        title: 'Digital Marketing',
                        description: 'We help brands promote their products and services to their target audience involving SEO, social media marketing, email marketing, and more to increase visibility and sales.',
                        icon: 'Megaphone',
                        slug: 'digital-marketing',
                    },
                ]
            }
        },
        {
            type: "ProcessSteps",
            id: "services-process",
            props: {
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
            id: "services-cta",
            props: {
                heading: "Start Your Brand Journey With Us",
                description: "Let our team of experts help you create the perfect personal care product line.",
                buttonText: "Request a Consultation",
                buttonLink: "/contact"
            }
        }
    ],
    root: {
        props: {
            title: "Our Services"
        }
    }
};
