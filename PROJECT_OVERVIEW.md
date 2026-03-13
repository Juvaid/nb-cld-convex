# Project Overview: NB CONVEX (b2b-platform)

This document provides a comprehensive overview of the NB CONVEX project, a B2B platform built locally for Juvaid. It is designed to be used by reasoning/thinking models to understand the project's architecture, data model, and development workflows.

## 1. Core Mission & Functionality
The project is a specialized B2B platform (likely for nature/herbal products based on "Nature Boon" references in components) that enables dynamic content management, product cataloguing, and customer inquiry handling.

- **Dynamic CMS**: Uses the Puck Editor to build and manage site pages.
- **Product Catalog**: Manages categories and products with SEO-optimized pages.
- **Lead Generation**: Captures customer inquiries linked to specific products.
- **Blog System**: Full blogging capabilities with dynamic layout support.
- **SEO Ready**: Automated metadata generation and sitemap support.

- [MODIFY] Spacing Optimization: Fine-tune gaps between sections for a more professional "high-end" aesthetic.
- [MODIFY] Feature Cards: Redesign the "Purity" and "Standard" cards with a softer background, thinner border, and potentially a micro-icon.
- [MODIFY] In Stock Indicator: Use a more modern dot design with a subtle pulse or glow effect.
- [MODIFY] Spacing: Implement a more systematic vertical rhythm using `space-y-x` or consistent `mb-x` values.

## 2. Technical Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Backend/Database**: [Convex](https://www.convex.dev/) (Real-time database, serverless functions, storage, and authentication)
- **Editor**: [@puckeditor/core](https://www.puckeditor.com/) (Visual CMS)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: [Convex Auth](https://labs.convex.dev/auth)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 3. Directory Structure
```text
.
├── app/                  # Next.js App Router (Views & Routes)
│   ├── (site)/           # Public-facing website pages
│   ├── admin/            # Admin dashboard and management tools
│   ├── api/              # API routes (e.g., sitemap, robots)
│   ├── products/         # Product-related pages
│   └── blogs/            # Blog-related pages
├── components/           # UI Components
│   ├── puck/             # Puck editor configuration and blocks
│   ├── scraped/          # Components specifically for scraped/static content
│   └── ui/               # Primary UI components (Button, Input, etc.)
├── convex/               # Backend logic (Schema, Queries, Mutations)
│   ├── schema.ts         # Central data model definition
│   ├── pages.ts          # Page management logic
│   ├── products.ts       # Product management logic
│   └── ...               # Auth, Theme, Settings, etc.
├── scripts/              # Data ingestion and utility scripts
├── nb scraped data/      # Source data for the platform
└── public/               # Static assets
```

## 4. Data Model (Convex Schema)
The system uses a highly structured relational-like schema in Convex:
- **`pages`**: Stores Puck JSON data for dynamic pages (`path`, `data`, `title`, `description`).
- **`products`**: Product listings (`name`, `slug`, `price`, `images`, `categoryId`).
- **`categories`**: Product groupings (`name`, `slug`).
- **`inquiries`**: Lead capture (`name`, `email`, `message`, `productId`, `status`).
- **`siteSettings` & `themeSettings`**: Global configuration and design tokens.
- **`blogs`**: Blog posts with Puck data support.
- **`media`**: Tracking uploaded files and their Convex Storage IDs.

## 5. Key Workflows

### 5.1 Page Building (Puck Editor)
- Admins use the editor at `/admin/editor` to build pages visually.
- Components are defined in `components/puck/config.tsx`.
- Page data is saved as a JSON blob in the `pages` table.

### 5.2 Content Ingestion
The project features several ingestion scripts in the `scripts/` directory:
- `ingestText.mjs`: Imports scraped text content into the database.
- `ingestExpanded.mjs`: Handles more complex data imports.
- `uploadImages.mjs`: Automates image uploads to Convex Storage.
- `ingestSEOContent.mjs`: Specifically populates SEO metadata.

### 5.3 Theme & Configuration Management
- **Dashboard Control**: Theme settings and global site data (logos, links, SEO tags) are managed in the Admin panel.
- **Static Fallbacks**: Current customizations are persisted in the codebase to guarantee brand consistency if the database is reset.
  - `convex/theme.ts`: Stores the `defaultThemeSettings` (Fonts, Colors).
  - `convex/seed.ts`: Stores global site settings (Social links, Site title).
- **Persistence Workflow**:
  1. Update settings via the Admin UI.
  2. Use the reasoning agent to sync these to `theme.ts` and `seed.ts`.
  3. Deploy changes: `npx convex deploy`.

## 6. Current Context for Reasoning
- **Data Persistence**: Always ensure live dashboard changes are mirrored to `convex/theme.ts` and `convex/seed.ts` before significant deployments.
- **Real-time Synchronization**: Convex handles real-time updates automatically.
- **Puck Editor Constraints**: Changes to components in `config.tsx` may require migrations or updates to existing page data if props change significantly.
- **SEO Focus**: The project places high importance on metadata and content ingestion from scraped sources.
- **Admin Security**: Admin routes are protected via Convex Auth roles.

---
*Created on 2026-02-20*
