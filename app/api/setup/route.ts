import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// ONE-TIME SETUP ROUTE — Visit: http://localhost:3000/api/setup
// Re-visiting is safe (uses upsert logic).

export async function GET() {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return NextResponse.json({ error: "NEXT_PUBLIC_CONVEX_URL not set" }, { status: 500 });
    }

    const client = new ConvexHttpClient(convexUrl);

    try {
        const results: Record<string, unknown> = {};

        // 1. Seed stats & services
        results.seed = await client.mutation(api.seed.seedSiteData, {});

        // 2. Setup core pages
        results.pages = await client.mutation(api.initialize_pages.setupCorePages, {});

        // 3. Create admin user
        results.admin = await client.mutation(api.seed_admin.createDefaultAdmin, {
            email: "admin@naturesboon.com",
            password: "admin123",
        });

        // 4. Seed site settings
        const siteSettings: Record<string, unknown> = {
            siteName: "Nature's Boon",
            tagline: "Your Global Partner in Personal Care Excellence",
            logoText: "Nature's Boon",
            contactEmail: "info@naturesboon.com",
            contactPhone: "+91 97818 00033",
            address: "Plot No 123, JLPL Industrial Area, Sector 82, Mohali, Punjab - 140308",
            workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
            socialFacebook: "#",
            socialInstagram: "#",
            socialLinkedin: "#",
            copyrightText: "© 2026 Nature's Boon Manufacturing. All rights reserved.",
            headerContactText: "Contact Sales",
            navLinks: [
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Products", href: "/products" },
                { label: "Blogs", href: "/blogs" },
            ],
        };

        for (const [key, value] of Object.entries(siteSettings)) {
            await client.mutation(api.siteSettings.updateSiteSetting, { key, value });
        }
        results.siteSettings = `Seeded ${Object.keys(siteSettings).length} site settings`;

        // 5. Seed theme settings
        const themeSettings: Record<string, unknown> = {
            "colors.primary": "#16a34a",
            "colors.secondary": "#0f172a",
            "colors.accent": "#22c55e",
            "colors.background": "#ffffff",
            "colors.backgroundAlt": "#f8fafc",
            "colors.text": "#0f172a",
            "colors.textMuted": "#64748b",
            "typography.headingFont": "Inter",
            "typography.bodyFont": "Inter",
            "typography.logoFont": "Inter",
            "buttons.primaryBg": "#16a34a",
            "buttons.primaryText": "#ffffff",
            "buttons.borderRadius": "8",
        };

        for (const [key, value] of Object.entries(themeSettings)) {
            await client.mutation(api.theme.saveThemeSetting, { key, value });
        }
        results.theme = `Seeded ${Object.keys(themeSettings).length} theme settings`;

        return NextResponse.json({
            success: true,
            message: "✅ Full setup complete!",
            loginUrl: "http://localhost:3000/login",
            credentials: { email: "admin@naturesboon.com", password: "admin123" },
            details: results,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
