import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { validateAdmin } from "./auth_utils";

// Theme queries and mutations

const defaultThemeSettings = {
  colors: {
    primary: "#16a34a",
    secondary: "#0f172a",
    accent: "#22c55e",
    background: "#ffffff",
    backgroundAlt: "#f8fafc",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
  },
  typography: {
    headingFont: "Montserrat",
    bodyFont: "Montserrat",
    logoFont: "'Open Sans'",
    headingWeight: "700",
    headingLetterSpacing: "0.02em",
    bodyWeight: "400",
    bodyLineHeight: "",
  },
  buttons: {
    borderRadius: "8",
    paddingX: "24",
    paddingY: "12",
    primaryBg: "#16a34a",
    primaryText: "#ffffff",
  },
  spacing: {
    containerMaxWidth: "1280",
    sectionPaddingY: "64",
  },
  effects: {
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transition: "0.2s",
  },
  layout: {
    borderRadius: "12px"
  }
};

export const getThemeSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("themeSettings").collect();

    if (settings.length === 0) {
      return defaultThemeSettings;
    }

    const merged: any = { ...defaultThemeSettings };

    for (const setting of settings) {
      const keys = setting.key.split(".");
      let current = merged;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = setting.value;
    }

    return merged;
  },
});

export const getThemeSetting = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("themeSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    return setting?.value ?? null;
  },
});

export const saveThemeSetting = mutation({
  args: {
    key: v.string(),
    value: v.any(),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateAdmin(ctx, args.token, "saveThemeSetting");
    const existing = await ctx.db
      .query("themeSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
      });
    } else {
      await ctx.db.insert("themeSettings", {
        key: args.key,
        value: args.value,
      });
    }
  },
});

export const saveAllThemeSettings = mutation({
  args: {
    settings: v.any(),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateAdmin(ctx, args.token, "saveAllThemeSettings");
    const flattenObject = (obj: any, prefix = "") => {
      const entries: { key: string; value: any }[] = [];
      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          entries.push(...flattenObject(value, newKey));
        } else {
          entries.push({ key: newKey, value });
        }
      }
      return entries;
    };

    const entries = flattenObject(args.settings);

    for (const { key, value } of entries) {
      const existing = await ctx.db
        .query("themeSettings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { value });
      } else {
        await ctx.db.insert("themeSettings", { key, value });
      }
    }
  },
});

export const resetThemeSettings = mutation({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await validateAdmin(ctx, args.token, "resetThemeSettings");
    const settings = await ctx.db.query("themeSettings").collect();

    for (const setting of settings) {
      await ctx.db.delete(setting._id);
    }
  },
});

export const getThemeCssVariables = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("themeSettings").collect();

    const merged: any = { ...defaultThemeSettings };

    for (const setting of settings) {
      const keys = setting.key.split(".");
      let current = merged;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = setting.value;
    }

    const flattenToCssVars = (obj: any, prefix = "--nb-"): string => {
      let css = "";
      for (const [key, value] of Object.entries(obj)) {
        const varName = `${prefix}${key}`;
        if (typeof value === "object" && value !== null) {
          css += flattenToCssVars(value, `${varName}-`);
        } else {
          css += `${varName}: ${value};\n`;
        }
      }
      return css;
    };

    return flattenToCssVars(merged);
  },
});

export const createThemeSnapshot = mutation({
  args: {
    name: v.string(),
    theme: v.any(),
    siteSettings: v.optional(v.any()), // Optional for backward compatibility/flexibility
    image: v.optional(v.string()), // Storage ID for thumbnail
    isPreset: v.optional(v.boolean()), // Flag for official gallery themes
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateAdmin(ctx, args.token, "createThemeSnapshot");
    await ctx.db.insert("themeSnapshots", {
      name: args.name,
      theme: args.theme,
      siteSettings: args.siteSettings,
      image: args.image,
      isPreset: args.isPreset,
      createdAt: Date.now(),
    });
  },
});

export const listThemeSnapshots = query({
  args: { onlyPresets: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.onlyPresets) {
      return await ctx.db
        .query("themeSnapshots")
        .withIndex("by_isPreset", (q) => q.eq("isPreset", true))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("themeSnapshots").order("desc").collect();
  },
});

export const deleteThemeSnapshot = mutation({
  args: { id: v.id("themeSnapshots"), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await validateAdmin(ctx, args.token, "deleteThemeSnapshot");
    await ctx.db.delete(args.id);
  },
});

export const restoreThemeSnapshot = mutation({
  args: {
    theme: v.any(),
    siteSettings: v.optional(v.any()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateAdmin(ctx, args.token, "restoreThemeSnapshot");
    // 1. Restore Theme Settings
    const themeEntries = flattenObject(args.theme);
    for (const { key, value } of themeEntries) {
      const existing = await ctx.db
        .query("themeSettings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { value });
      } else {
        await ctx.db.insert("themeSettings", { key, value });
      }
    }

    // 2. Restore Site Settings (if provided)
    if (args.siteSettings) {
      // We'll need to define a helper or repeat logic since siteSettings logic 
      // isn't exported as a reusable function in this file, but we can access the table directly.
      // Similar flattening might not be needed if siteSettings structure is flat-ish, 
      // but let's assume it's simple key-value pairs based on schema.
      // Actually, siteSettings table is also key-value.

      // Helper to flatten if needed, but siteSettings component usually sends flat keys like "navLinks", "logoText"
      // Let's assume args.siteSettings is the object derived from getSiteSettings

      for (const [key, value] of Object.entries(args.siteSettings)) {
        const existing = await ctx.db
          .query("siteSettings")
          .withIndex("by_key", (q) => q.eq("key", key))
          .unique();

        if (existing) {
          await ctx.db.patch(existing._id, { value });
        } else {
          await ctx.db.insert("siteSettings", { key, value });
        }
      }
    }
  },
});

// Helper for restore (local to file)
function flattenObject(obj: any, prefix = "") {
  const entries: { key: string; value: any }[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      entries.push(...flattenObject(value, newKey));
    } else {
      entries.push({ key: newKey, value });
    }
  }
  return entries;
}
