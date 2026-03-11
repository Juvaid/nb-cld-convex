"use client";

import dynamic from "next/dynamic";

export const DynamicCmsPageClient = dynamic(
    () => import("./CmsPageClient").then((mod) => mod.CmsPageClient),
    { ssr: false }
);

export const DynamicBlogsClient = dynamic(
    () => import("../app/blogs/BlogsClient").then((mod) => mod.BlogsClient),
    { ssr: false }
);

export const DynamicEditorClient = dynamic(
    () => import("./puck/EditorClient").then((mod) => mod.EditorClient),
    { ssr: false }
);

export const DynamicBlogEditorClient = dynamic(
    () => import("./puck/BlogEditorClient").then((mod) => mod.BlogEditorClient),
    { ssr: false }
);

export const DynamicLoginClient = dynamic(
    () => import("./auth/LoginClient"),
    { ssr: false }
);

