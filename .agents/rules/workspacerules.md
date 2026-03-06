---
trigger: always_on
---

Rule 1: Ban .filter() on large datasets. Never use .filter() if you can avoid it. It fetches documents first and filters them in memory. Instead, always define indexes in your schema.ts and use .withIndex() or .withSearchIndex(). This shifts the heavy computation to the database layer where it belongs.

Rule 2: Enforce strict validation. Always define explicit args and returns in your Convex functions using the v validator (e.g., v.string(), v.id("table_name")). This guarantees end-to-end type safety and acts as a strict security gateway against malformed data.

Rule 3: Design idempotent mutations. Convex uses Optimistic Concurrency Control (OCC). If there is a data conflict, Convex will automatically re-run the mutation. Design your logic so that running a mutation twice safely yields the same result (e.g., check if an item is already deleted before trying to delete it).

Rule 4: Zero floating promises. You must await all database operations (like await ctx.db.patch()). If you fire and forget a promise inside a Convex function, the function may terminate before the operation finishes, causing silent, hard-to-track bugs.

2. Next.js Optimization (The Frontend Delivery)
Next.js handles how your users actually receive the app. The primary goal here is minimizing the JavaScript bundle size.

Rule 5: Push 'use client' to the leaves. By default, keep everything as React Server Components (RSC) to send zero JavaScript to the browser. Only add 'use client' at the absolute lowest level of your component tree—specifically where you need Convex's useQuery hooks, browser APIs, or React state (useState).

Rule 6: Use strategic dynamic imports. If Antigravity uses heavy UI elements that aren't visible on the first paint (like complex charts, deep modals, or heavy third-party libraries), wrap them in next/dynamic. This cuts your initial page load time significantly.

Rule 7: Lock down Core Web Vitals. Always use the next/image component with explicit width and height properties to prevent Cumulative Layout Shift (CLS)—a major killer of perceived performance. Use next/font to load fonts locally and prevent render-blocking text flashes.

3. The Next.js + Convex Bridge
This is where apps either feel disjointed or like pure magic.

Rule 8: Preload for instant UI. Convex relies on WebSockets for real-time client updates, which usually means users see a split-second loading spinner on their first visit. To fix this, use Next.js Server Components to fetch the initial data (preloadQuery), and pass it to a Client Component. You get an instant initial page load, and Convex seamlessly attaches to the data for real-time reactivity.

Rule 9: Double-verify authentication. Handle your route-level protection in Next.js middleware.ts so unauthenticated users never even download protected pages. However, never trust the client. Always independently verify the user inside every single Convex mutation and query using ctx.auth.getUserIdentity().