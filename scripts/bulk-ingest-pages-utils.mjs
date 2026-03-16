import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.argv[2] || process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
    console.error("Error: NEXT_PUBLIC_CONVEX_URL is not defined in .env.local and no URL was provided as an argument.");
    process.exit(1);
}
const client = new ConvexHttpClient(convexUrl);

export async function ingestPage(pageData) {
    try {
        console.log(`Ingesting Page: ${pageData.title} to path ${pageData.path} targeting ${convexUrl}`);
        
        let finalContent = pageData.content;
        
        // Wrap raw HTML into Puck JSON if it hasn't been already
        try {
            JSON.parse(pageData.content);
        } catch (e) {
            const puckData = {
                content: [
                    {
                        type: "TextBlock",
                        props: {
                            id: `text-content-${Date.now()}`,
                            content: pageData.content,
                            alignment: "left",
                            maxWidth: "2xl"
                        }
                    }
                ],
                root: { props: { title: `${pageData.title} - Nature's Boon` } }
            };
            finalContent = JSON.stringify(puckData);
        }

        const payload = {
            path: pageData.path,
            title: pageData.title,
            description: pageData.summary,
            draftData: finalContent,
            data: finalContent // Compatibility with old http.ts
        };

        const siteUrl = convexUrl.replace(".cloud", ".site");
        const response = await fetch(`${siteUrl}/ingestPage`, {
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

        console.log(`Successfully ingested page: ${pageData.path}`);

    } catch (error) {
        console.error(`Error ingesting page ${pageData.title}:`, error.message);
    }
}
