import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

async function checkSettings() {
    try {
        const settings = await client.query("siteSettings:getSiteSettings" as any);
        console.log("Site Settings:", settings);

        if (settings.discord_webhook_url) {
            console.log("Found Webhook:", settings.discord_webhook_url);

            // Try fetching manually
            const embed = {
                title: "Test Inquiry",
                description: "This is a test from the backend script.",
                color: 0x00ff00,
            };

            console.log("Attempting to POST to webhook...");
            const response = await fetch(settings.discord_webhook_url.trim(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ embeds: [embed] })
            });

            console.log("Discord Webhook Status:", response.status, response.statusText);
            if (!response.ok) {
                console.log("Discord error:", await response.text());
            }
        } else {
            console.log("No discord_webhook_url found in settings.");
        }
    } catch (e) {
        console.error(e);
    }
}

checkSettings();
