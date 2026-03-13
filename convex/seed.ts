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

        // Seed Site Settings
        const existingSettings = await ctx.db.query("siteSettings").collect();
        if (existingSettings.length === 0) {
            await ctx.db.insert("siteSettings", { key: "logoText", value: "Nature's Boon" });
            await ctx.db.insert("siteSettings", { key: "contactEmail", value: "naturesboon@yahoo.com" });
            await ctx.db.insert("siteSettings", { key: "contactPhone", value: "+91-9877659808" });
        } else {
            // Update title specifically for audit fix
            const titleEntry = existingSettings.find(s => s.key === "siteTitle");
            if (titleEntry) {
                await ctx.db.patch(titleEntry._id, { value: "Nature's Boon | Premium Personal Care Manufacturer" });
            } else {
                await ctx.db.insert("siteSettings", { key: "siteTitle", value: "Nature's Boon | Premium Personal Care Manufacturer" });
            }
        }

        // Audit Fix: Replace cucumber image on homepage
        const homePage = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", "/"))
            .unique();

        if (homePage && homePage.publishedData) {
            let data = JSON.parse(homePage.publishedData);
            let changed = false;

            if (data.content) {
                data.content = data.content.map((block: any) => {
                    if (block.props && block.props.categories) {
                        block.props.categories = block.props.categories.map((cat: any) => {
                            if (cat.image && (cat.image.includes("unbrandercucumber.png") || cat.image.includes("cucumber"))) {
                                cat.image = "https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773305814460-herobannerv2.png";
                                changed = true;
                            }
                            return cat;
                        });
                    }
                    for (let key in block.props) {
                        if (typeof block.props[key] === "string" && (block.props[key].includes("unbrandercucumber.png") || block.props[key].includes("unbranded"))) {
                            block.props[key] = "https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773305814460-herobannerv2.png";
                            changed = true;
                        }
                    }
                    return block;
                });
            }

            if (changed) {
                await ctx.db.patch(homePage._id, {
                    publishedData: JSON.stringify(data),
                    draftData: JSON.stringify(data),
                });
            }
        }

        return "Successfully seeded site data and applied audit fixes (Title & Images).";
    },
});
