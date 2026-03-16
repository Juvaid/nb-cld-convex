import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONTENT_DIR = "nb scraped data/output/content";
const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY in .env.local");
    process.exit(1);
}

if (!CONVEX_SITE_URL) {
    console.error("Missing NEXT_PUBLIC_CONVEX_SITE_URL in .env.local");
    process.exit(1);
}

async function processWithAI(rawText) {
    const systemPrompt = `
Act as an expert SEO Content Editor and B2B Copywriter for a premium cosmetics manufacturing brand called Nature's Boon. 
Your job is to clean, restructure, and format raw scraped blog text into a beautifully designed, highly readable article.

Follow these STRICT formatting rules:
1. Typography Hierarchy: Break the content into logical sections. Use clear, engaging H2 headings for main topics and H3 for subtopics. No H1.
2. High-End Readability: paragraphs < 3 sentences. Use bulleted/numbered lists. Bold key ingredients and benefits.
3. Editorial Flourishes: Include at least one "Pro Tip" or "Key Takeaway" formatted as a blockquote (>).
4. Image Placeholders: Suggest 2-3 strategic placements for images with exact string: [INSERT_IMAGE_HERE]
5. Native FAQ Accordions: At the end, create a "Frequently Asked Questions" section using raw HTML: <details><summary>Question</summary><div><p>Answer</p></div></details>.

Output EVERYTHING as a JSON object with exactly two keys:
- title: A compelling, SEO-friendly headline.
- bodyHtml: The full transformed content including the headings, paragraphs, blockquotes, image placeholders, and the FAQ section at the bottom. Use standard HTML tags (h2, h3, p, ul, li, blockquote, details, summary).
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Raw Scraped Content:\n\n${rawText}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenAI API Error: ${err}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

async function ingestBlog(title, slug, html) {
    // Construct Puck JSON structure for the new TextBlock
    const puckData = {
        content: [
            {
                type: "TextBlock",
                props: {
                    id: `text-content-${Date.now()}`,
                    content: html,
                    alignment: "left",
                    maxWidth: "2xl" // Optimized for readability
                }
            }
        ],
        root: { props: { title: `${title} - Nature's Boon` } }
    };

    const payload = {
        title,
        slug,
        content: JSON.stringify(puckData),
        excerpt: html.replace(/<[^>]*>/g, "").slice(0, 160) + "...",
        author: "Nature's Boon Editorial",
        status: "published",
        category: "article"
    };

    const response = await fetch(`${CONVEX_SITE_URL}/ingestBlog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Convex Ingestion Error: ${err}`);
    }

    return await response.json();
}

async function run() {
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".txt") && f !== "index.txt" && f !== "about-us.txt" && f !== "contact.txt");

    // For first run/test, let's just do one file or accept a --file arg
    const args = process.argv.slice(2);
    const targetFile = args.find(a => !a.startsWith("-"));
    
    const filesToProcess = targetFile ? [targetFile] : files;

    console.log(`Processing ${filesToProcess.length} blogs...`);

    for (const file of filesToProcess) {
        const slug = file.replace(".txt", "");
        const filePath = path.join(CONTENT_DIR, file);
        
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            continue;
        }

        const rawText = fs.readFileSync(filePath, "utf8");

        console.log(`\nTransforming: ${file}...`);
        
        try {
            const { title, bodyHtml } = await processWithAI(rawText);
            console.log(`  ✓ AI Transformation Complete: ${title}`);

            const result = await ingestBlog(title, slug, bodyHtml);
            if (result.success) {
                console.log(`  ✓ Successfully Ingested to Convex`);
            } else {
                console.error(`  ✗ Ingestion Failed:`, result);
            }
        } catch (error) {
            console.error(`  ✗ Error processing ${file}:`, error.message);
        }
    }
}

run().catch(error => {
    console.error("Fatal Error:", error);
    process.exit(1);
});
