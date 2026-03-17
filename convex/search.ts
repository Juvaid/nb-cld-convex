import { v } from "convex/values";
import { query } from "./_generated/server";

export const globalSearch = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (!args.query || args.query.length < 2) return [];

        const searchLower = args.query.toLowerCase();

        const [products, blogs, categories] = await Promise.all([
            ctx.db.query("products").collect(),
            ctx.db.query("blogs").collect(),
            ctx.db.query("categories").collect(),
        ]);

        const productResults = products
            .filter(p => p.name.toLowerCase().includes(searchLower) || p.slug.toLowerCase().includes(searchLower))
            .map(p => ({
                id: p._id,
                title: p.name,
                type: "Product",
                href: `/products/${p.slug}`,
                image: p.images?.[0] || null
            }));

        const blogResults = blogs
            .filter(b => b.title.toLowerCase().includes(searchLower) || b.slug.toLowerCase().includes(searchLower))
            .map(b => ({
                id: b._id,
                title: b.title,
                type: "Blog",
                href: `/blogs/${b.slug}`,
                image: b.coverImage || null
            }));

        const categoryResults = categories
            .filter(c => c.name.toLowerCase().includes(searchLower) || c.slug.toLowerCase().includes(searchLower))
            .map(c => ({
                id: c._id,
                title: c.name,
                type: "Category",
                href: `/categories/${c.slug}`,
                image: c.image || null
            }));

        return [...productResults, ...blogResults, ...categoryResults].slice(0, 10);
    },
});
