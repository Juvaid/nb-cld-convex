# Agent Task: Semantic HTML & Organised Page Structure
**Branch:** `dev`  
**Files touched:** `components/PuckRenderer.tsx` + 10 block components  
**Prerequisite:** Complete TASK 1 and TASK 2 from `agent_implementation_plan.md` first  

---

## The problem, precisely

The rendered HTML for every page currently looks like this:

```html
<div class="flex flex-col min-h-screen ...">       ← page root (div, not body-level)
  <header>...</header>
  <main class="flex-grow">

    <div class="puck-block">                        ← anonymous wrapper, no id, no role
      <section class="relative min-h-0 ...">       ← Hero block
        <div class="absolute ...">blur blob</div>
        <div class="relative z-10 ...">content</div>
      </section>
    </div>

    <div class="puck-block">                        ← anonymous wrapper again
      <div class="py-20 bg-white ...">             ← StatsCounter (div, not section)
        ...
      </div>
    </div>

    <div class="puck-block">                        ← anonymous wrapper again
      <section class="pt-0 pb-12 ...">             ← ServicesGrid
        ...
      </section>
    </div>

  </main>
</div>
```

**Three specific problems:**

**Problem 1 — Double wrapping.**  
Every block is wrapped in `<div class="puck-block">` then renders its own outer `<section>` or `<div>`. This creates `div > section` nesting for every block. The `puck-block` div adds zero meaning, zero attributes, and makes the DOM tree unnecessarily deep.

**Problem 2 — `id` props are ghost attributes.**  
Each block has an `id` prop in Convex data (e.g. `"ModernHero-home"`, `"Footer-home"`). This is used only as the React `key`. It never becomes an HTML `id` attribute on any element. Deep-linking to sections (`/products#skin-care`) silently does nothing because there is no matching DOM element with that id.

**Problem 3 — Wrong semantic elements.**  
These blocks use `<div>` for section-level content when they should use `<section>`:
- `StatsCounter` → `<div class="py-20 bg-white">`
- `LogoMarquee` → `<div class="bg-white overflow-hidden">`
- `ProductBrowser` → `<div class="py-20 max-w-7xl">`
- `DocumentList` → `<div class="space-y-4">`
- `Footer.tsx` → no outer element at all (starts directly with a background blob div)

---

## TASK A — Fix PuckRenderer: remove double-wrap, add id, add data attribute

**File:** `components/PuckRenderer.tsx`

### Current code (broken)
```tsx
return (
    <ErrorBoundary key={safeProps.id || `${block.type}-${index}`}>
        <div className="puck-block">
            <Render {...safeProps} puck={{ renderDropZone: () => null }} initialData={initialData} />
        </div>
    </ErrorBoundary>
);
```

### Fixed code
```tsx
return (
    <ErrorBoundary key={safeProps.id || `${block.type}-${index}`}>
        <Render
            {...safeProps}
            puck={{ renderDropZone: () => null }}
            initialData={initialData}
        />
    </ErrorBoundary>
);
```

That's it. Remove the `<div className="puck-block">` wrapper entirely.

Each block's own outer element becomes the direct child of `<main>`. The DOM is now:

```html
<main class="flex-grow">
  <section id="ModernHero-home" ...>...</section>
  <section id="ModernStats-home" ...>...</section>
  <section id="ModernServices-home" ...>...</section>
  ...
</main>
```

Clean, flat, readable.

**Why this is safe:** The `puck-block` class has no styles applied to it anywhere in the codebase (confirmed: zero CSS rules or Tailwind utilities reference it). Removing the wrapper div changes nothing visually.

---

## TASK B — Fix PuckRenderer: wire the `id` prop to the DOM

The `id` in `safeProps` (e.g. `"ModernHero-home"`) is currently only used as the React key. It needs to reach the actual DOM element so that:
- Hash links like `/products#skin-care` work
- Google's anchor-based search snippets work  
- The admin editor can target sections for scroll-to

Each block already accepts the `id` prop. The issue is that some blocks pass it to their outer element and some don't. Audit each block file in `components/blocks/` and `components/sections/`:

**For each block that does NOT pass `id` to its outer element, add it:**

```tsx
// Example: StatsCounter.tsx — current outer element
<div className="py-20 bg-white relative overflow-hidden">

// Fixed — pass id to outer element
<div id={id} className="py-20 bg-white relative overflow-hidden">
```

**Full list of blocks to audit for missing `id` on outer element:**

Check each of these files. Add `id={id}` to the outermost element if it is not already there:

| File | Current outer element | Has id? |
|---|---|---|
| `components/blocks/StatsCounter.tsx` | `<div>` | No — add it |
| `components/blocks/LogoMarquee.tsx` | `<div>` | No — add it |
| `components/blocks/ProductBrowser.tsx` | `<div>` | No — add it |
| `components/blocks/VideoCarousel.tsx` | `<section>` | Check |
| `components/blocks/WhyChooseUs.tsx` | `<section>` | Check |
| `components/blocks/Hero.tsx` | `<section id={id}>` | ✓ Already has it |
| `components/blocks/ServicesGrid.tsx` | `<section id={id}>` | Check |
| `components/blocks/ProcessSteps.tsx` | `<section id={id}>` | ✓ Already has it |
| `components/sections/CategoryPortfolio.tsx` | `<Section>` | Check if id passes through |
| `components/blocks/ContactSection.tsx` | `<section>` | Check |
| `components/blocks/CallToAction.tsx` | `<section>` | Check |

For blocks wrapped in the `<Section>` component (from `components/ui/Section.tsx`):  
`Section` already accepts an `id` prop and passes it to the `<section>` HTML element. Make sure the block passes `id={id}` to `<Section id={id}>`.

---

## TASK C — Fix wrong semantic elements on 4 blocks

### C1 · `components/blocks/StatsCounter.tsx`

```tsx
// BEFORE
<div id={id} className="py-20 bg-white relative overflow-hidden">

// AFTER
<section id={id} aria-label="Company milestones" className="py-20 bg-white relative overflow-hidden">
```

Close tag changes from `</div>` to `</section>`.

### C2 · `components/blocks/LogoMarquee.tsx`

```tsx
// BEFORE
<div className="bg-white overflow-hidden">

// AFTER
<section id={id} aria-label="Our clients" className="bg-white overflow-hidden">
```

Add `id?: string` to the component's props interface if not already present.

### C3 · `components/blocks/ProductBrowser.tsx`

```tsx
// BEFORE — outer is an anonymous div
<div className="py-20 max-w-7xl mx-auto px-4 w-full">

// This block likely has a wrapper. Find the true outermost element.
// It probably looks something like:
<div className="py-20 bg-white ...">
  <div className="max-w-7xl mx-auto px-4">
    ...

// AFTER — make outer a section
<section id={id} aria-label="Product catalog" className="py-20 bg-white ...">
  <div className="max-w-7xl mx-auto px-4">
    ...
```

### C4 · `components/blocks/Footer.tsx`

The Footer currently has no outer semantic element — it starts with decorative blob divs. Wrap the whole thing in `<footer>`:

```tsx
// BEFORE — starts with blob divs directly
return (
    <>
        <div className="absolute top-0 right-0 ... blur ..." />
        ...
    </>
);

// AFTER
return (
    <footer id={id} role="contentinfo" className="relative ...">
        <div className="absolute top-0 right-0 ... blur ..." />
        ...
    </footer>
);
```

This also fixes the case where the Footer block is in `content[]` — it will now have `role="contentinfo"` which screen readers use to identify the page footer.

---

## TASK D — Add `data-block` attribute for debugging

In `PuckRenderer.tsx`, after removing the `puck-block` div wrapper (Task A), pass a `data-block` attribute so developers can identify sections in DevTools without guessing.

The cleanest way is to add it in the `Render` call. However since `data-*` attributes on React components only work if the component passes them to an HTML element, the better approach is to wrap in a React Fragment with a comment — but actually the simplest approach that works for all blocks is to keep a thin wrapper, but make it a `<section>` not a `<div>`, and only if the block doesn't already have its own outer `<section>`:

**Actually — the cleanest solution** is to not add a wrapper at all (Task A), and instead add `data-block={type}` directly to the block's outer element. Do this in the same pass as Task B and C. For each block where you're already touching the outer element:

```tsx
// StatsCounter.tsx
<section
    id={id}
    data-block="StatsCounter"
    aria-label="Company milestones"
    className="py-20 bg-white relative overflow-hidden"
>
```

This gives you perfect DevTools visibility:

```html
<main>
  <section id="ModernHero-home" data-block="ModernHero" ...>
  <section id="ModernStats-home" data-block="StatsCounter" aria-label="Company milestones" ...>
  <section id="ModernServices-home" data-block="ServicesGrid" ...>
  <section id="CallToAction-home" data-block="CallToAction" ...>
  <footer id="Footer-home" data-block="Footer" ...>
</main>
```

---

## TASK E — Fix `globals.css` to remove any `puck-block` styles

Search `app/globals.css` for any `.puck-block` styles. If any exist, remove them (since the wrapper is being removed).

```bash
grep -n "puck-block" app/globals.css
```

If the result is empty — nothing to do.

---

## TASK F — Add `aria-label` to `<main>` in PuckRenderer

While in `PuckRenderer.tsx`, add a label to `<main>` so screen readers announce it:

```tsx
// BEFORE
<main className="flex-grow">

// AFTER
<main className="flex-grow" id="main-content" aria-label="Page content">
```

This also enables skip-to-content links which are useful for accessibility.

---

## What the final HTML structure looks like after all tasks

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Products | Nature's Boon</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="..." />
  <!-- clean, no duplicates -->
</head>
<body>

  <div class="flex flex-col min-h-screen font-sans">

    <header>
      <nav aria-label="Main navigation">...</nav>
    </header>

    <main id="main-content" class="flex-grow" aria-label="Page content">

      <section id="ModernHero-home" data-block="ModernHero" class="relative min-h-0 lg:min-h-[60vh] ...">
        <!-- Hero content -->
      </section>

      <section id="ModernStats-home" data-block="StatsCounter" aria-label="Company milestones" class="py-20 bg-white ...">
        <!-- Stats content -->
      </section>

      <section id="ModernServices-home" data-block="ServicesGrid" class="pt-0 pb-12 ...">
        <!-- Services content -->
      </section>

      <section id="CallToAction-home" data-block="CallToAction" class="py-6 md:py-10 ...">
        <!-- CTA content -->
      </section>

    </main>

    <footer id="Footer-home" data-block="Footer" role="contentinfo" class="bg-slate-900 ...">
      <!-- Footer content -->
    </footer>

  </div>

</body>
</html>
```

Compare to before:
```html
<div>
  <header>...</header>
  <main>
    <div class="puck-block">          ← gone
      <section>Hero</section>
    </div>
    <div class="puck-block">          ← gone
      <div>Stats</div>                ← now <section>
    </div>
    <div class="puck-block">          ← gone
      <section>Services</section>
    </div>
  </main>
</div>
```

---

## Verification

After completing all tasks, run these checks:

```bash
# 1. No puck-block divs in rendered HTML
curl -s http://localhost:3000 | grep "puck-block"
# Expected: no output

# 2. Main has id
curl -s http://localhost:3000 | grep 'id="main-content"'
# Expected: <main id="main-content" ...>

# 3. Sections have ids
curl -s http://localhost:3000 | grep -o 'id="[^"]*"' | head -20
# Expected: id="ModernHero-home", id="ModernStats-home" etc

# 4. Footer is a <footer> element
curl -s http://localhost:3000 | grep '<footer'
# Expected: <footer id="Footer-home" ...>

# 5. No section-level content in plain <div> (spot check)
curl -s http://localhost:3000 | grep 'data-block="StatsCounter"'
# Expected: <section ... data-block="StatsCounter" ...>

# 6. Deep link works
# Open browser: http://localhost:3000/products#skin-care
# Expected: page scrolls to the skin care section

# 7. No TypeScript errors
npm run build
# Expected: zero errors
```

---

## Commit message

```
refactor(renderer): remove puck-block wrapper, add semantic HTML

- Remove anonymous <div class="puck-block"> wrapper from PuckRenderer
- Wire id props to DOM elements for deep-link anchors
- Convert StatsCounter, LogoMarquee, ProductBrowser to <section>
- Wrap Footer component in <footer role="contentinfo">
- Add data-block attribute to all blocks for DevTools visibility
- Add id="main-content" to <main> element
```