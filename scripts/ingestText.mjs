import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONTENT_DIR = "nb scraped data/output/content";

async function ingestHome() {
    const indexPath = path.join(CONTENT_DIR, "index.txt");
    const content = fs.readFileSync(indexPath, "utf8");
    const lines = content.split("\n");

    console.log("Parsing index.txt for homepage...");

    const stats = [
        { value: "15+", label: "Years Experience" },
        { value: "65+", label: "Strong Family" },
        { value: "200+", label: "Annual SKUs" },
        { value: "75+", label: "R&D Products" },
        { value: "20+ ", label: "Happy Clients" },
        { value: "750+", label: "Tons Capacity" }
    ];

    const services = [
        { title: "Label & Packaging Designing", description: "Essential aspect of branding and marketing strategy." },
        { title: "Customised Finished Product", description: "Satisfaction of market demand through variety." },
        { title: "Trademark + Logo", description: "Establish brand identity and build customer trust." },
        { title: "Digital Marketing", description: "Effectively promote products to target audience." }
    ];

    const puckData = {
        content: [
            { type: "NatureBoonHero", props: { title: "Crafting Beauty with Nature's Essence", subtitle: "Nature's Boon", description: "Leading Manufacturer and Supplier of high quality Personal care range of Products since 2006.", buttonText: "Request a Quote", id: "hero-1" } },
            { type: "NatureBoonStats", props: { stats: stats, id: "stats-1" } },
            { type: "ServiceGrid", props: { title: "Our Professional Services", items: services, id: "services-1" } },
            { type: "CTA", props: { title: "Ready to transform your brand with premium formulations?", buttonText: "Contact Us Today", id: "cta-1" } }
        ],
        root: { props: { title: "Home - Nature's Boon" } }
    };

    const payload = {
        path: "/",
        title: "Home",
        data: JSON.stringify(puckData)
    };

    const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL.replace(".cloud", ".site");
    console.log(`Sending data to ${CONVEX_SITE_URL}/ingestPage ...`);

    const response = await fetch(`${CONVEX_SITE_URL}/ingestPage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.success) {
        console.log("Homepage ingested successfully via HTTP!");
    } else {
        console.error("Ingestion failed:", result);
    }
}

async function ingestAbout() {
    const aboutPath = path.join(CONTENT_DIR, "about-us.txt");
    const content = fs.readFileSync(aboutPath, "utf8");

    console.log("Parsing about-us.txt...");

    const puckData = {
        content: [
            { type: "NatureBoonHero", props: { title: "About Nature's Boon", subtitle: "Our Story", description: "Trusted Manufacturer and Supplier of high quality Personal care range of Products since 2006.", buttonText: "Contact Us", id: "hero-about" } },
            {
                type: "FeatureGrid", props: {
                    items: [
                        { title: "2006", description: "Established in Ludhiana, Punjab." },
                        { title: "Trusted", description: "Recognized as one of the most trusted Manufacturer and Supplier." },
                        { title: "Global Standards", description: "Compliance with international quality standards." }
                    ], id: "features-about"
                }
            },
            { type: "CTA", props: { title: "Partner with India's best third party contract cosmetics manufacturer.", buttonText: "Learn More", id: "cta-about" } }
        ],
        root: { props: { title: "About Us - Nature's Boon" } }
    };

    const payload = {
        path: "/about",
        title: "About Us",
        data: JSON.stringify(puckData)
    };

    const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL.replace(".cloud", ".site");
    console.log(`Sending about data to ${CONVEX_SITE_URL}/ingestPage ...`);

    const response = await fetch(`${CONVEX_SITE_URL}/ingestPage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.success) {
        console.log("About Us ingested successfully!");
    }
}

async function run() {
    await ingestHome();
    await ingestAbout();
}

run().catch(console.error);

