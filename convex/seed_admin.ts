import { mutation } from "./_generated/server";
import { v } from "convex/values";

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const createDefaultAdmin = mutation({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const passwordHash = await hashPassword(args.password);

        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) return existing._id;

        return await ctx.db.insert("users", {
            email: args.email,
            passwordHash,
            role: "admin",
            name: "Admin User",
        });
    },
});
