/**
 * seed-seo-blogs.mjs
 * Creates all 13 SEO landing pages as blog posts in Convex.
 * Reads from: nb scraped data/output/content/
 * Run: node scripts/seed-seo-blogs.mjs
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../nb scraped data/output/content");
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) { console.error("Missing NEXT_PUBLIC_CONVEX_URL"); process.exit(1); }

const client = new ConvexHttpClient(CONVEX_URL);

function extractCleanContent(raw) {
  const lines = raw.split("\n").map(l => l.replace(/\t+/g, " ").trim()).filter(Boolean);
  let title = "";
  let bodyLines = [];
  let seenLines = new Set();
  
  for (const line of lines) {
    if (line.startsWith("Title:")) { title = line.replace("Title:", "").trim(); continue; }
    if (line.startsWith("URL:")) continue;
    if (line.length < 30) continue; 
    if (line.includes("Skip to content") || line.includes("Toggle website")) continue;
    if (line.match(/^\+91|naturesboon@yahoo|naturesboon\.net\/wp-content/)) continue;
    if (seenLines.has(line)) continue;
    seenLines.add(line);
    bodyLines.push(line);
  }
  return { title, bodyLines };
}

function buildPuckJSON(title, bodyLines) {
  const content = [];
  let currentGroup = [];
  let blockCount = 0;

  function pushTextBlock() {
    if (currentGroup.length === 0) return;
    const html = currentGroup.map(line => {
      const isHeading = line.length < 80 && (
        line.endsWith("?") || 
        line.match(/^(Why|How|What|Benefits|Features|Process|Contact|About|FAQ|Our|Best|Top|Private|Face|Hair|Body|Men|Skin)/i) ||
        line.match(/^[A-Z][^a-z]{0,5}[A-Z]/)
      );
      return isHeading ? `<h2>${line}</h2>` : `<p>${line}</p>`;
    }).join("");

    content.push({
      type: "TextBlock",
      props: { id: `text-${blockCount++}`, content: html, alignment: "left", maxWidth: "none" },
    });
    currentGroup = [];
  }

  content.push({
    type: "TextBlock",
    props: { id: "header-title", content: `<h1>${title}</h1>`, alignment: "left", maxWidth: "none" }
  });

  for (let i = 0; i < bodyLines.length; i++) {
    currentGroup.push(bodyLines[i]);
    if (currentGroup.length >= 6 || (i > 0 && bodyLines[i].length < 60 && bodyLines[i].match(/^[A-Z]/))) {
      pushTextBlock();
      if (i % 15 === 0 && i > 0) {
        content.push({
          type: "InlineImage",
          props: { id: `image-${blockCount++}`, imageUrl: "", size: "large", altText: title }
        });
      }
    }
  }
  pushTextBlock();

  content.push({
    type: "TextBlock",
    props: {
        id: "cta-text",
        content: `<hr><h2>Get in Touch</h2><p>Looking for a trusted manufacturing partner in India? <a href="/contact">Contact Nature's Boon</a> today to discuss your private label requirements, MOQ, and pricing.</p>`,
        alignment: "left",
        maxWidth: "none",
    }
  });

  return JSON.stringify({ content, root: { props: {} } });
}

function buildExcerpt(bodyLines) {
  const first = bodyLines.find(l => l.length > 80 && !l.match(/^\+91|Title:|URL:/));
  return first ? first.substring(0, 200) + "..." : "";
}

const SEO_PAGES = [
  { slug: "best-face-wash-manufacturers-in-india", title: "Best Face Wash Manufacturers in India", keywords: "face wash manufacturers india, private label face wash, face wash OEM manufacturer" },
  { slug: "best-facial-kit-manufacturers-in-india", title: "Best Facial Kit Manufacturers in India", keywords: "facial kit manufacturers india, private label facial kit, facial kit OEM" },
  { slug: "best-hair-serum-manufacturers-in-india", title: "Best Hair Serum Manufacturers in India", keywords: "hair serum manufacturers india, private label hair serum, hair serum OEM" },
  { slug: "best-shampoo-manufacturers-in-india", title: "Best Shampoo Manufacturers in India", keywords: "shampoo manufacturers india, private label shampoo" },
  { slug: "best-body-lotion-manufacturers-in-india", title: "Best Body Lotion Manufacturers in India", keywords: "body lotion manufacturers india, private label body lotion" },
  { slug: "best-body-scrub-manufacturers-in-india", title: "Best Body Scrub Manufacturers in India", keywords: "body scrub manufacturers india, private label body scrub" },
  { slug: "best-face-serum-manufacturers-in-india", title: "Best Face Serum Manufacturers in India", keywords: "face serum manufacturers india, vitamin C serum manufacturer" },
  { slug: "best-sunscreen-manufacturers-in-india", title: "Best Sunscreen Manufacturers in India", keywords: "sunscreen manufacturers india, SPF sunscreen manufacturer" },
  { slug: "hair-oil-manufacturers-in-india", title: "Best Hair Oil Manufacturers in India", keywords: "hair oil manufacturers india, ayurvedic hair oil manufacturer" },
  { slug: "private-label-skin-care-products-manufacturers-in-india", title: "Best Skin Care Products Manufacturers in India", keywords: "skin care manufacturers india, private label skincare" },
  { slug: "private-label-third-party-beard-oil-manufacturers-in-india", title: "Best Beard Oil Manufacturers in India", keywords: "beard oil manufacturers india, private label beard oil" },
  { slug: "third-party-contract-cosmetics-products-manufacturers-in-india", title: "Top Third Party Cosmetics Manufacturers in India", keywords: "contract cosmetics manufacturers india, third party cosmetics" },
  { slug: "top-derma-products-manufacturers-in-india", title: "Top Derma Products Manufacturers in India", keywords: "derma products manufacturers india, dermatology products OEM" },
];

async function run() {
  console.log(`Seeding ${SEO_PAGES.length} SEO blog posts...\n`);
  for (const page of SEO_PAGES) {
    const filePath = path.join(CONTENT_DIR, page.slug + ".txt");
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠  File not found: ${page.slug}.txt — skipping`);
      continue;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const { bodyLines } = extractCleanContent(raw);
    const content = buildPuckJSON(page.title, bodyLines);
    const excerpt = buildExcerpt(bodyLines);
    
    try {
      console.log(`  → Ingesting: ${page.slug}...`);
      await client.mutation(api.ingestion_mutations.saveIngestedBlog, {
        title: page.title,
        slug: page.slug,
        content,
        excerpt,
        author: "Nature's Boon Team",
        keywords: page.keywords,
        category: "seo-page",
      });
      console.log(`  ✓  Done: /blogs/${page.slug}`);
    } catch (err) {
      console.error(`  ✗  Failed: ${page.slug} — ${err.message}`);
    }
  }
  console.log("\nDone. All SEO blog posts seeded.");
}

run().catch(console.error);
