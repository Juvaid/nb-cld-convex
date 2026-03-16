## Nature's Boon CMS / Blogs — ASAP Playbook

This file is the **single source of truth** for what to do next to get `new.naturesboon.net` production‑ready, especially for blogs and Puck.

---

### 1. Fixing Blog Readability (Today)

**Goal:** No JSON blobs / FAQ schema junk in the visible article body, and clean typography.

1. **Renderer already updated**  
   - `app/blogs/[slug]/BlogPostClient.tsx`  
     - Detects Puck JSON vs legacy HTML vs markdown.  
     - Cleans HTML and strips most schema/FAQ JSON fragments.  
     - Uses `PuckRenderer` for Puck posts, otherwise uses HTML/markdown.
2. **Rich text editor upgraded**  
   - `components/puck/RichText.tsx`  
     - Inline editor with bold/italic/underline, bullets, numbered lists, headings (H2–H4), quotes, divider, links (add/remove), clear formatting.  
     - Sanitizes pasted HTML (removes `<script>`, `<style>`, inline events, obvious schema JSON).
3. **Immediate manual cleanup for key posts**  
   - For top SEO blogs (start with 3–5):  
     - Go to `/admin/blogs`.  
     - Edit the post, convert body into 2–4 `TextBlock`s (use headings + spacing).  
     - Remove any leftover raw schema text in the editor.  
     - Use `InlineImage` blocks for key visuals.  
     - Publish.

---

### 2. Puck Block Design for Blogs (Structure First)

**Goal:** Blogs are structured as sections + FAQs, not one giant blob.

1. **Ensure `TextBlock` + `InlineImage` are registered for blogs**
   - `components/puck/blog-config.tsx`  
     - Components: `TextBlock`, `InlineImage`, `Spacer`.  
     - Category `"Blog Content"` exposes them in the Puck sidebar.

2. **Add `FAQBlock` (structured FAQs)**
   - Create `components/puck/blocks/FAQBlock.tsx` with:
     - Fields:
       - `title: string`
       - `intro: string`
       - `items[]` with `question: string`, `answer: string`
     - Render:
       - Wrap in `Section`.  
       - Show title/intro.  
       - List of `<details><summary>Q</summary><div>A</div></details>` for accordions.
   - Register in `components/puck/config.tsx` AND `components/puck/blog-config.tsx`:
     - `categories.Blog.components` include `"FAQ"`.  
     - `components.FAQ = FAQBlockConfig`.

3. **Optional later blocks**
   - `ReviewListBlock` — structured list of Trustindex / review excerpts.  
   - `HighlightBlock` — short “Key Takeaways” at the end of a blog.

---

### 3. Migration Strategy — Legacy Blogs → Puck JSON

**Goal:** Automatically convert scraped WordPress/SEO content into structured Puck layouts where possible.

**High‑level steps:**

1. **Write a migration script** (Node or Convex function)
   - Input: all docs from `blogs` table.  
   - Skip any blog where `content.trim().startsWith("{")` (already Puck JSON).  
   - For others:
     - Treat `blog.content` as HTML / text.

2. **Extract FAQ schema from content**
   - Look for trailing JSON starting with `{"@context":"https://schema.org","@type":"FAQPage",...}`.  
   - Regex idea:
     - `/\{\s*"@context"\s*:\s*"https?:\\\/\\\/schema\.org"[\s\S]*?"@type"\s*:\s*"FAQPage"[\s\S]*?\}\s*$/i`
   - Parse JSON (fix escaping `\\\/` → `/`).  
   - Build `FAQBlockProps.items`:
     - `items = faq.mainEntity.map(q => ({ question: q.name, answer: q.acceptedAnswer?.text }))`
   - Remove that JSON chunk from the body string.

3. **Clean remaining HTML for `TextBlock`**
   - Reuse a “HTML cleaner” similar to `cleanHtmlContent` in `BlogPostClient`:  
     - Remove `<script>` / `<style>` + inline events.  
     - Normalize entities (`&nbsp;`, non‑breaking spaces).  
     - **Do NOT strip structural tags** (`<p>, <h2>, <ul>, <ol>, <li>, <strong>, <em>, <a>`).

4. **Build Puck JSON layout per blog**
   - Minimal safe default:
     ```ts
     const puckData = {
       content: [
         {
           type: "TextBlock",
           props: {
             id: "body",
             content: cleanedHtml,
             alignment: "left",
             maxWidth: "md",
           },
         },
         faqItems.length
           ? {
               type: "FAQ",
               props: {
                 id: "faq",
                 title: "Frequently Asked Questions",
                 items: faqItems,
               },
             }
           : null,
       ].filter(Boolean),
       root: { props: {} },
     };
     ```
   - Save as `JSON.stringify(puckData)` back to `blogs.content` via `api.blogs.updateBlog`.

5. **Dry‑run on 1–2 posts, then apply to all**
   - Pick a blog with visible FAQ JSON junk (e.g. derma manufacturers article).  
   - Run script only for that `_id`, verify:  
     - Body is readable.  
     - FAQ renders as accordions.  
   - Then run for all remaining legacy blogs.

---

### 4. BlogPage Rendering Rules (How It Should Behave)

**File:** `app/blogs/[slug]/BlogPostClient.tsx`

- If `content` parses as Puck JSON:
  - Use `PuckRenderer` with `blogConfig`.  
  - Pass `hideHeader` so only the outer page header shows.  
  - `PuckRenderer` should receive `siteSettings` and (optionally) `initialData` for things like product blocks.
- Else (legacy content):
  - Detect HTML vs markdown.  
  - For HTML: sanitize and render with `dangerouslySetInnerHTML` in a styled container.  
  - For plain text / markdown: run through `ReactMarkdown` with custom components.

---

### 5. Priority Checklist (When You Come Back)

1. **Confirm editor UX**
   - In `/admin/blogs`, create a new test blog.  
   - Use `TextBlock` + `InlineImage` + (when added) `FAQ`.  
   - Confirm inline editing, headings, lists, links work as expected.

2. **Implement `FAQBlock` + register it**
   - Add file, wire into `config.tsx` and `blog-config.tsx`.  

3. **Manually rebuild 3–5 key SEO posts in Puck**
   - Use them as gold standards for migration shape.

4. **Write and test a migration script**
   - Parse, extract FAQs, generate Puck JSON, update `blogs`.  
   - Test on 1–2 posts before bulk run.

5. **Later enhancement**
   - Add optional `ReviewListBlock` if you want structured handling of long Trustindex review sections instead of raw paragraphs.

Keep this file updated as you iterate – it should always describe “what the next engineer should do next week if they pick this up cold.”

