import { mutation } from "./_generated/server";

export const seedSiteData = mutation({
    args: {},
    handler: async (ctx) => {
        // Seed Stats
        const existingStats = await ctx.db.query("stats").collect();
        if (existingStats.length === 0) {
            await ctx.db.insert("stats", { label: "Tons Capacity", value: "750+", order: 1 });
            await ctx.db.insert("stats", { label: "SKUs", value: "200+", order: 2 });
            await ctx.db.insert("stats", { label: "Global Clients", value: "20+", order: 3 });
            await ctx.db.insert("stats", { label: "Years Experience", value: "15+", order: 4 });
        }

        // Seed Services
        const existingServices = await ctx.db.query("services").collect();
        if (existingServices.length === 0) {
            await ctx.db.insert("services", {
                title: 'Label & Packaging Designing',
                description: 'Expert label and packaging design strategically crafted for your brand identity and market impact.',
                slug: 'label-packaging-designing',
                icon: 'Palette',
                order: 1
            });
            await ctx.db.insert("services", {
                title: 'Customised Finished Product',
                description: 'End-to-end transformation from raw formulation to market-ready premium personal care products.',
                slug: 'customised-finished-product',
                icon: 'FlaskConical',
                order: 2
            });
            await ctx.db.insert("services", {
                title: 'Trademark & Logo',
                description: 'Professional branding services including trademark registration and iconic logo development.',
                slug: 'trademark-logo',
                icon: 'BadgeCheck',
                order: 3
            });
            await ctx.db.insert("services", {
                title: 'Digital Marketing',
                description: 'Strategic online presence and performance marketing to reach your target global audience.',
                slug: 'digital-marketing',
                icon: 'Megaphone',
                order: 4
            });
        }

        return "Successfully seeded site stats and services.";
    },
});
