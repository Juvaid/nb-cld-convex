const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });
const fs = require('fs');
const path = require('path');

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Load Modern Home Data from JSON
const homeDataPath = path.join(__dirname, "../data/home-page-data.json");
const homeData = JSON.parse(fs.readFileSync(homeDataPath, "utf8"));

// Scraped Data Structures
const aboutData = {
    content: [
        {
            type: "AboutHero",
            props: {
                id: "AboutHero-about",
                badgeText: "Our Story",
                title: "About Nature's Boon",
                description: "A legacy of excellence in personal care manufacturing since 2006."
            }
        },
        {
            type: "AboutJourney",
            props: {
                id: "AboutJourney-about",
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
                id: "WhyChooseUs-about",
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
        header: homeData.root.header,
        footer: homeData.root.footer,
        props: { title: "About Us" }
    }
};

const servicesData = {
    content: [
        {
            type: "AboutHero",
            props: {
                id: "AboutHero-services",
                badgeText: "What We Offer",
                title: "End-to-End Solutions for Your Personal Care Brand",
                description: "From concept to shelf — we provide comprehensive services to build, grow, and scale your brand."
            }
        },
        {
            type: "ServiceDetailList",
            props: {
                id: "ServiceDetailList-services",
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
                    }
                ]
            }
        },
        {
            type: "ProcessSteps",
            props: {
                id: "ProcessSteps-services",
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
                id: "CallToAction-services",
                heading: "Start Your Brand Journey With Us",
                description: "Let our team of experts help you create the perfect personal care product line.",
                buttonText: "Request a Consultation",
                buttonLink: "/contact"
            }
        }
    ],
    root: {
        header: homeData.root.header,
        footer: homeData.root.footer,
        props: { title: "Our Services" }
    }
};

const contactData = {
    content: [
        {
            type: "AboutHero",
            props: {
                id: "AboutHero-contact",
                badgeText: "Contact Us",
                title: "Let's Build Something Great Together",
                description: "Have a question or want to discuss a new project? We're here to help."
            }
        },
        {
            type: "ContactSection",
            props: {
                id: "ContactSection-contact",
                heading: "Get in Touch",
                infoItems: [
                    { label: 'Phone', value: '+91 97818 00033', icon: 'Phone' },
                    { label: 'Email', value: 'info@naturesboon.com', icon: 'Mail' },
                    { label: 'Factory Address', value: 'Plot No 123, JLPL Industrial Area, Sector 82, Mohali, Punjab - 140308', icon: 'MapPin' },
                    { label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM', icon: 'Clock' },
                ],
                departmentEmails: [
                    { label: 'Sales', email: 'sales@naturesboon.com' },
                    { label: 'Support', email: 'support@naturesboon.com' },
                    { label: 'Export', email: 'exports@naturesboon.com' },
                ]
            }
        }
    ],
    root: {
        header: homeData.root.header,
        footer: homeData.root.footer,
        props: { title: "Contact Us" }
    }
};

async function seed() {
    try {
        console.log("Seeding Home Page...");
        await client.mutation("ingestion_mutations:saveIngestedPage", {
            path: "/",
            title: "Home",
            data: JSON.stringify(homeData)
        });

        console.log("Seeding Services Page...");
        await client.mutation("ingestion_mutations:saveIngestedPage", {
            path: "/services",
            title: "Services",
            data: JSON.stringify(servicesData)
        });

        console.log("Seeding About Page...");
        await client.mutation("ingestion_mutations:saveIngestedPage", {
            path: "/about",
            title: "About Us",
            data: JSON.stringify(aboutData)
        });

        console.log("Seeding Contact Page...");
        await client.mutation("ingestion_mutations:saveIngestedPage", {
            path: "/contact",
            title: "Contact Us",
            data: JSON.stringify(contactData)
        });

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Seeding failed:", err);
    }
}

seed();
