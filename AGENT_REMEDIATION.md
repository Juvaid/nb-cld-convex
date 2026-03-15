# Agent Implementation Plan
**Branch:** `dev`  
**Repo:** github.com/Juvaid/nb-cld-convex  
**Date:** March 14, 2026  

Read this entire document before writing a single line of code.  
Work through tasks in order. Do not skip ahead.

---

## Context: how this app renders pages

```
Convex DB (publishedData JSON)
  └─ root.props.header  → passed to <SiteHeader>
  └─ content[]          → each block rendered by PuckRenderer
       └─ block.type    → looked up in puck/config.tsx components{}
            └─ if found  → config.render(props)
            └─ if NOT found → <div>Unknown block: {type}</div>   ← THE BUG
```

The Footer is a regular block in `content[]`. It is NOT in `root.props`.  
`PuckRenderer` destructures `footer` from `root.props` but never renders it — that variable is unused. The footer only appears if a block with `type: "Footer"` exists in the page's `content` array.

---

## TASK 1 — Register CatalogSection in Puck config
**File:** `components/puck/config.tsx`  
**Priority:** P0 — blocks the page from rendering correctly  

### What happened
A `CatalogSection` block type exists in the live Convex DB for at least one page. It has no entry in `config.tsx`, so `PuckRenderer` renders `<div className="...bg-red-50...">Unknown block: CatalogSection</div>` in production.

The block does not exist anywhere in the codebase — no component file, no config entry, no seed script. It was created directly in the Convex admin UI at some point.

### What to build
`CatalogSection` should render a product category grid — essentially what `CategoryPortfolio` already does. Map it to `CategoryPortfolio` via the `legacyMap` in `PuckRenderer.tsx`.

**Step 1 — Add to legacyMap in `components/PuckRenderer.tsx`:**

```tsx
const legacyMap: Record<string, string> = {
    Hero: "ModernHero",
    Services: "ModernServices",
    Stats: "ModernStats",
    Testimonial: "ModernTestimonials",
    SiteFooter: "Footer",
    CatalogSection: "CategoryPortfolio",   // ← ADD THIS LINE
};
```

This is the safest fix. It makes any saved `CatalogSection` block render using the existing `CategoryPortfolio` component and its registered config, with no new files needed.

**Step 2 — Verify CategoryPortfolio is registered in config:**

Confirm this line exists in `components/puck/config.tsx` (it already does — just verify):
```tsx
CategoryPortfolio: CategoryPortfolioConfig as any,
```

**Step 3 — Test:**
1. Run `npx convex dev`
2. Visit the page that was showing "Unknown block: CatalogSection"
3. It should now render the category grid
4. Open `/admin/editor?path=/[that-page]` — the block should show in the editor as "CategoryPortfolio" with its fields

### Acceptance criteria
- [ ] "Unknown block: CatalogSection" is gone from all pages
- [ ] The section renders visually as a category grid
- [ ] No TypeScript errors introduced
- [ ] The block is editable in the Puck admin editor

---

## TASK 2 — Fix missing footer on pages
**Files:** `components/PuckRenderer.tsx`, Convex admin  
**Priority:** P0 — footer is missing from live pages  

### Root cause
The `PuckRenderer` destructures `footer` from `root.props` but **never uses it**:

```tsx
// components/PuckRenderer.tsx line 22
const { header = {}, footer = {}, ...rootProps } = root.props || {};
//                    ↑ extracted but never rendered anywhere
```

The footer is a regular `content[]` block. It only appears when a block with `type: "Footer"` is in the `content` array. When pages were edited in the admin, the Footer block was dropped from the content array.

### Fix — two parts

**Part 1 — Make PuckRenderer render a footer fallback from root.props:**

This makes the footer resilient even if it gets dropped from the content array.

In `components/PuckRenderer.tsx`, after the `</main>` closing tag, add:

```tsx
// components/PuckRenderer.tsx

import { Footer } from "./puck/blocks/Footer"; // add to imports at top

// Inside the return, after </main>:
{/* Render footer from root.props if no Footer block exists in content */}
{footer && Object.keys(footer).length > 0 && 
 !content.some((b: any) => b.type === "Footer" || b.type === "SiteFooter") && (
    <Footer {...footer} />
)}
```

This means:
- If a `Footer` block exists in `content[]` → renders normally as before
- If `footer` exists in `root.props` AND no Footer block is in `content` → renders from root.props as fallback
- Both cases covered, nothing breaks

**Part 2 — Fix the published page data in Convex admin:**

1. Open `/admin/editor?path=/[affected-page]`
2. Scroll to the bottom of the page in the editor
3. If no Footer block is visible: add a Footer block from the "Footer" category in the block picker
4. Configure it to match the other pages (dark background, same links)
5. Click **Publish**

Repeat for every page missing the footer.

**Part 3 — Add Footer to initialize_pages fallback:**

Check `convex/initialize_pages.ts` — every page's content array already ends with a Footer block. This is correct. The issue is only with pages whose Convex published data was saved without a footer.

To prevent this happening again, add a guard in `PuckRenderer.tsx` that warns in the console when a page has no footer block:

```tsx
// After content.map() in PuckRenderer.tsx
{process.env.NODE_ENV === "development" && 
 !content.some((b: any) => b.type === "Footer" || b.type === "SiteFooter") && (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-3 text-center font-mono">
        ⚠ DEV ONLY: No Footer block in content array for this page. Add one in /admin.
    </div>
)}
```

### Acceptance criteria
- [ ] Footer renders on all pages including the one that was missing it
- [ ] Footer renders even if the Footer block is not in the content array (fallback from root.props)
- [ ] In dev mode, a visible warning appears on pages missing a Footer block in content
- [ ] No TypeScript errors

---

## TASK 3 — Fix stats counter showing "0+" 
**File:** `components/blocks/StatsCounter.tsx`  
**Priority:** P0  

### Root cause (confirmed by reading source)

Three compounding bugs in `components/blocks/StatsCounter.tsx`:

**Bug A — SSR renders 0:**  
`countValue` is a Framer Motion spring that starts at `0`. SSR renders this initial `0` value. There is no static fallback, so the page HTML contains "0+" for all stats.

**Bug B — useInView never fires on mobile:**  
```tsx
// Line 27 — current
const isInView = useInView(ref, { once: true, margin: "-100px" });
```
On mobile viewports (375px) this observer fires too late or not at all.

**Bug C — empty globalStats wins over props.stats:**  
In `components/puck/config.tsx` line 386:
```tsx
const finalStats = props.useGlobalStats 
  ? (globalStats || props.stats || []) 
  : props.stats;
```
`[]` is truthy in JavaScript. If Convex returns an empty array for `globalStats` and `useGlobalStats` is `true`, `[] || props.stats` evaluates to `[]` — an empty array. Stats section renders nothing.

### Fix

In `components/blocks/StatsCounter.tsx`, replace the `AnimatedCounter` function:

```tsx
function AnimatedCounter({ target, label, stat, index }: { target: string, label: string, stat: StatItem, index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    // FIX B: reduced margin
    const isInView = useInView(ref, { once: true, margin: "-5%" });

    const numericTarget = parseInt(target.replace(/[^0-9]/g, '')) || 0;
    const suffix = target.replace(/[0-9]/g, '');

    // FIX A: initialise to numericTarget so SSR always shows real number
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

    // ... rest of JSX unchanged, but replace:
    // <motion.span className="pr-1">{countValue}</motion.span>
    // with:
    // <span className="pr-1">{displayValue}</span>
```

In `components/puck/config.tsx`, fix Bug C at line 386:

```tsx
// BEFORE
const finalStats = props.useGlobalStats 
  ? (globalStats || props.stats || []) 
  : props.stats;

// AFTER — only use globalStats if it actually has items
const finalStats = (props.useGlobalStats && globalStats?.length > 0)
  ? globalStats
  : (props.stats || []);
```

**Also update the default value in the component:**  
In the `StatsCounter` default props, update `'15+'` to `'20+'`:
```tsx
stats = [
    { value: '20+', label: 'Years of Experience' },   // was 15+
    ...
```

### Acceptance criteria
- [ ] All 6 stats render correct numbers immediately on page load with JS disabled
- [ ] `curl -s https://new.naturesboon.net | grep "0+"` returns no stats-related matches
- [ ] Counter animation triggers on 375px mobile viewport
- [ ] Correct values: 20+, 65+, 200+, 75+, 20+, 750+

---

## TASK 4 — Fix page title tag bugs
**File:** `lib/generatePageMetadata.ts`  
**Priority:** P0  

### Root cause
`lib/seo.ts` sets a Next.js title template:
```ts
template: `%s | ${SITE_CONFIG.name}`,  // "%s | Nature's Boon"
```

If `page.title` in Convex is stored as `"Products | Nature's Boon"` (brand already included), Next.js wraps it again → `"Products | Nature's Boon | Nature's Boon"`.

If `page.title` is stored as `"Products | "` (trailing pipe), the template gives `"Products |  | Nature's Boon"`.

### Fix

In `lib/generatePageMetadata.ts`, add a sanitiser before returning the title:

```ts
export function generatePageMetadata(page: PageRecord, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = getAbsoluteImageUrl(page.ogImage);

  // Strip any trailing "| Nature's Boon" or "| " that may have been 
  // typed into the CMS title field — the root layout template adds it
  const cleanTitle = (page.title || "")
    .replace(/\s*\|\s*Nature[''']?s Boon\s*$/i, "")
    .replace(/\s*\|\s*$/, "")
    .trim();

  return {
    title: cleanTitle,
    description: page.description,
    keywords: page.keywords,
    robots: "index, follow",
    alternates: { canonical: url },
    openGraph: {
      title: cleanTitle,
      description: page.ogDescription ?? page.description,
      url,
      siteName: "Nature's Boon",
      images: [{ url: imageUrl, width: 1200, height: 600, alt: cleanTitle }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: page.ogDescription ?? page.description,
      images: [imageUrl],
    },
  };
}
```

**Then fix the stored titles in Convex admin:**  
Go to `/admin` → each page → check the `Page Title (SEO)` root field. It should be just the page name with no pipes or brand suffix:

| Page path | Correct title to store |
|---|---|
| `/` | `Home \| Personal Care Manufacturer` |
| `/products` | `Products` |
| `/services` | `Services` |
| `/about` | `About Us` |
| `/contact` | `Contact Us` |
| `/blogs` | `Blog` |

### Acceptance criteria
- [ ] `curl -s https://new.naturesboon.net/products | grep '<title>'` shows `Products | Nature's Boon`
- [ ] `curl -s https://new.naturesboon.net/contact | grep '<title>'` shows `Contact Us | Nature's Boon`
- [ ] No page has `||` in its title
- [ ] No page has `Nature's Boon` appearing twice in its title

---

## TASK 5 — Fix /products and /contact pages returning empty HTML
**File:** `components/CmsPageRenderer.tsx`  
**Priority:** P0  

### Root cause
If `fetchQuery(api.pages.getPublishedPage, { path })` fails or returns `null` (no `publishedData` set), `initialPage` is null. The page falls through to `fallbackData`. But if the Convex cloud connection has any issue during SSR (cold start, rate limit, network blip), the whole render returns an empty shell.

### Fix

Wrap all SSR fetches in a timeout in `components/CmsPageRenderer.tsx`:

```tsx
export async function CmsPageRenderer({ path, fallbackData, useDynamicData }: CmsPageRendererProps) {
    let initialPage = null;
    let initialSettings = null;
    let initialStats = null;
    let initialCategories = null;
    let initialProducts = null;

    const withTimeout = <T,>(promise: Promise<T>, ms = 5000): Promise<T | null> =>
        Promise.race([
            promise,
            new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
        ]);

    try {
        [initialPage, initialSettings, initialStats] = await Promise.all([
            withTimeout(fetchQuery(api.pages.getPublishedPage, { path })),
            withTimeout(fetchQuery(api.siteSettings.getSiteSettings)),
            withTimeout(fetchQuery(api.siteData.getStats)),
        ]);

        if (useDynamicData || path === "/products") {
            [initialCategories, initialProducts] = await Promise.all([
                withTimeout(fetchQuery(api.categories.list)),
                withTimeout(fetchQuery(api.products.listAll, { status: "active" })),
            ]);
        }
    } catch (e) {
        console.error(`[CmsPageRenderer] SSR fetch failed for ${path}:`, e);
    }

    // preloadQuery calls stay the same — these are for client hydration
    const preloadedPageData = await preloadQuery(api.pages.getPublishedPage, { path });
    // ... rest of existing preloadQuery calls unchanged
```

**Also: publish the pages in Convex admin.**  
The most common cause is that `publishedData` is null — the page was saved but never published. Go to `/admin/pages` → click status badge on each page → set to **published**. Then verify in the editor that the content is correct and click **Publish** from the editor.

### Acceptance criteria
- [ ] `curl -s https://new.naturesboon.net/products | wc -c` returns > 15000
- [ ] `curl -s https://new.naturesboon.net/contact | wc -c` returns > 15000
- [ ] Pages render with JS disabled (view-source in browser shows full HTML)

---

## TASK 6 — Add floating WhatsApp button site-wide
**Files:** `components/WhatsAppFAB.tsx` (new), `app/layout.tsx`  
**Priority:** P1  

### Create `components/WhatsAppFAB.tsx`

```tsx
"use client";
import Link from "next/link";

export function WhatsAppFAB() {
    return (
        <Link
            href="https://wa.me/919877659808?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20manufacturing%20services."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
        >
            <svg viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
        </Link>
    );
}
```

### Add to `app/layout.tsx`

```tsx
import { WhatsAppFAB } from "@/components/WhatsAppFAB";

// Inside RootLayout return, before closing </body>:
<Providers children={children} modal={modal} />
<WhatsAppFAB />
```

### Acceptance criteria
- [ ] Green WhatsApp button fixed bottom-right on every page
- [ ] Tapping opens WhatsApp with pre-filled message
- [ ] Does not overlap footer content on 375px viewport
- [ ] Not visible on `/admin/*` routes (exclude from admin layout or use `usePathname`)

**Note for agent:** If the button appears on admin pages, add a pathname check:
```tsx
"use client";
import { usePathname } from "next/navigation";
// ...
const pathname = usePathname();
if (pathname?.startsWith("/admin")) return null;
```

---

## TASK 7 — Fix footer Quick Links URL inconsistency
**File:** `components/SiteFooter.tsx`  
**Priority:** P1  

### Current code (broken)
```tsx
// SiteFooter.tsx — current fragile string manipulation
const href = link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-').replace('our-', '')}`;
```
For "About Us" this generates `/about-us`, which redirects to `/about` via next.config.ts. Works but adds a redirect hop.

### Fix — replace with explicit map
```tsx
// SiteFooter.tsx
const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Our Products', href: '/products' },
    { label: 'Contact', href: '/contact' },
];

// In the JSX, replace the .map((link) => { const href = ... }) pattern with:
{quickLinks.map(({ label, href }) => (
    <li key={label}>
        <Link href={href} className={...}>
            {label}
        </Link>
    </li>
))}
```

### Acceptance criteria
- [ ] Footer "About Us" links directly to `/about` (no redirect)
- [ ] All 5 footer links resolve without a redirect hop
- [ ] Header and footer use identical paths for all shared links

---

## TASK 8 — Fix empty heading above Instagram section  
**File:** Live Convex page data (admin fix) + component guard  
**Priority:** P1  

### Admin fix
1. Go to `/admin/editor?path=/` (homepage)
2. Find the Instagram/Social Feed block
3. Look for a `heading` or `title` field that is blank
4. Either fill it in with `"Follow Us on Instagram"` or leave blank and ensure the component handles it

### Code guard in InstagramCarouselBlock
Find `components/puck/blocks/InstagramCarouselBlock.tsx` and ensure any heading render is conditional:

```tsx
// Find wherever heading renders — ensure it's:
{heading?.trim() && <h2 className="...">{heading}</h2>}
// NOT:
<h2 className="...">{heading}</h2>  // renders empty <h2></h2>
```

### Acceptance criteria
- [ ] `curl -s https://new.naturesboon.net | grep '<h[0-9]></h[0-9]>'` returns nothing
- [ ] No visible gap or empty space above the Instagram feed section

---

## TASK 9 — Add empty state to /blogs page
**File:** `app/blogs/BlogsClient.tsx`  
**Priority:** P1  

Find the blogs list render in `BlogsClient.tsx`. When `blogs.length === 0`, render:

```tsx
if (!blogs || blogs.length === 0) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
            <div className="w-16 h-16 rounded-2xl bg-nb-green/10 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-nb-green" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Blog — Coming Soon</h1>
            <p className="text-slate-500 max-w-md text-base leading-relaxed">
                We're working on our first posts — insights on private label manufacturing,
                skincare formulation, and building your own brand.
            </p>
        </div>
    );
}
```

Also remove the Blogs link from `SiteHeader.tsx` nav array until at least one post is published — prevents users landing on an empty page from the nav:

```tsx
// components/SiteHeader.tsx
// Comment out until blog content exists:
// { label: "Blogs", href: "/blogs" },
```

### Acceptance criteria
- [ ] `/blogs` shows a meaningful empty state, not a blank white page
- [ ] Blogs not in nav until content exists (or empty state is in place)

---

## TASK 10 — Ensure OGPreviewCard and seo-audit.mjs are correctly wired
**Files:** `components/admin/OGPreviewCard.tsx`, `app/admin/pages/page.tsx`, `app/admin/products/page.tsx`, `scripts/seo-audit.mjs`  
**Priority:** P1 (already committed in dev branch — just verify)  

These files were added in the current commit. Verify they work:

1. Run the dev server: `npm run dev`
2. Log into `/admin/pages` — confirm the Monitor icon button appears in the Actions column of each page row
3. Click a Monitor icon — confirm the modal opens with WhatsApp/Discord preview tabs
4. Log into `/admin/products` — confirm the Monitor icon appears per product
5. Run the audit script:
   ```bash
   node scripts/seo-audit.mjs
   ```
   Expected output: colour-coded table of all pages, products, blogs with issues flagged

If the audit script fails with "NEXT_PUBLIC_CONVEX_URL not set", run as:
```bash
NEXT_PUBLIC_CONVEX_URL=$(grep NEXT_PUBLIC_CONVEX_URL .env.local | cut -d= -f2) node scripts/seo-audit.mjs
```

### Acceptance criteria
- [ ] No TypeScript/import errors in `admin/pages/page.tsx` or `admin/products/page.tsx`
- [ ] OG preview modal opens and renders WhatsApp preview correctly
- [ ] Discord tab renders correctly
- [ ] SEO health dots show correct colours (red/amber/green)
- [ ] `seo-audit.mjs` runs without crashing and outputs a table

---

## Commit convention for this branch

Use this format for all commits on `dev`:

```
fix(renderer): add CatalogSection to legacyMap
fix(renderer): render footer fallback from root.props
fix(stats): SSR-safe counter with static initialState
fix(metadata): sanitise title before Next.js template applies
fix(footer): use explicit quickLinks map instead of string manipulation
feat(whatsapp): add floating WhatsApp FAB to layout
fix(blogs): add empty state to BlogsClient
```

When all tasks are done and tested locally, open a PR from `dev` → `main`.

---

## Quick verification commands (run after each task)

```bash
# Task 1 — CatalogSection gone
curl -s http://localhost:3000/[affected-page] | grep "Unknown block"

# Task 2 — Footer present
curl -s http://localhost:3000 | grep "footer\|© 2026"

# Task 3 — Stats correct
curl -s http://localhost:3000 | grep -E "20\+|65\+|200\+"

# Task 4 — Title tags clean
curl -s http://localhost:3000/products | grep '<title>'
curl -s http://localhost:3000/contact | grep '<title>'

# Task 5 — Pages have content
curl -s http://localhost:3000/products | wc -c
curl -s http://localhost:3000/contact | wc -c

# Task 8 — No empty headings
curl -s http://localhost:3000 | grep -E '<h[0-9]></h[0-9]>'

# Full SEO audit
node scripts/seo-audit.mjs
```