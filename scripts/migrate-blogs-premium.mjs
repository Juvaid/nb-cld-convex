import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = new ConvexHttpClient(CONVEX_URL);

// Regex to find JSON-LD FAQ schema
const FAQ_REGEX = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i;

function cleanHtml(html) {
    if (!html) return "";
    return html
        .replace(/&nbsp;/g, " ")
        .replace(/[^\S\n\r]+/g, " ") // Replace multiple spaces but keep newlines
        .replace(/<p><\/p>/g, "")
        .replace(/<p>&nbsp;<\/p>/g, "")
        .replace(/<p>\s+<\/p>/g, "")
        .replace(/\r/g, "") // Normalize lines
        .trim();
}

/**
 * Splits content into sections based on headings or large gaps.
 * Uses heuristics to identify headings in raw text.
 */
function splitContent(text) {
    const sections = [];
    const lines = text.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
    
    let currentSection = [];
    
    for (const line of lines) {
        // Liberal heading detection: 
        // 1. Short (under 120 chars)
        // 2. Not ending in a period or comma
        // 3. Not a list item starting with numbers (unless it's short)
        const isHeading = 
            line.length < 120 && 
            !line.endsWith(".") && 
            !line.endsWith(",") &&
            !line.endsWith(";") &&
            !line.match(/^\d+\./); // Skip numbered lists as headings for better body flow

        if (isHeading) {
            if (currentSection.length > 0) {
                sections.push({ type: "text", content: currentSection.join(" ") });
                currentSection = [];
            }
            sections.push({ type: "heading", content: `<h2>${line}</h2>` });
        } else {
            currentSection.push(line);
        }
    }
    
    if (currentSection.length > 0) {
        sections.push({ type: "text", content: currentSection.join(" ") });
    }
    
    console.log(`  → Split into ${sections.length} parts`);
    return sections;
}

async function run() {
    console.log("Fetching all blogs...");
    const blogs = await client.query(api.blogs.listAll);
    console.log(`Found ${blogs.length} blogs.`);

    const contentDir = "nb scraped data/output/content";

    for (const blog of blogs) {
        console.log(`\n--- Premium Processing: ${blog.title} ---`);

        let rawContent = "";
        const localFilePath = path.join(contentDir, `${blog.slug}.txt`);
        
        if (fs.existsSync(localFilePath)) {
            console.log(`  → Found local source: ${localFilePath}`);
            rawContent = fs.readFileSync(localFilePath, "utf-8");
        } else {
            console.log(`  ⚠ Local file not found for ${blog.slug}. Getting from Convex...`);
            rawContent = blog.content || "";
        }

        // 1. Extract FAQ (Check script tags AND raw JSON blobs)
        let faqItems = [];
        let faqMatch = rawContent.match(FAQ_REGEX);
        let faqJsonStr = "";

        if (faqMatch) {
            faqJsonStr = faqMatch[1];
            rawContent = rawContent.replace(FAQ_REGEX, "");
        } else {
            // Check for raw JSON FAQ blobs (common in some scrapes)
            // Note: Use a more specific end pattern to avoid stopping at nested braces
            const rawFaqMatch = rawContent.match(/\{"@context":"https:\\\/\\\/schema\.org","@type":"FAQPage",[\s\S]*?\]\s*\}/);
            if (rawFaqMatch) {
                faqJsonStr = rawFaqMatch[0];
                rawContent = rawContent.replace(rawFaqMatch[0], "");
            }
        }

        if (faqJsonStr) {
            try {
                // Pre-clean the JSON string for parse (unescape forward slashes if needed)
                const cleanFaqJsonStr = faqJsonStr.trim();
                const faqJson = JSON.parse(cleanFaqJsonStr);
                if (faqJson.mainEntity) {
                    faqItems = faqJson.mainEntity.map(q => ({
                        question: q.name,
                        answer: q.acceptedAnswer?.text || ""
                    }));
                    console.log(`  ✓ Extracted ${faqItems.length} FAQs`);
                }
            } catch (e) { 
                console.warn(`  ⚠ FAQ parse error: ${e.message}`); 
                // console.warn(`  Failed string: ${faqJsonStr.substring(0, 100)}...`); 
            }
        }

        // 2. Initial Cleanup & JSON-noise stripping
        let bodyHtml = rawContent
            .replace(/Title:.*\n/i, "")
            .replace(/URL:.*\n/i, "")
            // Remove common WordPress/SEO plugin JSON noise inlined as text
            .replace(/\{"@context":[\s\S]*?\}/gi, "")
            .replace(/\{"@type":[\s\S]*?\}/gi, "")
            .replace(/"@type":\s*".*?"/gi, "")
            .replace(/"@context":\s*".*?"/gi, "")
            // Remove any leftover JSON brackets
            .replace(/[{}]{2,}/g, "")
            .trim();

        // 3. Split by Heading
        const rawSections = splitContent(cleanHtml(bodyHtml));
        
        // 4. Final filter to remove sections that are purely leftover JSON junk
        const sections = rawSections.filter(s => {
            const text = s.content.trim();
            if (text.length < 3) return false;
            // If text contains too many quotes, braces or colons relative to length, it's probably junk
            const junkScore = (text.match(/[:"{}[\],]/g) || []).length / text.length;
            return junkScore < 0.2;
        });

        // 4. Build Puck Blocks
        const puckContent = [];
        
        // Add Intro Hero (if specific blog)
        if (blog.slug === "best-face-wash-manufacturers-in-india") {
            puckContent.push({
                type: "ModernHero",
                props: {
                    id: "hero-premium",
                    title: "Leading the Future of Face Wash Manufacturing",
                    description: "Partner with Nature's Boon for high-performance, dermatologically tested private label face wash formulations created in India.",
                    badgeText: "PREMIUM MANUFACTURING",
                    primaryButtonText: "GET FREE QUOTE",
                    primaryButtonLink: "/contact",
                    secondaryButtonText: "EXPLORE CATALOG",
                    secondaryButtonLink: "/products",
                    image: "/face_wash_manufacturing_hero.png",
                    backgroundVariant: "slate-900"
                }
            });
        }

        // Distribute content
        let sectionsAdded = 0;
        for (const section of sections) {
            puckContent.push({
                type: "TextBlock",
                props: {
                    id: `text-${sectionsAdded++}`,
                    content: section.content,
                    alignment: "left",
                    paddingTop: "40",
                    paddingBottom: "40"
                }
            });

            // Insert marketing blocks at strategic intervals
            if (sectionsAdded === 1) { // After intro
                 puckContent.push({
                    type: "CTA",
                    props: {
                        id: "mid-cta",
                        title: "Ready to launch your own brand?",
                        description: "Get end-to-end manufacturing support from formulation to packaging.",
                        buttonText: "Consult Our Experts",
                        buttonLink: "/contact",
                        backgroundVariant: "nb-green"
                    }
                });
            }

            if (sectionsAdded === 3) { // After 3 sections
                puckContent.push({
                    type: "ModernServices",
                    props: {
                        id: "services-break",
                        title: "Our Specialized Manufacturing Capabilities",
                        services: [
                            { title: "Organic Formulations", description: "100% natural and sulphate-free." },
                            { title: "Custom Packaging", description: "Modern, sustainable designs." },
                            { title: "Strict QA", description: "Dermatologist-approved quality." }
                        ]
                    }
                });
            }
        }

        // Add FAQ if found
        if (faqItems.length > 0) {
            puckContent.push({
                type: "FAQ",
                props: {
                    id: "faq-migrated",
                    title: "Frequently Asked Questions",
                    items: faqItems
                }
            });
        }

        // Add final trust block (only if some space)
        if (puckContent.length > 3) {
            puckContent.push({
                type: "SuccessStory",
                props: {
                    id: "footer-success",
                    title: "Trusted by 500+ Personal Care Brands",
                    stories: [
                        { brand: "Nature's Boon", metrics: "Founded 2006", product: "Face Wash", description: "The foundation of our expertise in botanical skincare." }
                    ]
                }
            });
        }

        const finalPuckData = {
            content: puckContent,
            root: { props: { title: blog.title } }
        };

        // Update Convex
        try {
            await client.mutation(api.blogs.internalUpdateBlog, {
                id: blog._id,
                updates: { content: JSON.stringify(finalPuckData) }
            });
            console.log(`  ✓ Premium layout applied: ${blog.title}`);
        } catch (e) {
            console.error(`  ✗ Update failed: ${e.message}`);
        }
    }

    console.log("\nPremium migration complete.");
}

run();
