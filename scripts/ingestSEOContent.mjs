import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONTENT_DIR = "nb scraped data/output/content";

function getFiles(dir) {
    return fs.readdirSync(dir).filter(file => file.endsWith('.txt'));
}

function toTitleCase(str) {
    return str
        .replace(/-/g, ' ')
        .replace(/\.txt$/, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function ingestFile(filename) {
    const filePath = path.join(CONTENT_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    // Clean content and split into paragraphs
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    if (paragraphs.length === 0) {
        console.warn(`Skipping empty file: ${filename}`);
        return;
    }

    const title = toTitleCase(filename);
    const slug = filename.replace(/\.txt$/, '');
    const urlPath = `/${slug}`;

    // B2B Focused Meta Generation
    const b2bTitle = `${title} Bulk Supplier & Wholesale - Nature's Boon`;
    const metaDescription = `Premium ${title} for B2B procurement. We offer bulk manufacturing, standardized extracts, and full documentation (CoA/SDS). Request a 50g sample today.`;

    // Combine all content for the page body (simple approach for now)
    const fullDescription = paragraphs.join("\n\n");

    const puckData = {
        content: [
            {
                type: "NatureBoonHero",
                props: {
                    title: title,
                    subtitle: "Premium Manufacturing",
                    description: fullDescription,
                    buttonText: "Request Quote",
                    buttonHref: "/contact",
                    id: `hero-${slug}`
                }
            },
            {
                type: "CTA",
                props: {
                    title: "Ready to start your project?",
                    buttonText: "Contact Us",
                    buttonHref: "/contact",
                    id: `cta-${slug}`
                }
            }
        ],
        root: { props: { title: b2bTitle } }
    };

    const payload = {
        path: urlPath,
        title: title,
        description: metaDescription,
        data: JSON.stringify(puckData)
    };

    const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL.replace(".cloud", ".site");
    console.log(`Ingesting ${urlPath} ...`);

    try {
        const response = await fetch(`${CONVEX_SITE_URL}/ingestPage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            console.log(`✓ Ingested ${title}`);
        } else {
            console.error(`✗ Failed ${title}:`, result);
        }
    } catch (err) {
        console.error(`Error ingesting ${title}:`, err.message);
    }
}

async function run() {
    console.log("Starting SEO Content Ingestion...");
    const files = getFiles(CONTENT_DIR);
    console.log(`Found ${files.length} files.`);

    for (const file of files) {
        if (file === "index.txt" || file === "about-us.txt" || file === "contact.txt") {
            // content for these already handled by ingestText.mjs
            // But ingestText.mjs doesn't set description metadata.
            // So maybe we SHOULD process them to update the description?
            // The user said "When importing the .txt files from nb scraped data".
            // I'll skip them if they are special cases, or I'll overwrite them with the description.
            // However, ingestText.mjs used specific layouts. Overwriting them with a generic layout might be bad.
            // I will skip them for now to avoid breaking the custom layouts.
            console.log(`Skipping special file: ${file}`);
            continue;
        }
        await ingestFile(file);
    }
    console.log("Ingestion complete.");
}

run().catch(console.error);
