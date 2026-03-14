# Nature's Boon — Audit Remediation Master Plan
**Repo:** github.com/Juvaid/nb-cld-convex  
**Stack:** Next.js 14 (App Router), Puck CMS, Convex DB, Cloudflare R2, Framer Motion  
**Date:** March 14, 2026  

---

## Architecture at a glance

Before making any fix, understand this render pipeline:

```
Convex DB (publishedData)
        ↓
CmsPageRenderer (Server Component)
  └─ fetchQuery(getPublishedPage)   ← SSR data fetch
  └─ preloadQuery(...)              ← hydration handles
        ↓
CmsPageClient (Client Component)
  ├─ if (!mounted) → render with initialPage/fallbackData   ← SSR + first paint
  └─ if (mounted)  → LiveContent using usePreloadedQuery    ← live Convex stream
        ↓
PuckRenderer
  └─ maps block.type → config.components[type].render(props, initialData)
```

**Key rule:** If `getPublishedPage` returns `null` (no `publishedData` in DB for that path), the page falls back to the static `fallbackData` TypeScript file. The `stats` table in Convex feeds `globalStats` via `api.siteData.getStats`.

---

## P0 — Fix before any traffic (do these today)

---

### P0-01 · Stats counter renders "0+" on all six metrics

**File:** `components/blocks/StatsCounter.tsx`

**Root cause — two compounding issues:**

**Issue A — SSR renders 0, not target:**  
`countValue` is a Framer Motion `useTransform` of a spring that starts at `0`. During SSR and the first client paint, the spring hasn't moved, so every stat renders `0` + suffix. There is no static fallback.

**Issue B — `useInView` margin is too aggressive:**  
```ts
// Line 27 — current code
const isInView = useInView(ref, { once: true, margin: "-100px" });
```
On mobile viewports (375px) the section is close to the bottom of the page. The `-100px` inset means the observer only fires when the element is 100px *inside* the viewport — on short screens it may never fire before the user scrolls past. Even on desktop this fires late, meaning Google's Lighthouse screenshot and any social preview scraper captures `0+`.

**Issue C — Potential empty `globalStats` winning over `props.stats`:**  
In `components/puck/config.tsx` line 386:
```ts
const finalStats = props.useGlobalStats 
  ? (globalStats || props.stats || []) 
  : props.stats;
```
If `useGlobalStats` is `true` in the CMS block config and the `stats` table in Convex is empty, `globalStats` resolves to `[]`. Because `[]` is truthy in JavaScript, `[] || props.stats` evaluates to `[]` — an empty array — and the stats section renders nothing at all. This is the likely cause of the `0+` display if the block was saved with `useGlobalStats: true`.

**Fix A — SSR-safe static fallback (primary fix):**

In `StatsCounter.tsx`, replace the `AnimatedCounter` component:

```tsx
// BEFORE
function AnimatedCounter({ target, label, stat, index }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const numericTarget = parseInt(target.replace(/[^0-9]/g, '')) || 0;
  const suffix = target.replace(/[0-9]/g, '');

  const springConfig = { damping: 60, stiffness: 100, mass: 1 };
  const countProgress = useSpring(0, springConfig);
  const countValue = useTransform(countProgress, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      countProgress.set(numericTarget);
    }
  }, [isInView, numericTarget, countProgress]);
  
  // ...render uses <motion.span>{countValue}</motion.span>
}
```

```tsx
// AFTER
function AnimatedCounter({ target, label, stat, index }) {
  const ref = useRef<HTMLDivElement>(null);
  // FIX: reduced margin so trigger fires earlier on all screen sizes
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  const numericTarget = parseInt(target.replace(/[^0-9]/g, '')) || 0;
  const suffix = target.replace(/[0-9]/g, '');

  // FIX: start display at numericTarget, not 0 — SSR always shows real number
  const [displayValue, setDisplayValue] = useState(numericTarget);

  const springConfig = { damping: 60, stiffness: 100, mass: 1 };
  const countProgress = useSpring(0, springConfig);
  
  useEffect(() => {
    return countProgress.on("change", (v) => setDisplayValue(Math.floor(v)));
  }, [countProgress]);

  useEffect(() => {
    if (isInView) {
      countProgress.set(numericTarget);
    }
  }, [isInView, numericTarget, countProgress]);

  // ...render uses <span>{displayValue}</span> (plain span, not motion.span)
}
```

**Fix B — Null-safe `globalStats` in Puck config:**

In `components/puck/config.tsx` line 386:

```ts
// BEFORE — [] is truthy so empty array silently wins
const finalStats = props.useGlobalStats 
  ? (globalStats || props.stats || []) 
  : props.stats;

// AFTER — only use globalStats if it has actual items
const finalStats = props.useGlobalStats && globalStats?.length > 0
  ? globalStats
  : (props.stats || []);
```

**Fix C — Confirm correct values in CMS admin:**  
Go to `/admin` → homepage → edit the `ModernStats` block. Confirm `useGlobalStats` is set to **No** and the stats array contains:

| value | label |
|---|---|
| `20+` | Years of Experience |
| `65+` | Strong Family |
| `200+` | SKUs Produced Annually |
| `75+` | Products by In-house R&D |
| `20+` | Happy Clients |
| `750+` | Tons Annual Capacity |

Then click **Publish**.

**Acceptance criteria:**
- [ ] All 6 stats show correct numbers immediately on page load (no JS required)
- [ ] Disabling JavaScript in browser still shows correct numbers (not `0+`)
- [ ] Counter animation triggers on mobile 375px viewport
- [ ] Google Lighthouse screenshot shows real numbers, not `0+`
- [ ] No console errors related to stats rendering

---

### P0-02 · Skin Care category card shows hero banner image

**Location:** Live CMS data in Convex — not in the TypeScript fallback files.  
The homepage in `home-page-data.json` only has 4 blocks (ModernHero, ModernStats, ModernServices, CallToAction). The categories section visible on the live site is coming from the **published Convex page data**, not the fallback. This means the fix is in the admin panel, not the codebase.

**Fix:**

1. Go to `/admin` → homepage → find the `CategoryPortfolio` block (or whatever block renders the 5 category cards)
2. Click the **Skin care** card entry
3. Replace the image — it currently points to `herobannerv2.png`. Upload or select the correct skin care product image from R2
4. The other category images for reference (all in the R2 bucket):
   - Personal care: `1773054700179-personal-care.png`
   - Men's Grooming: `1773054751450-mensgrooming.png`  
   - Hair care: `1773054257290-haircare.png`
   - Bridal Kits: `1773037653061-2-768x576.jpg`
5. Click **Publish**

**If a dedicated skin care category image doesn't exist yet:**  
Upload one to R2 first. It should match the aspect ratio and style of the other category images. Name it something like `skincare-category.png` for clarity.

**Acceptance criteria:**
- [ ] All 5 category cards show visually distinct images
- [ ] No two cards share the same image URL
- [ ] Skin Care card renders a skin care product image, not the hero banner

---

### P0-03 · Page title tag bugs (double pipe and duplicate brand name)

**Root cause — confirmed by reading the code:**

`lib/seo.ts` sets up a Next.js metadata template in the root layout:
```ts
// lib/seo.ts — generateBaseMetadata()
title: {
  default: title,                          // "Nature's Boon | Manufacturing Excellence"
  template: `%s | ${SITE_CONFIG.name}`,   // "%s | Nature's Boon"
},
```

`lib/generatePageMetadata.ts` — `generatePageMetadata()` returns:
```ts
return {
  title: page.title,  // e.g. "Products"
  // ...
}
```

Next.js then applies the template: `"Products" + " | Nature's Boon"` = ✅ correct.

**But the bug is in how titles are stored in Convex.** When a page title is saved in the admin as `"Products | Nature's Boon"` (with the brand already appended), Next.js wraps it again → `"Products | Nature's Boon | Nature's Boon"`.

The double pipe `"Products | | Nature's Boon"` happens when `page.title` is stored as `"Products | "` — i.e. someone typed a separator into the title field thinking it was needed.

**Fix — two parts:**

**Part 1 — Fix stored titles in Convex admin:**  
Go to `/admin` → each page → check the `Page Title (SEO)` field in the root panel (the `title` field registered in `config.tsx` lines 76–78). It should be just the page name with no separators or brand suffix:

| Page | Correct title to save |
|---|---|
| `/` | `Nature's Boon \| Personal Care Manufacturer` |
| `/products` | `Products` |
| `/services` | `Services` |
| `/about` | `About Us` |
| `/contact` | `Contact Us` |
| `/blogs` | `Blog` |

**Part 2 — Add a guard in `generatePageMetadata` to strip accidental separators:**

In `lib/generatePageMetadata.ts`, add a sanitiser before returning:

```ts
export function generatePageMetadata(page: PageRecord, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = getAbsoluteImageUrl(page.ogImage);

  // Guard: strip any trailing " | Nature's Boon" that may have been saved
  // in the CMS title field, to prevent the root template doubling it
  const cleanTitle = page.title
    ?.replace(/\s*\|\s*Nature['']s Boon\s*$/i, "")
    ?.replace(/\s*\|\s*$/, "")
    ?.trim() || "";

  return {
    title: cleanTitle,   // Root layout template appends " | Nature's Boon"
    description: page.description,
    // ...rest unchanged
  };
}
```

**Acceptance criteria:**
- [ ] `/products` title renders as `"Products | Nature's Boon"` in `<title>` tag
- [ ] `/contact` title renders as `"Contact Us | Nature's Boon"` — not duplicated
- [ ] `/about` title renders as `"About Us | Nature's Boon"`
- [ ] No page has `||` or repeated `Nature's Boon` in its title
- [ ] Verify with: `curl -s https://new.naturesboon.net/products | grep -o '<title>[^<]*</title>'`

---

### P0-04 · `/products` and `/contact` pages return almost no HTML to crawlers

**Root cause — confirmed by reading `CmsPageClient.tsx`:**

```tsx
// CmsPageClient.tsx — the mounted guard
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) {
  // SSR path — renders with initialPage or fallbackData
  return (
    <div className="min-h-screen bg-background">
      <PuckRenderer data={displayData || { root: {}, content: [] }} ... />
    </div>
  );
}
```

The SSR path looks correct. But `products/page.tsx` uses `export const dynamic = "force-dynamic"`, meaning the page never gets statically generated and must do a live Convex fetch on every request. If the Convex cloud URL is unreachable during an audit crawl (e.g. rate limited, cold start, or wrong env var at build), `fetchQuery` throws, is caught silently, and `initialPage` becomes `null`. The page then falls back to `productsPageData` — which does exist and has content — but the `PuckRenderer` may still render an empty shell if `ProductBrowser` needs `initialDbProducts` which also failed to fetch.

**Fix — make fallback truly unconditional:**

In `CmsPageRenderer.tsx`, wrap the dynamic fetches more defensively and ensure the fallback is always passed:

```tsx
// CmsPageRenderer.tsx
export async function CmsPageRenderer({ path, fallbackData, useDynamicData }: CmsPageRendererProps) {
  let initialPage = null;
  let initialSettings = null;
  let initialStats = null;
  let initialCategories = null;
  let initialProducts = null;

  try {
    // Wrap all fetches in a single try/catch with a timeout
    const timeout = (ms: number) => new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Convex timeout")), ms)
    );
    
    [initialPage, initialSettings, initialStats] = await Promise.race([
      Promise.all([
        fetchQuery(api.pages.getPublishedPage, { path }),
        fetchQuery(api.siteSettings.getSiteSettings),
        fetchQuery(api.siteData.getStats),
      ]),
      timeout(5000).then(() => [null, null, null])
    ]) as any;

    if (useDynamicData || path === "/products") {
      [initialCategories, initialProducts] = await Promise.race([
        Promise.all([
          fetchQuery(api.categories.list),
          fetchQuery(api.products.listAll, { status: "active" }),
        ]),
        timeout(5000).then(() => [null, null])
      ]) as any;
    }
  } catch (e) {
    console.error(`[CmsPageRenderer] SSR fetch failed for ${path}:`, e);
    // All vars stay null — client will hydrate with live data
  }

  // preloadQuery handles stay the same...
```

This ensures the page always renders something — either from Convex or from `fallbackData` — with a 5 second deadline. The client then hydrates with live data once mounted.

**Also verify in admin:** Go to `/admin` → make sure `/products` and `/contact` pages have a published version. If the page records exist in Convex but have no `publishedData` (only `draftData`), `getPublishedPage` returns `null`. Use the **Publish** button in the page editor to set `publishedData`.

**Acceptance criteria:**
- [ ] `curl -s https://new.naturesboon.net/products | wc -c` returns >10,000 bytes
- [ ] `curl -s https://new.naturesboon.net/contact | wc -c` returns >10,000 bytes  
- [ ] Google Rich Results Test shows page content for both URLs
- [ ] Products page renders at least the hero and product list with JavaScript disabled

---

### P0-05 · Empty `##` heading above Social Feed section on homepage

**Location:** Live Convex page data for `/` — not in `home-page-data.json`.

The homepage fallback JSON only has 4 blocks. The live page has many more sections including the Instagram feed. The empty heading is in the published Puck data in Convex.

**Fix:**

1. Go to `/admin` → homepage
2. Find the block that renders the Instagram/Social Feed section (likely `InstagramCarouselBlock` based on the import in `config.tsx`)
3. Look for a `heading` or `title` field that is empty — either fill it in (e.g. `"Follow Us on Instagram"`) or, if the component supports it, leave it blank and ensure the component handles an empty title gracefully

**Code fix in `components/puck/blocks/InstagramCarouselBlock.tsx`** (secondary fix so this can't happen again):

```tsx
// Find the heading render, likely something like:
{heading && <h2>{heading}</h2>}

// If it's rendering unconditionally:
<h2>{heading}</h2>  // ← this renders an empty <h2></h2> when heading is ""

// Fix — only render if non-empty after trim:
{heading?.trim() && <h2>{heading}</h2>}
```

**Acceptance criteria:**
- [ ] No empty `<h2>` or `<h3>` tags above the Social Feed section in the page HTML
- [ ] `curl -s https://new.naturesboon.net | grep -c '<h2></h2>'` returns `0`

---

## P1 — Complete within 1 week

---

### P1-01 · Footer links to `/about-us` while header links to `/about` — fix the footer

**Status:** Not actually broken — `next.config.ts` already has a 301 redirect:
```ts
{ source: '/about-us', destination: '/about', permanent: true },
```
So `/about-us` redirects to `/about`. Both paths work. However the redirect chain adds a round trip and passes slightly less SEO equity than a direct link.

**Fix — clean up the footer `href` generation:**

In `components/SiteFooter.tsx`, the footer Quick Links are generated programmatically:
```tsx
const href = link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-').replace('our-', '')}`;
```

For `"About Us"` this produces `/about-us`. Change the footer array or add a lookup:

```tsx
// BEFORE
{['Home', 'About Us', 'Services', 'Our Products', 'Contact'].map((link) => {
  const href = link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-').replace('our-', '')}`;

// AFTER — explicit map to avoid fragile string manipulation
const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },        // matches header
  { label: 'Services', href: '/services' },
  { label: 'Our Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

{quickLinks.map(({ label, href }) => (
```

**Acceptance criteria:**
- [ ] Footer "About Us" link goes directly to `/about` with no redirect
- [ ] Header and footer both use `/about` — zero inconsistency

---

### P1-02 · `/blogs` page renders empty — no content feedback for visitors

**Status:** `app/blogs/page.tsx` and `app/blogs/BlogsClient.tsx` exist. The page is not 404ing — it's rendering an empty blog listing because no blog posts have been published to Convex.

**Fix — add an empty state to `BlogsClient.tsx`:**

Find `app/blogs/BlogsClient.tsx` and add an empty state when `blogs.length === 0`:

```tsx
if (!blogs || blogs.length === 0) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Blog</h1>
      <p className="text-slate-500 text-lg max-w-md">
        We're working on our first posts. Check back soon for insights on 
        private label manufacturing, skincare formulation, and brand building.
      </p>
    </div>
  );
}
```

**Or — hide the Blogs nav item until content is ready:**

In `components/SiteHeader.tsx`, the nav links are hardcoded:
```tsx
{ label: "Home", href: "/" },
{ label: "About", href: "/about" },
{ label: "Services", href: "/services" },
{ label: "Products", href: "/products" },
{ label: "Blogs", href: "/blogs" },   // ← remove or conditionally hide
```

Remove the Blogs entry until at least 3 posts are published. Add it back once content exists.

**Acceptance criteria:**
- [ ] Visiting `/blogs` does not show a blank white page
- [ ] Either an empty state message or a hidden nav item — not a visibly broken page

---

### P1-03 · Add floating WhatsApp button site-wide

**File to edit:** `components/SiteFooter.tsx` or create a new `components/WhatsAppFAB.tsx`

The WhatsApp number is already in the codebase (`+91-9877659808`). It just needs a persistent floating button.

**Implementation:**

Create `components/WhatsAppFAB.tsx`:

```tsx
"use client";
import Link from "next/link";

const WA_NUMBER = "919877659808";
const WA_MESSAGE = encodeURIComponent("Hi, I'd like to enquire about manufacturing services.");

export function WhatsAppFAB() {
  return (
    <Link
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
    >
      {/* WhatsApp SVG icon */}
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </Link>
  );
}
```

Then add `<WhatsAppFAB />` inside `app/layout.tsx` before the closing `</body>`:

```tsx
// app/layout.tsx
import { WhatsAppFAB } from "@/components/WhatsAppFAB";

// Inside the body:
<Providers children={children} modal={modal} />
<WhatsAppFAB />
```

**Acceptance criteria:**
- [ ] Green WhatsApp button visible bottom-right on all pages
- [ ] Clicking opens WhatsApp with the pre-filled message
- [ ] Button does not overlap footer content on mobile
- [ ] `position: fixed` does not cause layout shift

---

### P1-04 · Build a structured RFQ (Request for Quotation) form

**Status:** `components/blocks/ContactForm.tsx` and `components/blocks/ContactSection.tsx` exist. The current form is generic. It needs to be replaced with a structured RFQ.

**Convex mutation exists:** `convex/inquiries.ts` — check this file for the existing schema and add new fields if needed.

**Add these fields to the RFQ form in `ContactSection.tsx` or a new `RFQForm.tsx` block:**

```
Full Name *
Brand Name (optional)
Email *
Phone / WhatsApp *
Product Category * (dropdown)
  - Skin Care
  - Hair Care  
  - Body & Personal Care
  - Men's Grooming
  - Bridal Kit
  - Other
Type of Request * (dropdown)
  - Custom Formulation
  - Private Label (existing formula)
  - Label & Packaging Design Only
  - Full Brand Setup (end-to-end)
Approximate Quantity *
  - Under 500 units
  - 500–2,000 units
  - 2,000–10,000 units
  - 10,000+ units
Do you have an existing formula? * (radio: Yes / No / Not sure)
Timeline
  - ASAP
  - 1–3 months
  - 3–6 months
  - Just exploring
Additional notes (textarea)
```

**Update `convex/inquiries.ts`** to store the new fields — check the current schema and add any missing fields with `v.optional()` so existing submissions aren't broken.

**Acceptance criteria:**
- [ ] RFQ form live at `/contact`
- [ ] All required fields validate before submission
- [ ] Successful submission stores in Convex `inquiries` table with all fields
- [ ] Admin receives notification email on new submission (check `convex/notifications.ts`)
- [ ] Form resets after submission with a success message

---

### P1-05 · Add MOQ and FAQ content to the site

**Option A — FAQ accordion on homepage (quickest):**

Add a `FAQAccordion` block to the homepage in the admin. This block type already exists in `config.tsx` line 119 (Content category). Add it via the Puck editor with these questions:

```
Q: What is your minimum order quantity (MOQ)?
A: Our MOQ starts at 500 units per SKU. For custom formulations the minimum 
   may vary depending on the complexity of the formula and packaging.

Q: Do you develop custom formulations?
A: Yes. Our in-house R&D team has developed 75+ products. We can create a 
   formula from scratch or adapt an existing one to your specifications.

Q: How long does production take from approval to delivery?
A: Standard timelines are 4–6 weeks for existing formulas with supplied 
   packaging, and 8–12 weeks for full custom formulation and packaging.

Q: Can I supply my own packaging?
A: Yes. We can fill into client-supplied packaging or source and print 
   packaging on your behalf.

Q: Do you ship outside Punjab / outside India?
A: We ship pan-India. For international orders, please contact us to 
   discuss logistics and compliance requirements for your target market.

Q: What certifications does Nature's Boon hold?
A: [FILL IN — GMP, ISO number, MSME registration, drug license details 
   — get these from the team before publishing]
```

**Option B — Standalone `/faq` page:**  
Create `app/faq/page.tsx` using `CmsPageRenderer` with a fallback data file containing the same content as above. Add `/faq` to the `sitemap.ts` and footer Quick Links.

**Acceptance criteria:**
- [ ] MOQ is mentioned at least once on the site with a specific number
- [ ] FAQ answers the top 6 buyer questions listed above
- [ ] FAQ content is indexable (server-rendered, not JS-only)

---

## P2 — Complete within 2 weeks

---

### P2-01 · ISO certification claim needs substantiation

**Location:** `data/about-page-data.ts` line 35 and the live Convex about page data.

The about page states `"ISO Certified Quality"` in the WhyChooseUs block. This is a serious trust signal — but only if it's backed up. A buyer doing due diligence will ask for the certificate number.

**Fix — one of three options (choose based on actual certification status):**

Option A — If ISO certified: add the certificate number and a scanned image.  
In the `WhyChooseUs` block on the about page, update the ISO item:
```
Title: ISO 9001:2015 Certified
Desc: Certified under ISO 9001:2015 [Certificate No: XXXXXXX]. 
      All products undergo rigorous multi-stage quality testing.
```
Upload the certificate scan to R2 and link it from a "View Certificate" button.

Option B — If GMP certified but not ISO: change the label:
```
Title: GMP Certified Facility
Desc: Our manufacturing follows Good Manufacturing Practices (GMP) 
      ensuring consistent quality, hygiene, and compliance.
```

Option C — If neither: remove the claim entirely. Do not publish certifications you don't hold.

**Acceptance criteria:**
- [ ] ISO/GMP claim on About page is accurate and matches actual held certifications
- [ ] Certificate number or scan is linked so buyers can verify
- [ ] No unsubstantiated quality claims on any page

---

### P2-02 · Service pages need real content

**Files:** `data/services-page-data.ts`, live Convex `/services` page data

Each of the 4 services currently has 1–2 generic sentences. Replace with specific content.

In the admin, edit each `ServiceDetailList` or similar block for each service and add:

**Label & Packaging Designing:**
- What's included: dieline creation, print-ready artwork, supplier coordination
- Process: brief → concept → revision → final files → print approval
- Deliverables: AI/PDF print files, mockup renders, supplier print spec sheet
- Timeline: 7–14 working days from approved brief

**Customised Finished Product:**
- What's included: market research, formula development, stability testing, batch production
- Process: consultation → formula brief → lab batch → approval → scale-up → production
- MOQ: from 500 units
- Timeline: 8–12 weeks (custom) / 4–6 weeks (existing formula)

**Trademark & Logo:**
- What's included: trademark search, logo design (3 concepts), registration support
- Process: brief → research → 3 concepts → 2 rounds revision → final files
- Deliverables: SVG/PNG/PDF logo files, brand guidelines document
- Timeline: 10–15 working days

**Digital Marketing:**
- What's included: Instagram content creation, paid social campaigns, influencer coordination
- Platforms: Instagram, Facebook, Amazon product listing optimisation
- Reporting: monthly performance report

**Acceptance criteria:**
- [ ] Each service page section has 300+ words of specific content
- [ ] Each service lists deliverables, timeline, and process
- [ ] Each service ends with a link/CTA to the RFQ form

---

### P2-03 · Add PDF catalog downloads to new site

**Script already exists:** `scripts/uploadCatalogs.mjs` — this suggests catalogs were intended to be uploaded to R2.

**Check if already uploaded:**
```bash
node scripts/uploadCatalogs.mjs --list
```

If not uploaded, run the upload script with the catalog PDFs.

**Then add a `DocumentList` block to the `/products` page or `/contact` page:**

The `DocumentList` block already exists: `components/blocks/DocumentList.tsx`. In the admin, add it to the products page with:

| Name | Description | R2 URL |
|---|---|---|
| Product Catalog | Full range of personal care products | [R2 key] |
| Coffee Collection Catalog | Coffee-based skincare & haircare range | [R2 key] |
| Man Pride Catalog | Men's grooming product range | [R2 key] |
| Category Wise Catalog | Products organised by category | [R2 key] |

**Acceptance criteria:**
- [ ] All 4 catalogs are downloadable from the new site
- [ ] PDF links go directly to R2 URLs (not Google Drive)
- [ ] Downloads section is visible on `/products` or `/contact`

---

### P2-04 · Departmental emails already in fallback data — publish them

**Good news:** `data/contact-page-data.ts` already has all 7 departmental emails including exports:
```ts
departmentEmails: [
  { label: 'Inquiry/Info', email: 'naturesboon@yahoo.com' },
  { label: 'Accounts', email: 'accounts.naturesboon@yahoo.com' },
  { label: 'Purchase', email: 'purchase.naturesboon@yahoo.com' },
  { label: 'Sales', email: 'sales.naturesboon@yahoo.com' },
  { label: 'Artwork/Designing', email: 'artwork.naturesboon@yahoo.com' },
  { label: 'Exports', email: 'Exports@lustercosmetics.in' },
  { label: 'Sales (Exports)', email: 'Sales@chitkaraexports.com' },
]
```

The problem is the live `/contact` page in Convex may not have `publishedData` — so it's falling back to `contactPageData` which has this content — or it has published data that's missing the departmental emails.

**Fix:**
1. Go to `/admin` → `/contact` page
2. Check if `ContactSection` block has `departmentEmails` populated
3. If not, add them manually or republish from the fallback
4. Click **Publish**

**Acceptance criteria:**
- [ ] All 7 email addresses visible on the `/contact` page
- [ ] Each email is a `mailto:` link

---

### P2-05 · Add factory video back to About page

The old site had a Google Drive factory video link. It needs to come back.

**Fix:**
1. Upload the factory video to YouTube (unlisted is fine)
2. In the admin, go to `/about` page
3. Add a `VideoCarousel` block (already exists: `components/blocks/VideoCarousel.tsx`) or a simple embedded video section
4. Paste the YouTube embed URL

Alternatively, if the video is already on YouTube at the Instagram-linked channel (`@NaturesBoon-mfg`), just use that URL.

**Acceptance criteria:**
- [ ] Factory video is embedded and playable on the About page
- [ ] Video does not autoplay with sound
- [ ] Video is mobile-responsive

---

## P3 — Complete within 1 month

---

### P3-01 · Submit sitemap to Google Search Console

**Sitemap already exists:** `app/sitemap.ts` — check that it includes all live routes.

```ts
// app/sitemap.ts — verify these paths are all present:
// /, /about, /services, /products, /contact, /blogs, /privacy-policy, /terms-of-service
```

**Steps:**
1. Verify `https://new.naturesboon.net/sitemap.xml` renders all pages
2. Go to Google Search Console → Add property for `new.naturesboon.net`
3. Verify via DNS TXT record or HTML file in `/public`
4. Sitemaps → Submit → paste `https://new.naturesboon.net/sitemap.xml`
5. Request indexing for all key pages individually

**Acceptance criteria:**
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] All 8+ routes listed in sitemap
- [ ] Property verified in Google Search Console
- [ ] No `Excluded` pages in GSC Coverage report after 2 weeks

---

### P3-02 · Add alt text to all images

**Find all images missing alt text:**

```bash
# In repo root
grep -r '<img ' components/ --include="*.tsx" | grep -v 'alt=' | head -30
grep -r '<Image ' components/ --include="*.tsx" | grep -v 'alt=' | head -30
```

For each `next/image` component and `<img>` tag, ensure `alt` is descriptive:

```tsx
// BAD
<Image src={product.image} alt="" />
<img src={category.image} alt={category.title} />  // too generic

// GOOD  
<Image src={product.image} alt={`${product.name} - private label cosmetics by Nature's Boon`} />
<img src={category.image} alt={`${category.title} products manufactured by Nature's Boon Ludhiana`} />
```

**Acceptance criteria:**
- [ ] Zero `alt=""` attributes on content images (decorative images are ok with empty alt)
- [ ] All product and category images have keyword-relevant alt text
- [ ] `axe` accessibility scan shows 0 image alt text violations

---

### P3-03 · Migrate contact email from Yahoo to branded domain

This is the highest-impact single change for credibility.

**Steps:**
1. Set up Google Workspace (or any email host) for `naturesboon.net`
2. Create: `info@naturesboon.net`, `accounts@`, `purchase@`, `sales@`, `artwork@`
3. Set up forwarding from Yahoo addresses during the transition period
4. Update in three places:
   - `data/contact-page-data.ts` — update `departmentEmails` array
   - `lib/seo.ts` — update `contactPoint` in `generateBusinessJsonLd`
   - Convex admin → siteSettings → update inquiry email
5. Republish the contact page

**Acceptance criteria:**
- [ ] No Yahoo email addresses visible on the website
- [ ] `info@naturesboon.net` is the primary contact email everywhere
- [ ] Old Yahoo addresses still forward so no inquiries are lost

---

### P3-04 · Publish first 3 blog posts

**Script exists:** `scripts/ingestBlogs.mjs` — this can ingest blog content from structured files into Convex.

**Target posts with highest ROI:**

```
Post 1: "How to Start Your Own Skincare Brand in India (2026 Guide)"
Target keywords: start skincare brand india, private label cosmetics india
Word count: 1,000–1,200 words
CTA at bottom: link to /contact RFQ form

Post 2: "OEM vs Private Label Cosmetics Manufacturing: What's the Difference?"
Target keywords: OEM cosmetics india, private label vs OEM manufacturing
Word count: 800–1,000 words

Post 3: "What to Look for in a Contract Cosmetics Manufacturer"
Target keywords: contract cosmetics manufacturer india, cosmetics manufacturer Punjab
Word count: 800–1,000 words
```

Once written, use `scripts/ingestBlogs.mjs` to seed them into Convex, or add via `/admin`.

**Acceptance criteria:**
- [ ] 3 blog posts published and visible at `/blogs`
- [ ] Each post has a proper `<title>`, meta description, and OG image
- [ ] Each post links back to `/contact` at least once
- [ ] Posts indexed in Google Search Console within 2 weeks

---

## Verification checklist (run before marking any P0 done)

```bash
# Title tags — should show clean titles for each page
curl -s https://new.naturesboon.net/ | grep -o '<title>[^<]*</title>'
curl -s https://new.naturesboon.net/products | grep -o '<title>[^<]*</title>'
curl -s https://new.naturesboon.net/contact | grep -o '<title>[^<]*</title>'
curl -s https://new.naturesboon.net/about | grep -o '<title>[^<]*</title>'

# Page content size — products and contact should return substantial HTML
curl -s https://new.naturesboon.net/products | wc -c   # expect >10,000
curl -s https://new.naturesboon.net/contact | wc -c    # expect >10,000

# No broken links
curl -s https://new.naturesboon.net/blogs -o /dev/null -w "%{http_code}"        # expect 200
curl -s https://new.naturesboon.net/privacy-policy -o /dev/null -w "%{http_code}" # expect 200

# Stats — check rendered HTML for the actual numbers
curl -s https://new.naturesboon.net | grep -o '20+\|65+\|200+\|750+'

# Empty heading check
curl -s https://new.naturesboon.net | grep '<h[0-9]></h[0-9]>'  # should return nothing
```

---

## Summary

| Priority | Count | Key theme |
|---|---|---|
| P0 | 5 tasks | Bugs visible to every visitor and to Google |
| P1 | 5 tasks | Conversion and trust — money on the table |
| P2 | 5 tasks | Content parity with old site before retiring it |
| P3 | 4 tasks | SEO and long-term growth |
| **Total** | **19 tasks** | |

**Highest single-day impact if you only have one day:** Fix P0-01 (stats), P0-02 (wrong image), and P1-03 (WhatsApp FAB). These three changes are visible to every visitor and take under 2 hours combined.