import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";

import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set");
    process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

// FAQ Extraction Regex (case-insensitive, handles various escaping)
const FAQ_REGEX = /\{\s*"@context"\s*:\s*"https?:\/\/schema\.org"[\s\S]*?"@type"\s*:\s*"FAQPage"[\s\S]*?\}/i;

function cleanHtml(html) {
    if (!html) return "";
    let cleaned = html;

    // Remove scripts and styles
    cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, "");
    cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, "");

    // Normalize whitespace and entities
    cleaned = cleaned
        .replace(/&nbsp;/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return cleaned;
}

async function migrate() {
    console.log("Fetching all blogs...");
    const blogs = await client.query(api.blogs.listAll);
    console.log(`Found ${blogs.length} blogs.`);

    let migratedCount = 0;
    let skippedCount = 0;

    const contentDir = "nb scraped data/output/content";

    for (const blog of blogs) {
        console.log(`\n--- Processing: ${blog.title} ---`);

        let rawContent = blog.content || "";
        let faqItems = [];
        let isPuck = rawContent.trim().startsWith("{");
        
        // Try to find local source file for better quality
        const localFilePath = path.join(contentDir, `${blog.slug}.txt`);
        if (fs.existsSync(localFilePath)) {
            console.log(`  → Found local source file: ${localFilePath}. Using as source of truth.`);
            rawContent = fs.readFileSync(localFilePath, "utf-8");
            isPuck = false; // Treat as legacy for re-processing
        }

        let puckData = null;

        if (isPuck) {
            try {
                puckData = JSON.parse(rawContent);
                console.log("  → Found existing Puck JSON. Cleaning and checking for FAQs...");
                
                let foundAnyFaq = false;
                if (puckData.content && Array.isArray(puckData.content)) {
                    for (const component of puckData.content) {
                        if (component.type === "TextBlock" && component.props?.content) {
                            // 1. Extract FAQ if present
                            const faqMatch = component.props.content.match(FAQ_REGEX);
                            if (faqMatch) {
                                try {
                                    const faqJson = JSON.parse(faqMatch[0]);
                                    if (faqJson.mainEntity && Array.isArray(faqJson.mainEntity)) {
                                        const newItems = faqJson.mainEntity.map(q => ({
                                            question: q.name,
                                            answer: q.acceptedAnswer?.text || ""
                                        }));
                                        faqItems = [...faqItems, ...newItems];
                                        component.props.content = component.props.content.replace(FAQ_REGEX, "");
                                        foundAnyFaq = true;
                                        console.log(`  ✓ Extracted ${newItems.length} FAQ items.`);
                                    }
                                } catch (e) {
                                    console.warn(`  ⚠ Failed to parse FAQ JSON in TextBlock.`);
                                }
                            }
                            // 2. Clean up empty paragraphs and spaces
                            component.props.content = cleanHtml(component.props.content);
                        }
                    }

                    // Add FAQ block if items were found and no FAQ block exists
                    const hasFaqBlock = puckData.content.some(c => c.type === "FAQ");
                    if (faqItems.length > 0 && !hasFaqBlock) {
                        puckData.content.push({
                            type: "FAQ",
                            props: {
                                id: `faq-migrated-${Date.now()}`,
                                title: "Frequently Asked Questions",
                                intro: "Find answers to common questions about this topic.",
                                items: faqItems
                            }
                        });
                        console.log("  ✓ Added new FAQBlock.");
                    }
                }
            } catch (e) {
                console.error(`  ✗ Error parsing Puck JSON for ${blog.title}:`, e.message);
                isPuck = false; 
            }
        }

        if (!isPuck) {
            console.log(`  → Migrating legacy content...`);
            // 1. Extract FAQ JSON-LD
            const faqMatch = rawContent.match(FAQ_REGEX);
            if (faqMatch) {
                try {
                    const faqJson = JSON.parse(faqMatch[0]);
                    if (faqJson.mainEntity && Array.isArray(faqJson.mainEntity)) {
                        faqItems = faqJson.mainEntity.map(q => ({
                            question: q.name,
                            answer: q.acceptedAnswer?.text || ""
                        }));
                        console.log(`  ✓ Extracted ${faqItems.length} FAQ items.`);
                    }
                    rawContent = rawContent.replace(FAQ_REGEX, "");
                } catch (e) {
                    console.warn(`  ⚠ Failed to parse FAQ JSON.`);
                }
            }

            // 2. Clean content
            const cleanedContent = cleanHtml(rawContent);

            // 3. Build Puck Data
            puckData = {
                content: [
                    {
                        type: "TextBlock",
                        props: {
                            id: "body-content",
                            content: cleanedContent,
                            alignment: "left",
                            maxWidth: "none"
                        }
                    }
                ],
                root: { props: { title: blog.title } }
            };

            if (faqItems.length > 0) {
                puckData.content.push({
                    type: "FAQ",
                    props: {
                        id: "faq-section",
                        title: "Frequently Asked Questions",
                        intro: "Find answers to common questions about this topic.",
                        items: faqItems
                    }
                });
            }
        }

        // 4. Perform update
        try {
            await client.mutation(api.blogs.internalUpdateBlog, {
                id: blog._id,
                updates: { content: JSON.stringify(puckData) }
            });
            console.log(`  ✓ Successfully updated: ${blog.title}`);
            migratedCount++;
        } catch (err) {
            console.error(`  ✗ Failed to update ${blog.title}:`, err.message);
        }
    }

    console.log(`\nMigration complete.`);
    console.log(`Total: ${blogs.length}`);
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Skipped: ${skippedCount}`);
}

migrate().catch(console.error);
