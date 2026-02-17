import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONTENT_DIR = "nb scraped data/output/content";

async function ingestPrivateLabel() {
    const puckData = {
        content: [
            {
                type: "NatureBoonHero",
                props: {
                    title: "Best Skin Care Product Manufacturers in India",
                    subtitle: "Your Partnership Ecosystem",
                    description: "The one-stop destination for the best skincare products is Nature’s Boon! We offer you various skincare items to meet multiple demands.",
                    buttonText: "Request Sample",
                    id: "hero-pl"
                }
            },
            {
                type: "IconBenefits",
                props: {
                    title: "Advantages of Partnering with Nature's Boon",
                    benefits: [
                        { title: "Rich Heritage", description: "Immerse yourself in a skincare legacy shaped by years of experience and expertise." },
                        { title: "Quality Assurance", description: "Rest easy knowing that every product is subjected to rigorous quality checks." },
                        { title: "Innovative Formulations", description: "Indian skin care manufacturers at the forefront of innovation." },
                        { title: "Natural Ingredients", description: "Experience the goodness of nature in every skincare ritual." },
                        { title: "Diverse Range", description: "Cleansers, moisturizers, serums, and masks - we offer it all." },
                        { title: "Affordability", description: "Elevate your skincare without breaking the bank." }
                    ],
                    id: "benefits-pl"
                }
            },
            {
                type: "ProcessTimeline",
                props: {
                    title: "Our 5-Stage Manufacturing Excellence",
                    steps: [
                        { title: "Ingredient Selection", description: "Researching high-quality organic and herbal ingredients." },
                        { title: "Blending", description: "Precise balance of organic ingredients and herbs." },
                        { title: "Quality Control", description: "Stringent measures at every stage to ensure purity." },
                        { title: "Packaging", description: "Eco-friendly options that minimize environmental impact." },
                        { title: "Innovation", description: "Continuous priority given to novel components." }
                    ],
                    id: "process-pl"
                }
            },
            {
                type: "FAQAccordion",
                props: {
                    title: "Industry & Service FAQs",
                    questions: [
                        { question: "How do I choose a skin care line manufacturer?", answer: "Launcing a brand? Work with a specialist. Inquire about their client base and industry expertise." },
                        { question: "What are third party companies?", answer: " Commercial entities that supply products or services directly to an organization on its behalf." },
                        { question: "How long does it take for development?", answer: "Development can take anywhere from several months to a year depending on formulation and testing." },
                        { question: "What is the minimum order quantity?", answer: "Typically ranges from 100 to 1000 units, but varies by company." }
                    ],
                    id: "faq-pl"
                }
            },
            { type: "CTA", props: { title: "Ready to launch your own private label brand?", buttonText: "Get Started Now", id: "cta-pl" } }
        ],
        root: { props: { title: "Private Label Skincare - Nature's Boon" } }
    };

    const payload = {
        path: "/services/private-label-skincare",
        title: "Private Label Skincare",
        data: JSON.stringify(puckData)
    };

    await sendToConvex(payload, "Private Label");
}

async function ingestCaseStudies() {
    const puckData = {
        content: [
            {
                type: "NatureBoonHero",
                props: {
                    title: "B2B Success Stories",
                    subtitle: "Proven Results",
                    description: "See how we've helped leading cosmetic brands scale with premium formulations and reliable manufacturing.",
                    buttonText: "Become a Partner",
                    id: "hero-cs"
                }
            },
            {
                type: "SuccessStory",
                props: {
                    title: "Live Market Transformations",
                    stories: [
                        {
                            brand: "Luster Cosmetics",
                            product: "Lacto Dark Spot Remover",
                            metrics: "1 Lakh+ Units Sold",
                            description: "Achieved thousands of positive reviews on all major e-commerce marketplaces. Manufactured with unique natural formulations using lacto protein."
                        },
                        {
                            brand: "Nuskhe by Paras",
                            product: "Pigmentation & Hyaluronic Range",
                            metrics: "Rapid Popularity",
                            description: "Immense popularity in a short time. Comprehensive regimens including face wash, gel, scrub, and mask based on natural humectants."
                        }
                    ],
                    id: "success-cs"
                }
            },
            { type: "CTA", props: { title: "Want to be our next success story?", buttonText: "Contact Sales", id: "cta-cs" } }
        ],
        root: { props: { title: "Case Studies - Nature's Boon" } }
    };

    const payload = {
        path: "/case-studies",
        title: "Case Studies",
        data: JSON.stringify(puckData)
    };

    await sendToConvex(payload, "Case Studies");
}

async function ingestContact() {
    const puckData = {
        content: [
            {
                type: "NatureBoonHero",
                props: {
                    title: "Get in Touch",
                    subtitle: "Contact Us",
                    description: "Nature’s Boon is based in Ludhiana, Punjab. We provide comprehensive services for brand owners.",
                    buttonText: "Location",
                    id: "hero-contact"
                }
            },
            {
                type: "FeatureGrid",
                props: {
                    items: [
                        { title: "Address", description: "Pakhowal Rd, adjoining Britannica International School, Ludhiana, Punjab 141013" },
                        { title: "Phone", description: "07696771693" },
                        { title: "Working Hours", description: "Mon - Sat: 9:00 AM - 6:00 PM" }
                    ],
                    id: "grid-contact"
                }
            },
            { type: "CTA", props: { title: "Drop us an inquiry for custom formulations.", buttonText: "Send Message", id: "cta-contact" } }
        ],
        root: { props: { title: "Contact Us - Nature's Boon" } }
    };

    const payload = {
        path: "/contact",
        title: "Contact Us",
        data: JSON.stringify(puckData)
    };

    await sendToConvex(payload, "Contact");
}

async function sendToConvex(payload, name) {
    const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL.replace(".cloud", ".site");
    console.log(`Sending ${name} data to ${CONVEX_SITE_URL}/ingestPage ...`);

    try {
        const response = await fetch(`${CONVEX_SITE_URL}/ingestPage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            console.log(`${name} ingested successfully!`);
        } else {
            console.error(`${name} ingestion failed:`, result);
        }
    } catch (err) {
        console.error(`${name} error:`, err.message);
    }
}

async function run() {
    await ingestPrivateLabel();
    await ingestCaseStudies();
    await ingestContact();
}

run().catch(console.error);
