import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Mutation to submit a new inquiry
export const submit = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const inquiryId = await ctx.db.insert("inquiries", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            message: args.message,
            status: "new",
            submittedAt: Date.now(),
        });
        return inquiryId;
    },
});
