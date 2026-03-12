# Platform Optimization & Remediation Plan (V2 - Audit Verified)

This plan integrates the technical audit's corrective feedback. **Phase 1 (SSR)** is now the absolute priority to prevent "Empty HTML" indexing.

---

## 🟢 Phase 1: SEO & SSR Architecture (CRITICAL - DO FIRST)
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
    - **Test**: Right-click $\to$ View Page Source. If you see your headings and text, the "Thin Content" issue is resolved.

---

## 🔵 Phase 2: Performance & Image Optimization
**Goal**: Reduce LCP and ensure Hosting CPU isn't overwhelmed by 4K image optimization.

### 2.1 Hero Carousel Sizing Fix
- **Instruction**: 
    - Set `sizes="(max-width: 1920px) 100vw, 1920px"`.
    - **Source Verification**: Check the actual source file (e.g., `unbrandercucumber.png`). If it's over 2MB, compress it locally *before* uploading to Convex/R2. Even with WebP conversion, huge source files slow down the server's optimization task.

---

## 🟡 Phase 3: Advanced Metadata & Schema
**Goal**: Dynamic indexing per page and professional social sharing.

### 3.1 Per-Page Dynamic Metadata
- **Reasoning**: Metadata in `layout.tsx` is static. Every product and blog needs unique titles.
- **Instruction**:
    - Implement `generateMetadata` in `app/page.tsx`, `app/products/[slug]/page.tsx`, etc.
    - Fetch the page/product data from Convex *manually* inside the function to return a unique `title` and `openGraph` object.

---

## 🟣 Phase 4: SEO Content Parity (WordPress $\to$ Next.js)
**Goal**: Don't lose your WordPress rankings.

### 4.1 Keyword Preservation Checklist
- **Instruction**: Ensure the following exists in the SSR HTML:
    - **Founder/Date**: "Founded 2006", "Archana Dhingra".
    - **Client Roster**: "Luster Cosmetics, The Man Company, Glamveda" (In text, not images).
    - **H1 Integrity**: Exactly one `<h1>` per page. Use `Typography` variant="h1".

---

## 🔴 Phase 5: Infrastructure & Launch Mastery
**Goal**: Zero-downtime, safe transition.

### 5.1 The 301 Redirect Map (MISSING IN V1)
- **Reasoning**: Google needs to know your old URLs move to new ones (e.g., `/skin-care/` $\to$ `/products/skincare`).
- **Instruction**:
    - Define a `redirects()` array in `next.config.ts`.
    - Map every high-traffic WordPress URL to its new Next.js equivalent with `permanent: true`.

### 5.2 Launch Sequence (TIMING IS KEY)
- **ORDER**:
    1. **Fix SSR** & Verify source.
    2. **Fix Images** and Metadata.
    3. **Verify** sitemap.xml & robots.txt.
    4. **THEN Connect Domain** in Hostinger.
    5. **Submit Sitemap** to Search Console.

---

## 🏁 Final Pre-Launch Verification
- [ ] **View Source**: Text is visible?
- [ ] **Redirects**: Old links point to new pages?
- [ ] **Dynamic Meta**: Title changes when clicking between pages?
- [ ] **Image Weight**: Hero under 500KB?
