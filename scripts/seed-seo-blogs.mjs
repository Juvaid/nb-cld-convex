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
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!CONVEX_URL) { console.error("Missing NEXT_PUBLIC_CONVEX_URL"); process.exit(1); }
if (!ADMIN_TOKEN) { console.error("Missing ADMIN_TOKEN"); process.exit(1); }

const client = new ConvexHttpClient(CONVEX_URL);

function extractCleanContent(raw) {
  // Remove nav/header junk, deduplicate lines, build clean markdown
  const lines = raw.split("\n").map(l => l.replace(/\t+/g, " ").trim()).filter(Boolean);
  
  let title = "";
  let bodyLines = [];
  let seenLines = new Set();
  let skipUntilContent = true;
  
  for (const line of lines) {
    if (line.startsWith("Title:")) { title = line.replace("Title:", "").trim(); continue; }
    if (line.startsWith("URL:")) continue;
    if (line.length < 30) continue; // skip short nav fragments
    
    // Skip obvious nav/menu duplicates
    if (line.includes("Skip to content") || line.includes("Toggle website")) continue;
    if (line.match(/^\+91|naturesboon@yahoo|naturesboon\.net\/wp-content/)) continue;
    
    // Deduplicate exact lines
    if (seenLines.has(line)) continue;
    seenLines.add(line);
    
    bodyLines.push(line);
  }
  
  return { title, bodyLines };
}

function buildMarkdown(title, bodyLines) {
  const md = [];
  md.push(`# ${title}\n`);
  
  let i = 0;
  while (i < bodyLines.length) {
    const line = bodyLines[i];
    
    // Detect section headings (usually short, end with ?, or are repeated)
    const isHeading = line.length < 80 && (
      line.endsWith("?") || 
      line.match(/^(Why|How|What|Benefits|Features|Process|Contact|About|FAQ|Our|Best|Top|Private|Face|Hair|Body|Men|Skin)/i) ||
      line.match(/^[A-Z][^a-z]{0,5}[A-Z]/) // ALL CAPS
    );
    
    if (isHeading && i < bodyLines.length - 1) {
      md.push(`\n## ${line}\n`);
    } else {
      md.push(line + "\n");
    }
    i++;
  }
  
  // Add CTA at end
  md.push(`\n---\n\n## Get in Touch\n\nLooking for a trusted manufacturing partner in India? [Contact Nature's Boon](/contact) today to discuss your private label requirements, MOQ, and pricing.\n`);
  
  return md.join("\n");
}

function buildExcerpt(bodyLines) {
  // Find first real paragraph-length line
  const first = bodyLines.find(l => l.length > 80 && !l.match(/^\+91|Title:|URL:/));
  return first ? first.substring(0, 200) + "..." : "";
}

const SEO_PAGES = [
  {
    slug: "best-face-wash-manufacturers-in-india",
    title: "Best Face Wash Manufacturers in India",
    keywords: "face wash manufacturers india, private label face wash, face wash OEM manufacturer, best face wash company india"
  },
  {
    slug: "best-facial-kit-manufacturers-in-india", 
    title: "Best Facial Kit Manufacturers in India",
    keywords: "facial kit manufacturers india, private label facial kit, facial kit OEM, 5 step facial kit manufacturer"
  },
  {
    slug: "best-hair-serum-manufacturers-in-india",
    title: "Best Hair Serum Manufacturers in India", 
    keywords: "hair serum manufacturers india, private label hair serum, hair serum OEM, argan oil serum manufacturer"
  },
  {
    slug: "best-shampoo-manufacturers-in-india",
    title: "Best Shampoo Manufacturers in India",
    keywords: "shampoo manufacturers india, private label shampoo, sulphate free shampoo manufacturer, OEM shampoo india"
  },
  {
    slug: "best-body-lotion-manufacturers-in-india",
    title: "Best Body Lotion Manufacturers in India",
    keywords: "body lotion manufacturers india, private label body lotion, moisturizer manufacturer india"
  },
  {
    slug: "best-body-scrub-manufacturers-in-india",
    title: "Best Body Scrub Manufacturers in India",
    keywords: "body scrub manufacturers india, private label body scrub, coffee scrub manufacturer, walnut scrub OEM"
  },
  {
    slug: "best-face-serum-manufacturers-in-india",
    title: "Best Face Serum Manufacturers in India",
    keywords: "face serum manufacturers india, vitamin C serum manufacturer, hyaluronic acid serum OEM, private label serum"
  },
  {
    slug: "best-sunscreen-manufacturers-in-india",
    title: "Best Sunscreen Manufacturers in India",
    keywords: "sunscreen manufacturers india, SPF sunscreen manufacturer, private label sunscreen, sunblock OEM india"
  },
  {
    slug: "hair-oil-manufacturers-in-india",
    title: "Best Hair Oil Manufacturers in India",
    keywords: "hair oil manufacturers india, ayurvedic hair oil manufacturer, private label hair oil, coconut hair oil OEM"
  },
  {
    slug: "private-label-skin-care-products-manufacturers-in-india",
    title: "Best Skin Care Products Manufacturers in India",
    keywords: "skin care manufacturers india, private label skincare, skincare OEM manufacturer, cosmetics manufacturer india"
  },
  {
    slug: "private-label-third-party-beard-oil-manufacturers-in-india",
    title: "Best Beard Oil Manufacturers in India",
    keywords: "beard oil manufacturers india, private label beard oil, men grooming manufacturer, beard care OEM"
  },
  {
    slug: "third-party-contract-cosmetics-products-manufacturers-in-india",
    title: "Top Third Party Cosmetics Manufacturers in India",
    keywords: "contract cosmetics manufacturers india, third party cosmetics, white label cosmetics manufacturer, OEM cosmetics india"
  },
  {
    slug: "top-derma-products-manufacturers-in-india",
    title: "Top Derma Products Manufacturers in India",
    keywords: "derma products manufacturers india, dermatology products OEM, private label derma, skin clinic products manufacturer"
  },
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
    const content = buildMarkdown(page.title, bodyLines);
    const excerpt = buildExcerpt(bodyLines);
    
    try {
      // Check if already exists
      const existing = await client.query(api.blogs.getBlogBySlug, { slug: page.slug });
      
      if (existing) {
        console.log(`  → Already exists: ${page.slug} — updating content`);
        await client.mutation(api.blogs.updateBlog, {
          id: existing._id,
          title: page.title,
          content,
          excerpt,
          keywords: page.keywords,
          status: "published",
          category: "seo-page",
          token: ADMIN_TOKEN,
        });
        console.log(`  ✓  Updated: ${page.slug}`);
      } else {
        const id = await client.mutation(api.blogs.createDraft, {
          title: page.title,
          slug: page.slug,
          author: "Nature's Boon Team",
          token: ADMIN_TOKEN,
        });
        
        await client.mutation(api.blogs.updateBlog, {
          id,
          content,
          excerpt,
          keywords: page.keywords,
          status: "published",
          category: "seo-page",
          token: ADMIN_TOKEN,
        });
        console.log(`  ✓  Created: /blogs/${page.slug}`);
      }
    } catch (err) {
      console.error(`  ✗  Failed: ${page.slug} — ${err.message}`);
    }
  }
  
  console.log("\nDone. All SEO blog posts seeded.");
  console.log("Run this command in GSC to request indexing:");
  console.log("  https://search.google.com/search-console → URL Inspection → request each /blogs/[slug]");
}

run().catch(console.error);
