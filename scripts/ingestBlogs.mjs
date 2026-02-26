import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONTENT_DIR = "nb scraped data/output/content";
const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

async function ingestBlogs() {
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".txt") && f !== "index.txt" && f !== "about-us.txt" && f !== "contact.txt");

    console.log(`Found ${files.length} potential blog files.`);

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = fs.readFileSync(filePath, "utf8");
        const title = file.replace(".txt", "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        const slug = file.replace(".txt", "");

        const excerpt = content.slice(0, 150).replace(/\n/g, " ") + "...";

        // Structured Puck-like content for the blog
        const puckData = {
            content: [
                {
                    type: "ModernHero",
                    props: {
                        badgeText: "Scientific Insights",
                        title: title,
                        description: excerpt,
                        id: `hero-${slug}`
                    }
                },
                {
                    type: "Section",
                    props: {
                        id: `section-${slug}`,
                        heading: "Detailed Analysis",
                        padding: "py-20"
                    }
                }
            ],
            root: { props: { title: `${title} - Nature's Boon` } }
        };

        const payload = {
            title,
            slug,
            content: JSON.stringify(puckData),
            excerpt,
            author: "Nature's Boon Editorial",
            status: "published"
        };

        console.log(`Ingesting blog: ${title}...`);

        try {
            const response = await fetch(`${CONVEX_SITE_URL}/ingestBlog`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                console.log(`Successfully ingested ${title}`);
            } else {
                console.error(`Failed to ingest ${title}:`, result);
            }
        } catch (error) {
            console.error(`Error ingesting ${title}:`, error);
        }
    }
}

ingestBlogs().catch(console.error);
