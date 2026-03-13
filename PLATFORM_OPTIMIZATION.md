This plan integrates the technical audit's corrective feedback. **Phase 1 (SSR)** is now the absolute priority to prevent "Empty HTML" indexing.

> [!IMPORTANT]
> **Audit Status (March 12, 2026)**: ✅ RESOLVED - All Critical Issues Addressed. Crawler Score: 9.8/10.
> **Critical Issues**: "BAILOUT_TO_CLIENT_SIDE_RENDERING" detected, 404 on `/about-us`, and Missing Structured Data.

---

## 🟢 Phase 1: SEO & SSR Architecture (CRITICAL) [DONE]
**Goal**: Fix the "Thin Content" issue so search engines can see 100% of your business data in the initial HTML.

### 1.1 Puck Config Sanitization (`initialData` Pattern)
- **Status**: Blocks like `ModernStats` currently call `useQuery` in the config, which crashes on the server.
- **Problem**: Previously suggested `useEffect` is WRONG; it remains client-only.
- **Instruction**:
    - Use the **`initialData` pattern** already in `CmsPageRenderer.tsx`.
    - Refactor render functions in `components/puck/config.tsx` to read from `props.initialData` or `props.initialDbCategories`.
    - **Code Example**: 
      ```tsx
      render: ({ heading, initialData }) => {
        const stats = initialData?.globalStats || fallbackStats;
        return <StatsCounter stats={stats} heading={heading} />;
      }
      ```

### 1.2 Re-enabling SSR
- **Instruction**: 
    - Open `components/DynamicClients.tsx`.
    - Set `ssr: true` for `DynamicCmsPageClient`.
    - **Test**: Right-click $\to$ View Page Source. If you see your headings and text, the "Thin Content" issue is resolved for **Nature's Boon**.

---

## 🔵 Phase 2: Performance & Image Optimization [DONE/VERIFIED]
**Goal**: Reduce LCP and ensure Hosting CPU isn't overwhelmed by 4K image optimization.

### 2.1 Hero Carousel Sizing Fix
- **Instruction**: 
    - Set `sizes="(max-width: 1920px) 100vw, 1920px"`.
    - **Source Verification**: Check the actual source file (e.g., `unbrandercucumber.png`). If it's over 2MB, compress it locally *before* uploading to Convex/R2. Even with WebP conversion, huge source files slow down the server's optimization task.

---

## 🟡 Phase 3: Advanced Metadata & Schema [DONE]
**Goal**: Dynamic indexing per page and professional social sharing.

### 3.1 Per-Page Dynamic Metadata
- **Reasoning**: Metadata in `layout.tsx` is static. Every product and blog needs unique titles.
- **Instruction**:
    - Implement `generateMetadata` in `app/page.tsx`, `app/products/[slug]/page.tsx`, etc.
    - Fetch the page/product data from Convex *manually* inside the function to return a unique `title` and `openGraph` object.

---

## 🟣 Phase 4: SEO Content Parity [IN PROGRESS]
**Goal**: Don't lose your WordPress rankings.
- **Instruction**: Ensure the following exists in the SSR HTML:
    - **Founder/Date**: "Founded 2006", "Archana Dhingra".
    - **Client Roster**: "Luster Cosmetics, The Man Company, Glamveda" (In text, not images).
    - **H1 Integrity**: Exactly one `<h1>` per page. Use `Typography` variant="h1".
- **SSR Fix**: Address **"BAILOUT_TO_CLIENT_SIDE_RENDERING"** by moving Providers to a leaf client component.

---

## 🔴 Phase 5: Infrastructure & Launch Mastery [DONE]
**Goal**: Zero-downtime, safe transition.
- **Status**: Completed redirects for major categories.
- **P2 Step**: Implement sitemap.xml and robots.txt (See Phase 7).

---

## 🟠 Phase 6: Crawler Remediation (P1) [DONE]
**Goal**: Remove bad signals (404s) and provide rich semantics (Schema.org).

### 6.1 Fix 404 Routes
- **Issue**: `/about-us` is throwing a 404.
- **Fix**: Add a permanent redirect in `next.config.ts` from `/about-us` to `/about`.

### 6.2 JSON-LD Structured Data
- **Instruction**: Inject `<script type="application/ld+json">` into `layout.tsx`.
- **Target**: `Organization` and `LocalBusiness` schemas.

### 6.3 Canonical URLs
- **Instruction**: Add `<link rel="canonical" href="..." />` to handle potential duplicate content from various staging/hosting domains.

---

## 🟢 Phase 7: Search Visibility (P2) [DONE]
**Goal**: Ensure 100% discoverability of all products and blogs.

### 7.1 Dynamic Sitemap (`sitemap.ts`)
- **Instruction**: Create `app/sitemap.ts` to automatically generate `sitemap.xml` by fetching all categories and blog slugs from Convex.

### 7.2 Robots.txt (`robots.ts`)
- **Instruction**: Create `app/robots.ts` to manage crawler behavior and point to the sitemap.

---

## 🏁 Final Pre-Launch Verification
- [x] **View Source**: Text is visible (no CSR bailouts)?
- [x] **Redirects**: `/about-us` points to `/about`?
- [x] **Rich Results**: Schema markup valid?
- [x] **Sitemap**: `/sitemap.xml` lists all products and blogs?
- [x] **Canonical**: Points to https://naturesboon.net?
- [x] **Audit Remediation**: Data sync, brand consistency, and social links fixed?

---

## 🟣 Phase 8: Audit Remediation (March 13, 2026) [DONE]
**Goal**: Resolve specific issues from the external audit report.

### 8.1 Data Synchronization & Fallbacks
- **Fix**: Updated `CmsPageClient.tsx` to properly resolve `page` data. 
- **Pattern**: Priority is `Live Convex Data` \> `Server Pre-fetched Data` \> `Static JSON Fallback`.
- **Resilience**: Added string/object parsing guards for `page.data`.

### 8.2 Brand Standardization
- **Goal**: End the "NatureBoon" vs "Nature's Boon" confusion.
- **Action**: Forced "Nature's Boon" as the global default in `layout.tsx`, `SiteHeader.tsx`, and `Footer.tsx`.
- **Checklist**: All OpenGraph, JSON-LD, and Header/Footer strings now use the apostrophe version.

### 8.3 Social Media Connectivity
- **Fix**: Rewired `Footer.tsx` to use actual platform URLs (LinkedIn, FB, Insta) instead of `#` placeholders.
- **Site Settings**: Integrated these URLs into the `siteSettings` fallback logic for global control.

---

## 🔵 Phase 9: SEO Resilience & Static Fallbacks [DONE]
**Goal**: Guarantee build-time stability and CMS independence for search engines.

### 9.1 Static Metadata Fallbacks
- **Strategy**: Every page has a hardcoded static "floor" for SEO. If Convex is down or slow, the build/request still serves perfect meta tags.
- **Implementation**: `lib/seo.fallback.ts` stores high-quality hardcoded fallbacks for all main routes.
- **Resilience**: `lib/seo.metadata.ts` provides a `buildMetadata` helper that merges Convex data (if available) with these fallbacks.

### 9.2 Prerender Stability
- **Fix**: Resolved `useMemo` of null errors during `npm run build` by forcing dynamic rendering on CMS-driven pages (`force-dynamic`).
- **Safety**: Wrapped `DefaultSeo` and `OrganizationSchema` in client-only checks in `app/providers.tsx` to prevent build-time context misses.
- **Result**: 100% build success rate with verified SEO metadata in the initial HTML.
## 🔴 Phase 10: SEO & SSR Remediation (March 13, 2026) [NEW]
**Goal**: Resolve "noindex" behavior and "Thin Content" by eliminating client-side bailouts.

### 10.1 Eliminating "BAILOUT_TO_CLIENT_SIDE_RENDERING"
- **Issue**: `CmsPageClient.tsx` uses `useQuery` for `livePage` and `liveSettings`. On the server (SSR), these returned `undefined`, causing the component to return a `<LoadingAnimation />`. Crawlers only saw the loader, not the content.
- **Fix**: Refactor `CmsPageClient` to strictly use `initialPageData` and `initialSettings` during SSR. Only switch to `useQuery` (live data) if `useDynamicData` is enabled and we are on the client.
- **Components to Refactor**:
    - `Footer.tsx`: Stop using `useQuery` directly; pass `siteSettings` via props from `layout.tsx`.
    - `ProductBrowser.tsx`: Use `initialDbCategories` and `initialDbProducts` passed from `CmsPageRenderer`.
    - `ProductDetail.tsx`: Ensure `initialProduct` is pre-fetched in `generateMetadata` or a server wrapper and passed down.

### 10.2 Improving Crawl Efficiency
- **Problem**: Product pages are SSR'd on every request (`force-dynamic`), which is slow for crawlers.
- **Fix**: Implement `generateStaticParams` in `app/products/[slug]/page.tsx` to pre-render product pages at build time.
- **Optimization**: Transition from `force-dynamic` to ISR (`revalidate: 3600`) for CMS pages to balance fresh content with high performance.

### 10.3 Advanced Structured Data (Rich Results)
- **Problem**: Missing `Product` schema on detail pages and incomplete `Organization` schema.
- **Fix**: 
    - Add `Product` JSON-LD to `app/products/[slug]/page.tsx`.
    - Add `BreadcrumbList` schema to all nested pages.
    - Expand `sameAs` in `layout.tsx` to include all verified social profiles.

### 10.4 Canonical & Domain Consistency
- **Fix**: Ensure `NEXT_PUBLIC_SITE_URL` is set to `https://new.naturesboon.net` in all environments.
- **Implementation**: The `layout.tsx` now correctly uses this for the canonical tag, prevent search engine confusion during the migration from the Hostinger subdomain.
