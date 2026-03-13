export const aboutPageData = {
    content: [
        {
            type: "AboutHero",
            id: "about-hero",
            props: {
                badgeText: "20 Years of Excellence",
                title: "About Nature's Boon",
                description: "A legacy of excellence in personal care manufacturing since 2006 (20+ Years)."
            }
        },
        {
            type: "AboutJourney",
            id: "about-journey",
            props: {
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
            id: "about-why-choose-us",
            props: {
                heading: "Why Choose Nature's Boon?",
                items: [
                    { icon: 'CheckCircle', title: 'ISO Certified Quality', desc: 'All products meet international quality standards with rigorous testing at every stage.' },
                    { icon: 'FlaskConical', title: 'In-house R&D', desc: '75+ products developed by our dedicated research and development team.' },
                    { icon: 'Factory', title: 'Scalable Operations', desc: '750+ tons annual capacity with flexible production for brands of all sizes.' },
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
