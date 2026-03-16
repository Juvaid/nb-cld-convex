import { internalMutation } from "./_generated/server";

// Seed all Nature's Boon product categories and products into the DB.
// Safe to run multiple times - skips existing records by slug.
export const seedProductCatalog = internalMutation({
    args: {},
    handler: async (ctx) => {
        const catalog = [
            {
                name: "Skin Care",
                slug: "skin-care",
                description: "Comprehensive solutions for radiant and healthy skin.",
                products: [
                    { name: "Face Wash", usp: "Sulphate Free" },
                    { name: "Facial Kit", usp: "Premium Ingredients" },
                    { name: "Face Serum", usp: "Vitamin C Enriched" },
                    { name: "Face Cream", usp: "Deep Moisturizing" },
                    { name: "D-Tan", usp: "Natural Extracts" },
                    { name: "Face Scrub", usp: "Gentle Exfoliation" },
                    { name: "Face Mist / Skin Toner", usp: "pH Balanced" },
                    { name: "Cleansing Milk", usp: "Hydrating Formula" },
                    { name: "Moisturizer", usp: "All Skin Types" },
                    { name: "SPF Sunscreen", usp: "Broad Spectrum" },
                    { name: "Face Pack & Mask", usp: "Herbal Blend" },
                    { name: "Massage Cream", usp: "Professional Grade" },
                ],
            },
            {
                name: "Hair Care",
                slug: "hair-care",
                description: "Nourishing formulas for strong and shiny hair.",
                products: [
                    { name: "Hair Shampoo", usp: "Paraben Free" },
                    { name: "Hair Oil", usp: "Ayurvedic Blend" },
                    { name: "Hair Serum", usp: "Frizz Control" },
                    { name: "Hair Conditioner", usp: "Deep Repair" },
                    { name: "Hair Mask", usp: "Intensive Nourishment" },
                ],
            },
            {
                name: "Body & Personal Care",
                slug: "body-personal-care",
                description: "Complete care for your body from head to toe.",
                products: [
                    { name: "Body Lotion", usp: "Deep Nourishing" },
                    { name: "Hand & Foot Care", usp: "Intensive Repair" },
                    { name: "Lip Care", usp: "Natural SPF" },
                    { name: "Body Wash", usp: "Gentle Cleansing" },
                    { name: "Roll-on Deodorant", usp: "48hr Protection" },
                    { name: "Hair Removal Wax", usp: "Skin Friendly" },
                    { name: "Body Scrub", usp: "Exfoliating" },
                    { name: "Body Cream", usp: "Moisturizing" },
                ],
            },
            {
                name: "Men's Grooming",
                slug: "mens-grooming",
                description: "Specialized grooming products designed for men.",
                products: [
                    { name: "Beard Oil", usp: "Natural Growth" },
                    { name: "Hair Wax", usp: "Strong Hold" },
                    { name: "After Shave Lotion", usp: "Soothing Formula" },
                    { name: "Shaving Foam", usp: "Smooth Glide" },
                ],
            },
        ];

        function toSlug(name: string) {
            return name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }

        let categoriesCreated = 0;
        let productsCreated = 0;

        for (const catData of catalog) {
            // Upsert category
            const existing = await ctx.db
                .query("categories")
                .withIndex("by_slug", (q) => q.eq("slug", catData.slug))
                .first();

            const categoryId = existing
                ? existing._id
                : await ctx.db.insert("categories", {
                    name: catData.name,
                    slug: catData.slug,
                    description: catData.description,
                });

            if (!existing) categoriesCreated++;

            // Upsert each product
            for (const p of catData.products) {
                const slug = toSlug(p.name);
                const existingProduct = await ctx.db
                    .query("products")
                    .withIndex("by_slug", (q) => q.eq("slug", slug))
                    .first();

                if (!existingProduct) {
                    await ctx.db.insert("products", {
                        name: p.name,
                        slug,
                        usp: p.usp,
                        description: p.name,
                        images: [],
                        tags: [],
                        status: "active",
                        categoryId,
                        moq: 100, // Default MOQ for B2B verification
                        pricingTiers: [
                            { minQty: 100, price: 250 },
                            { minQty: 500, price: 210 },
                            { minQty: 1000, price: 180 }
                        ]
                    });
                    productsCreated++;
                }
            }
        }

        return { categoriesCreated, productsCreated };
    },
});
