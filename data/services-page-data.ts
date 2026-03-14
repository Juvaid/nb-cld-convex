export const servicesPageData = {
    content: [
        {
            type: "AboutHero",
            id: "services-hero",
            props: {
                badgeText: "Manufacturing & R&D Services",
                title: "Scale Your Brand with Scientific Precision",
                description: "From clinical formulation to mass production — we provide specialized B2B services to help personal care brands dominate their market."
            }
        },
        {
            type: "ServiceDetailList",
            id: "services-list",
            props: {
                services: [
                    {
                        title: 'Contract Manufacturing (OEM/ODM)',
                        description: 'Specialized manufacturing for Skin Care, Hair Care, and Ayurvedic products. We offer flexible production runs, from boutique batches to high-volume commercial manufacturing.',
                        icon: 'Factory',
                        slug: 'contract-manufacturing',
                    },
                    {
                        title: 'Private Label Solutions',
                        description: 'Launch your brand quickly with our pre-verified, high-performance formulations. Choose from our library of 75+ tested products and customize with your own branding.',
                        icon: 'Package',
                        slug: 'private-label',
                    },
                    {
                        title: 'R&D and Custom Formulations',
                        description: 'Our in-house laboratory specializes in creating proprietary formulas tailored to your specific performance requirements and ingredient preferences.',
                        icon: 'FlaskConical',
                        slug: 'custom-formulation',
                    },
                    {
                        title: 'Regulatory & Compliance Support',
                        description: 'We handle all necessary testing and documentation including COA, MSDS, and AYUSH licensing support to ensure your brand is market-ready.',
                        icon: 'ShieldCheck',
                        slug: 'compliance-support',
                    },
                ]
            }
        },
        {
            type: "ProcessSteps",
            id: "services-process",
            props: {
                heading: "Our Production Workflow",
                subheading: "Efficient & Transparent",
                steps: [
                    { icon: 'ClipboardList', title: 'Consultation & Strategy', description: 'Define your product goals, target demographics, and formulation requirements.' },
                    { icon: 'Beaker', title: 'R&D Phase', description: 'Sample development and laboratory testing to ensure performance and stability.' },
                    { icon: 'Factory', title: 'Mass Production', description: 'High-speed manufacturing using precision machinery and real-time quality monitoring.' },
                    { icon: 'Rocket', title: 'Dispatch & Logistics', description: 'Secure packaging and global shipping with full documentation for international customs.' },
                ]
            }
        },
        {
            type: "CallToAction",
            id: "services-cta",
            props: {
                heading: "Ready to Scale Your Production?",
                description: "Consult with our manufacturing experts today to bring your vision to life.",
                buttonText: "Request a Manufacturing Quote",
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
