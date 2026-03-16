export const aboutPageData = {
    content: [
        {
            type: "AboutHero",
            id: "about-hero",
            props: {
                badgeText: "Manufacturing Excellence Since 2006",
                title: "Engineering Nature's Best",
                description: "Nature's Boon is a premier B2B manufacturer specializing in high-performance personal care, Ayurvedic, and cosmetic formulations for global brands."
            }
        },
        {
            type: "AboutJourney",
            id: "about-journey",
            props: {
                heading: "Our Manufacturing Heritage",
                introduction: "Founded in 2006 in Ludhiana, India, Nature's Boon has evolved from a boutique laboratory into a high-capacity manufacturing powerhouse, trusted by industry leaders and emerging direct-to-consumer brands alike.",
                paragraphs: [
                    "With nearly two decades of expertise, we have perfected the art of scalable manufacturing. Our facilities have successfully formulated and delivered premium products for renowned brands including Luster Cosmetics, True Derma Essentials, The Man Company, Glamveda, and Nuskhe By Paras.",
                    "Our integrated approach combines traditional Ayurvedic wisdom with cutting-edge cosmetic science. Every product manufactured at Nature's Boon conforms to rigorous international standards, ensuring that your brand delivers nothing but the best to the end consumer."
                ],
                cards: [
                    { icon: 'Factory', title: 'Smart Infrastructure', desc: 'Equipped with precision machinery for high-volume production, specialized quality testing labs, and climate-controlled warehousing.' },
                    { icon: 'Users', title: 'Expert Formulators', desc: 'A dedicated team of chemists and researchers committed to developing breakthrough product formulations.' },
                    { icon: 'Award', title: 'Quality Assurance', desc: 'Multi-stage quality control protocols monitoring every phase from raw material sourcing to final dispatch.' },
                    { icon: 'Target', title: 'Strategic Leadership', desc: 'Guided by the vision of Ms. Archana Dhingra, we empower brands to scale with reliability and scientific integrity.' }
                ]
            }
        },
        {
            type: "ComplianceBadges",
            id: "compliance-badges",
            props: {
                title: "Certified Manufacturing Excellence",
                badgeText: "Global Standards",
                columns: 4,
                items: [
                    { name: "GMP Certified", description: "Operating under Good Manufacturing Practices to ensure pharmaceutical-grade safety.", iconName: "ShieldCheck" },
                    { name: "ISO 9001:2015", description: "Certified Quality Management Systems for consistent operational excellence.", iconName: "Globe" },
                    { name: "AYUSH Certified", description: "Approved by India's Ministry of AYUSH for authentic herbal and Ayurvedic production.", iconName: "Leaf" },
                    { name: "B2B Export Ready", description: "Meeting international compliance standards for distribution across global markets.", iconName: "Award" },
                ]
            }
        },
        {
            type: "WhyChooseUs",
            id: "about-why-choose-us",
            props: {
                heading: "The Nature's Boon Advantage",
                items: [
                    { icon: 'CheckCircle', title: 'B2B Reliability', desc: 'Consistency in formulation and delivery that major brands rely on for their supply chain.' },
                    { icon: 'FlaskConical', title: 'Custom R&D', desc: 'Proprietary product development tailored to your brand’s unique market positioning.' },
                    { icon: 'Factory', title: '750+ Tons Capacity', desc: 'Scalable manufacturing capabilities to support your growth from niche plots to mass market.' },
                ]
            }
        },
        {
            type: "VideoCarousel",
            id: "about-factory-video",
            props: {
                badgeText: "Facility Tour",
                title: "Inside Our Manufacturing Plant",
                videos: [
                    {
                        title: "Advanced Formulation Lab",
                        description: "A glimpse into our R&D facility where science meets nature.",
                        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
                        thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                    }
                ]
            }
        }
    ],
    root: {
        props: {
            title: "About Us"
        }
    }
};
