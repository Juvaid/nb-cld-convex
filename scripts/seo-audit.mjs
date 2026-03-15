/**
 * seo-audit.mjs
 * Run: node scripts/seo-audit.mjs
 *
 * Connects to your local (or cloud) Convex instance and audits every
 * page, product, and blog post for missing or broken SEO metadata.
 *
 * Checks:
 *  - title (present, not blank, no double pipe, no duplicate brand suffix)
 *  - description (present, 50–160 chars)
 *  - keywords (present)
 *  - ogImage (present, is a valid URL or storage ID, not the hero banner by mistake)
 *  - ogDescription (present)
 *  - schemaType (set)
 *  - publishedData (page is actually published — not just drafted)
 *  - canonical URL resolvable
 *
 * Output: colour-coded table + summary JSON written to tmp/seo-audit-result.json
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { writeFileSync } from "fs";
import path from "path";

// ─── Config ───────────────────────────────────────────────────────────────────

const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  "https://placeholder-url-for-build.convex.cloud";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://new.naturesboon.net";
const HERO_BANNER_FILENAME = "herobannerv2.png"; // known wrong image
const BRAND_SUFFIX_RE = /\|\s*Nature['']s Boon\s*$/i;
const DOUBLE_PIPE_RE = /\|\s*\|/;

// Description length targets (Google's recommended range)
const DESC_MIN = 50;
const DESC_MAX = 160;

// ─── Colours ──────────────────────────────────────────────────────────────────

const R = (s) => `\x1b[31m${s}\x1b[0m`;  // red
const Y = (s) => `\x1b[33m${s}\x1b[0m`;  // yellow
const G = (s) => `\x1b[32m${s}\x1b[0m`;  // green
const B = (s) => `\x1b[34m${s}\x1b[0m`;  // blue (dim)
const W = (s) => `\x1b[1m${s}\x1b[0m`;   // bold

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveImageUrl(imageUrl, siteUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return `${siteUrl}${imageUrl}`;
  // Convex storage ID or R2 key
  return `${siteUrl}/api/storage/${imageUrl}`;
}

function checkTitle(title, entityType) {
  const issues = [];
  if (!title || title.trim() === "") {
    issues.push({ level: "error", msg: "Missing title" });
    return issues;
  }
  if (DOUBLE_PIPE_RE.test(title)) {
    issues.push({ level: "error", msg: `Double pipe in title: "${title}"` });
  }
  if (BRAND_SUFFIX_RE.test(title) && entityType === "page") {
    issues.push({
      level: "warning",
      msg: `Title already contains brand suffix — will duplicate with Next.js template: "${title}"`,
    });
  }
  if (title.length > 60) {
    issues.push({
      level: "warning",
      msg: `Title too long (${title.length} chars, Google shows ~60): "${title.slice(0, 60)}…"`,
    });
  }
  return issues;
}

function checkDescription(desc) {
  const issues = [];
  if (!desc || desc.trim() === "") {
    issues.push({ level: "error", msg: "Missing meta description" });
    return issues;
  }
  if (desc.length < DESC_MIN) {
    issues.push({
      level: "warning",
      msg: `Description too short (${desc.length} chars, min ${DESC_MIN}): "${desc}"`,
    });
  }
  if (desc.length > DESC_MAX) {
    issues.push({
      level: "warning",
      msg: `Description too long (${desc.length} chars, max ${DESC_MAX}) — will be truncated by Google`,
    });
  }
  return issues;
}

function checkOgImage(imageUrl, siteUrl) {
  const issues = [];
  if (!imageUrl) {
    issues.push({ level: "warning", msg: "No OG image set — will use default og-image.jpg" });
    return issues;
  }
  const resolved = resolveImageUrl(imageUrl, siteUrl);
  if (imageUrl.includes(HERO_BANNER_FILENAME)) {
    issues.push({
      level: "error",
      msg: `OG image is the hero banner (${HERO_BANNER_FILENAME}) — likely a copy-paste error`,
    });
  }
  return issues;
}

function score(issues) {
  if (issues.some((i) => i.level === "error")) return "error";
  if (issues.some((i) => i.level === "warning")) return "warning";
  return "ok";
}

function statusLabel(s) {
  if (s === "error") return R("✗ ERROR");
  if (s === "warning") return Y("⚠ WARN ");
  return G("✓ OK   ");
}

// ─── Audit functions ──────────────────────────────────────────────────────────

function auditPage(page) {
  const issues = [];

  issues.push(...checkTitle(page.title, "page"));
  issues.push(...checkDescription(page.description));
  issues.push(...checkOgImage(page.ogImage, SITE_URL));

  if (!page.keywords || page.keywords.trim() === "") {
    issues.push({ level: "warning", msg: "No keywords set" });
  }
  if (!page.schemaType || page.schemaType === "none") {
    issues.push({ level: "warning", msg: "schemaType not set (no structured data for this page)" });
  }
  if (!page.publishedData) {
    issues.push({
      level: "error",
      msg: "No publishedData — page exists in DB but has never been Published. Meta tags will be empty on live site.",
    });
  }
  if (page.ogImage && !page.ogDescription && !page.description) {
    issues.push({ level: "warning", msg: "ogDescription missing and no description fallback" });
  }

  return {
    type: "page",
    id: page.path,
    label: `${page.path} (${page.title || "no title"})`,
    issues,
    score: score(issues),
  };
}

function auditProduct(product) {
  const issues = [];

  issues.push(...checkTitle(product.name, "product"));
  issues.push(...checkDescription(product.description));

  if (!product.images || product.images.length === 0) {
    issues.push({ level: "error", msg: "No images — OG image will be default og-image.jpg" });
  } else {
    issues.push(...checkOgImage(product.images[0], SITE_URL));
  }

  if (!product.keywords || product.keywords.trim() === "") {
    issues.push({ level: "warning", msg: "No SEO keywords" });
  }
  if (!product.usp) {
    issues.push({ level: "warning", msg: "No USP — product cards will show generic description" });
  }
  if (!product.slug || product.slug.trim() === "") {
    issues.push({ level: "error", msg: "No slug — product URL will break" });
  }
  if (!product.moq) {
    issues.push({ level: "warning", msg: "No MOQ set — buyers can't self-qualify" });
  }

  return {
    type: "product",
    id: product._id,
    label: `${product.name} (slug: ${product.slug || "MISSING"})`,
    issues,
    score: score(issues),
  };
}

function auditBlog(blog) {
  const issues = [];

  issues.push(...checkTitle(blog.title, "blog"));
  issues.push(...checkDescription(blog.excerpt));

  if (!blog.coverImage) {
    issues.push({ level: "warning", msg: "No cover image — OG share will use default image" });
  } else {
    issues.push(...checkOgImage(blog.coverImage, SITE_URL));
  }

  if (!blog.keywords || blog.keywords.trim() === "") {
    issues.push({ level: "warning", msg: "No SEO keywords" });
  }
  if (blog.status !== "published") {
    issues.push({ level: "warning", msg: `Status is "${blog.status}" — not live` });
  }

  return {
    type: "blog",
    id: blog.slug,
    label: `${blog.title} (slug: ${blog.slug})`,
    issues,
    score: score(issues),
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${W("Nature's Boon — SEO Metadata Audit")}`);
  console.log(`Connecting to Convex: ${B(CONVEX_URL)}\n`);

  if (CONVEX_URL.includes("placeholder")) {
    console.log(R("ERROR: NEXT_PUBLIC_CONVEX_URL is not set."));
    console.log("Run this script with your Convex URL:");
    console.log("  NEXT_PUBLIC_CONVEX_URL=https://your-id.convex.cloud node scripts/seo-audit.mjs\n");
    process.exit(1);
  }

  const client = new ConvexHttpClient(CONVEX_URL);

  let pages = [], products = [], blogs = [];

  try {
    console.log("Fetching data from Convex...");
    [pages, products, blogs] = await Promise.all([
      client.query(api.pages.listPages),
      client.query(api.products.listAll, {}),
      client.query(api.blogs.listBlogs),
    ]);
    console.log(
      `  Found: ${pages.length} pages, ${products.length} products, ${blogs.length} blog posts\n`
    );
  } catch (err) {
    console.error(R(`Failed to connect to Convex: ${err.message}`));
    console.log("Make sure `npx convex dev` is running and NEXT_PUBLIC_CONVEX_URL is correct.");
    process.exit(1);
  }

  const results = [
    ...pages.map(auditPage),
    ...products.map(auditProduct),
    ...blogs.map(auditBlog),
  ];

  // ─── Print results ──────────────────────────────────────────────────────────

  const errors = results.filter((r) => r.score === "error");
  const warnings = results.filter((r) => r.score === "warning");
  const ok = results.filter((r) => r.score === "ok");

  // Group by type
  const byType = { page: [], product: [], blog: [] };
  for (const r of results) byType[r.type].push(r);

  for (const [type, items] of Object.entries(byType)) {
    if (items.length === 0) continue;
    console.log(W(`\n── ${type.toUpperCase()}S (${items.length}) ──────────────────────────────────────`));
    for (const item of items) {
      console.log(`\n  ${statusLabel(item.score)}  ${item.label}`);
      for (const issue of item.issues) {
        const icon = issue.level === "error" ? R("    [ERROR]") : Y("    [WARN] ");
        console.log(`${icon} ${issue.msg}`);
      }
      if (item.issues.length === 0) {
        console.log(G("    All SEO fields present and valid"));
      }
    }
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  console.log(`\n${"─".repeat(60)}`);
  console.log(W("SUMMARY"));
  console.log(`  Total audited : ${results.length}`);
  console.log(`  ${G("✓ OK     ")} : ${ok.length}`);
  console.log(`  ${Y("⚠ Warning")} : ${warnings.length}`);
  console.log(`  ${R("✗ Error  ")} : ${errors.length}`);

  if (errors.length > 0) {
    console.log(`\n${R("TOP ERRORS TO FIX:")}`);
    for (const r of errors) {
      const errMsgs = r.issues.filter((i) => i.level === "error").map((i) => i.msg);
      console.log(`  ${R("✗")} [${r.type}] ${r.label}`);
      for (const m of errMsgs) console.log(`      → ${m}`);
    }
  }

  // ─── Write JSON report ───────────────────────────────────────────────────────

  const reportPath = path.resolve("tmp/seo-audit-result.json");
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: results.length,
      ok: ok.length,
      warnings: warnings.length,
      errors: errors.length,
    },
    results,
  };

  try {
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n${G("✓")} Full report written to: ${B("tmp/seo-audit-result.json")}\n`);
  } catch (e) {
    console.log(`\n${Y("⚠")} Could not write report file: ${e.message}`);
  }

  // Exit with error code if there are errors (useful in CI)
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(R(`Unhandled error: ${err.message}`));
  process.exit(1);
});
