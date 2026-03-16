import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const client = new ConvexHttpClient(convexUrl);

export async function ingest(blogData) {

    try {
        console.log(`Ingesting: ${blogData.title}`);
        
        // Ensure slug exists
        const slug = blogData.slug || blogData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const payload = {
            title: blogData.title,
            content: blogData.content,
            excerpt: blogData.excerpt || blogData.summary,
            slug,
            category: "article",
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
