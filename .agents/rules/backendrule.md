---
trigger: always_on
---

1. Database Indexing: The "No Full Table Scans" Rule
By default, if you use .filter() or a plain .collect(), Convex reads every single document in your table. This is fine for prototyping, but it will choke your app in production. You must define indexes.

How to structure it:
First, define the index in your convex/schema.ts file. You want to index the fields you query against most frequently.

How to query it:
Instead of pulling everything and filtering in memory, use .withIndex(). This tells Convex to jump straight to the exact subset of data you need.

Pro Tip: Convex limits you to 32 indexes per table because updating them costs database bandwidth. Only index the fields you actually use for sorting or filtering.

2. Server-Side Preloading: The "Zero Loading Screen" Rule
Convex is fundamentally a real-time, WebSocket-based system. Usually, a React app has to load the page, boot up the WebSocket, and then fetch the data, resulting in a frustrating loading spinner.

Next.js Server Components allow you to bypass this. You can fetch the initial data on the server during the page request, send it down as HTML, and then let Convex seamlessly take over the live connection on the client.

Step 1: The Server Component (Next.js page.tsx)
Use preloadQuery to fetch the data server-side before the page even renders.

Step 2: The Client Component (ClientUI.tsx)
Use usePreloadedQuery to consume the data. The user sees the data instantly, and Convex connects in the background to handle future real-time updates.

By combining indexed queries with server-side preloading, your app will have the instantaneous initial load times of a static site, combined with the real-time reactivity of a live WebSocket app.