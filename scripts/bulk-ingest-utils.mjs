import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.argv[2] || process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const client = new ConvexHttpClient(convexUrl);

export async function ingest(blogData) {

    try {
        console.log(`Ingesting: ${blogData.title} targeting ${convexUrl}`);
        
        // Ensure slug exists
        const slug = blogData.slug || blogData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_]+/g, "-")
            .replace(/^-+|-+$/g, "");

        let finalContent = blogData.content;
        
        // If content is not valid JSON, it's raw HTML that needs wrapping for Puck
        try {
            JSON.parse(blogData.content);
        } catch (e) {
            console.log("  Wrapping raw HTML into Puck JSON structure...");
            const puckData = {
                content: [
                    {
                        type: "TextBlock",
                        props: {
                            id: `text-content-${Date.now()}`,
                            content: blogData.content,
                            alignment: "left",
                            maxWidth: "2xl"
                        }
                    }
                ],
                root: { props: { title: `${blogData.title} - Nature's Boon` } }
            };
            finalContent = JSON.stringify(puckData);
        }

        const payload = {
            title: blogData.title,
            content: finalContent,
            excerpt: blogData.excerpt || blogData.summary || blogData.content.replace(/<[^>]*>/g, "").slice(0, 160) + "...",
            slug,
            category: blogData.category || "article",
        };

        const siteUrl = convexUrl.replace(".cloud", ".site");
        const response = await fetch(`${siteUrl}/ingestBlog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Ingestion failed: ${error}`);
        }

        const result = await response.json();
        console.log(`Successfully ingested: ${payload.slug}`);

    } catch (error) {
        console.error(`Error ingesting ${blogData.title}:`, error.message);
    }
}

export async function processBatch(batch) {
    for (const blog of batch) {
        await ingest(blog);
    }
}
