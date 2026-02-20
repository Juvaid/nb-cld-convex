import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("admin"), v.literal("client")),
    siteId: v.optional(v.string()), // For client users
    name: v.string(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
  pages: defineTable({
    path: v.string(), // URL path, e.g. "/" or "/about"
    data: v.string(), // JSON string for Puck data
    title: v.string(), // Page title for SEO
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    publishedAt: v.optional(v.number()),
    lastModified: v.optional(v.number()),
  }).index("by_path", ["path"])
    .index("by_status", ["status"]),

  pageSnapshots: defineTable({
    pageId: v.id("pages"),
    pagePath: v.string(), // redundant but useful for display
    data: v.string(), // JSON string for Puck data
    title: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    name: v.optional(v.string()), // Optional user-given name
  }).index("by_pageId", ["pageId"])
    .index("by_pagePath", ["pagePath"]),

  categories: defineTable({
    name: v.string(), // e.g., "Skin Care"
    slug: v.string(), // e.g., "skin-care"
    description: v.optional(v.string()),
    image: v.optional(v.string()), // Cover image
  }).index("by_slug", ["slug"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    description: v.string(),
    images: v.array(v.string()), // List of storage IDs
    categoryId: v.optional(v.id("categories")), // Link to categories
    status: v.union(v.literal("active"), v.literal("draft"), v.literal("archived")),
    sku: v.optional(v.string()),
    usp: v.optional(v.string()),
    tags: v.array(v.string()),
    meta: v.optional(v.any()), // For flexible structured data

    // B2B Wholesale Fields
    moq: v.optional(v.number()),
    pricingTiers: v.optional(v.array(v.object({
      minQty: v.number(),
      price: v.number()
    }))),

    // Technical Specifications
    botanicalName: v.optional(v.string()),
    extractionMethod: v.optional(v.string()),
    activeCompounds: v.optional(v.string()),

    // Secure Document Storage (CoAs, SDS, etc)
    documents: v.optional(v.array(v.object({
      name: v.string(),
      storageId: v.string()
    }))),
  }).index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_categoryId", ["categoryId"]),

  stats: defineTable({
    label: v.string(),
    value: v.string(),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
  }),

  services: defineTable({
    title: v.string(),
    description: v.string(),
    slug: v.string(),
    icon: v.optional(v.string()), // Can be lucide icon name or storage ID
    order: v.optional(v.number()),
  }).index("by_slug", ["slug"]),

  media: defineTable({
    filename: v.string(), // Original local filename
    storageId: v.string(), // Convex Storage ID
    url: v.string(),
    type: v.string(), // image, video, etc.
  }).index("by_filename", ["filename"]),

  siteSettings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),

  themeSettings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),

  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(), // JSON string for Puck data
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()), // Storage ID or URL
    author: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
  }).index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  themeSnapshots: defineTable({
    name: v.string(),
    theme: v.any(),
    siteSettings: v.optional(v.any()),
    image: v.optional(v.string()), // Storage ID for thumbnail
    isPreset: v.optional(v.boolean()), // Flag for official gallery themes
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"])
    .index("by_isPreset", ["isPreset"]),

  inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    productId: v.optional(v.string()),
    productName: v.optional(v.string()),
    productCategory: v.optional(v.string()),

    // B2B Lead Qualification
    companyType: v.optional(v.string()),
    annualVolume: v.optional(v.string()),
    isHighValue: v.optional(v.boolean()),

    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
    submittedAt: v.number(),
  }).index("by_status", ["status"]),
  componentTemplates: defineTable({
    name: v.string(),
    componentType: v.string(),
    props: v.any(),
    category: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_componentType", ["componentType"]),
});
