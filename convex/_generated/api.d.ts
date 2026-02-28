/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as blogs from "../blogs.js";
import type * as categories from "../categories.js";
import type * as http from "../http.js";
import type * as importProducts from "../importProducts.js";
import type * as ingestion_mutations from "../ingestion_mutations.js";
import type * as initialize_pages from "../initialize_pages.js";
import type * as inquiries from "../inquiries.js";
import type * as media from "../media.js";
import type * as migrateProducts from "../migrateProducts.js";
import type * as migrations from "../migrations.js";
import type * as notifications from "../notifications.js";
import type * as pages from "../pages.js";
import type * as product_mutations from "../product_mutations.js";
import type * as products from "../products.js";
import type * as seed from "../seed.js";
import type * as siteData from "../siteData.js";
import type * as siteSettings from "../siteSettings.js";
import type * as templates from "../templates.js";
import type * as theme from "../theme.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  blogs: typeof blogs;
  categories: typeof categories;
  http: typeof http;
  importProducts: typeof importProducts;
  ingestion_mutations: typeof ingestion_mutations;
  initialize_pages: typeof initialize_pages;
  inquiries: typeof inquiries;
  media: typeof media;
  migrateProducts: typeof migrateProducts;
  migrations: typeof migrations;
  notifications: typeof notifications;
  pages: typeof pages;
  product_mutations: typeof product_mutations;
  products: typeof products;
  seed: typeof seed;
  siteData: typeof siteData;
  siteSettings: typeof siteSettings;
  templates: typeof templates;
  theme: typeof theme;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
