import { MetadataRoute } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

    // Fetch all necessary data concurrently with error handling
    let pages: any[] = [];
    let products: any[] = [];
    let blogs: any[] = [];

    try {
        const [pagesData, productsData, blogsData] = await Promise.all([
            convex.query(api.pages.getAllPagePaths),
            convex.query(api.products.listNames),
            convex.query(api.blogs.listBlogs)
        ]);
        pages = pagesData || [];
        products = productsData || [];
        blogs = blogsData || [];
    } catch (error) {
        // Fallback handled below
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://new.naturesboon.net';

    const pageUrls = pages.map((page: any) => ({
        url: `${baseUrl}${page.path}`,
        lastModified: new Date(page.lastModified || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: page.path === '/' ? 1 : 0.8,
    }));

    const productUrls = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug || product._id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const blogUrls = blogs.map((blog: any) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: new Date(blog.publishedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...pageUrls, ...productUrls, ...blogUrls];
}
