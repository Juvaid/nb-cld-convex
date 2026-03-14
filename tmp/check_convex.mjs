
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";
import fs from "fs";

// Manually load .env.local if dotenv fails
if (fs.existsSync(".env.local")) {
    const env = fs.readFileSync(".env.local", "utf8");
    env.split("\n").forEach(line => {
        const [key, value] = line.split("=");
        if (key && value) process.env[key.trim()] = value.trim();
    });
}

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL not found");
    process.exit(1);
}

const client = new ConvexHttpClient(url);

async function main() {
    console.log("Checking Convex Pages...");
    const settings = await client.query(api.siteSettings.getSiteSettings);
    console.log("Site Settings:", JSON.stringify(settings, null, 2));
    const pages = await client.query(api.pages.listLite);
    console.log("Pages found:", pages.length);
    pages.forEach(p => {
        console.log(`- Path: ${p.path}, Status: ${p.status}`);
    });

    const home = pages.find(p => p.path === "/");
    if (home) {
        console.log("Home page found. Checking published data...");
        const fullHome = await client.query(api.pages.getPublishedPage, { path: "/" });
        if (fullHome) {
            console.log("Published data found. Length:", fullHome.data?.length || 0);
            try {
                const parsed = JSON.parse(fullHome.data);
                console.log("Content blocks:", parsed.content?.length || 0);
                if (parsed.content) {
                    parsed.content.forEach((b, i) => console.log(`  [${i}] Type: ${b.type}`));
                    if (parsed.content[0]) {
                        console.log("\nFirst Block Props:", JSON.stringify(parsed.content[0].props, null, 2));
                    }
                }
            } catch (e) {
                console.log("Data is not valid JSON string.");
            }
        } else {
            console.log("NO PUBLISHED DATA FOUND for home page.");
        }
    } else {
        console.log("NO HOME PAGE FOUND with path '/'.");
    }
}

main().catch(console.error);
