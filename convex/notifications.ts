import { v } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

export const sendInquiryToDiscord = action({
    args: {
        inquiryId: v.id("inquiries"),
    },
    handler: async (ctx, args) => {
        // 1. Fetch the inquiry details
        const inquiry = await ctx.runQuery(internal.inquiries.getInternal, {
            id: args.inquiryId,
        });

        if (!inquiry) {
            console.error(`Inquiry not found: ${args.inquiryId}`);
            return;
        }

        // 2. Fetch the Discord Webhook URL from site settings
        const settings = await ctx.runQuery(internal.siteSettings.getInternal);
        const webhookUrl = settings.find((s: any) => s.key === "discord_webhook_url")?.value;

        if (!webhookUrl) {
            console.warn("Discord Webhook URL not configured in site settings.");
            return;
        }

        // 3. Format the Discord message
        const embed = {
            title: "📩 New Inquiry Received",
            color: 0x00ff00, // Green
            fields: [
                { name: "Name", value: inquiry.name, inline: true },
                { name: "Email", value: inquiry.email, inline: true },
                { name: "Phone", value: inquiry.phone || "N/A", inline: true },
                { name: "Message", value: inquiry.message },
            ],
            timestamp: new Date(inquiry.submittedAt).toISOString(),
            footer: {
                text: "Nature Boon - NB CONVEX",
            },
        };

        if (inquiry.productName) {
            embed.fields.push({
                name: "Product Info",
                value: `${inquiry.productName} (${inquiry.productCategory || "No Category"})`,
                inline: false,
            });
        }

        if (inquiry.companyType || inquiry.annualVolume) {
            embed.fields.push({
                name: "Lead Qualification",
                value: `Type: ${inquiry.companyType || "N/A"}\nVolume: ${inquiry.annualVolume || "N/A"}\nHigh Value: ${inquiry.isHighValue ? "✅ Yes" : "❌ No"}`,
                inline: false,
            });
        }

        // 4. Send the request to Discord
        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [embed],
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Discord Webhook failed: ${response.status} ${errorText}`);
            }
        } catch (error) {
            console.error("Error sending to Discord:", error);
        }
    },
});
