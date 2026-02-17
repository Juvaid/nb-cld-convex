import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const computedHash = await hashPassword(password);
    return computedHash === hash;
}

// Register user (admin only - call from server seed script)
export const createUser = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        role: v.union(v.literal("admin"), v.literal("client")),
        name: v.string(),
        siteId: v.optional(v.string()), // For client users
    },
    handler: async (ctx, args) => {
        const passwordHash = await hashPassword(args.password);

        // Check if user already exists
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) throw new Error("User already exists");

        return await ctx.db.insert("users", {
            email: args.email,
            passwordHash,
            role: args.role,
            name: args.name,
            siteId: args.siteId,
        });
    },
});

// Login
export const login = mutation({
    args: { email: v.string(), password: v.string() },
    handler: async (ctx, { email, password }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first();

        if (!user) throw new Error("Invalid credentials");

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) throw new Error("Invalid credentials");

        // Create session token
        const token = crypto.randomUUID();
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

        await ctx.db.insert("sessions", {
            userId: user._id,
            token,
            expiresAt,
        });

        return { token, user: { id: user._id, email: user.email, role: user.role, name: user.name } };
    },
});

// Verify session
export const getCurrentUser = query({
    args: { token: v.optional(v.string()) }, // Make token optional to handle null from client
    handler: async (ctx, { token }) => {
        if (!token) return null;

        const session = await ctx.db
            .query("sessions")
            .withIndex("by_token", (q) => q.eq("token", token))
            .first();

        if (!session || session.expiresAt < Date.now()) {
            return null;
        }

        const user = await ctx.db.get(session.userId);
        if (!user) return null;

        return { id: user._id, email: user.email, role: user.role, name: user.name };
    },
});

// Logout
export const logout = mutation({
    args: { token: v.string() },
    handler: async (ctx, { token }) => {
        const session = await ctx.db
            .query("sessions")
            .withIndex("by_token", (q) => q.eq("token", token))
            .first();

        if (session) {
            await ctx.db.delete(session._id);
        }
    },
});

