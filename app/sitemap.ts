import { MetadataRoute } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
    if (!convexUrl) {
        console.warn("NEXT_PUBLIC_CONVEX_URL is not set for sitemap generation");
        return [];
    }
    
    const convex = new ConvexHttpClient(convexUrl);

    // Fetch all necessary data concurrently with error handling
    let pageUrls: any[] = [];
    let productUrls: any[] = [];
    let blogUrls: any[] = [];

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naturesboon.net';

    try {
        const [pages, products, blogs] = await Promise.all([
            convex.query(api.pages.getAllPagePaths).catch(() => []),
            convex.query(api.products.listNames).catch(() => []),
            convex.query(api.blogs.listBlogs).catch(() => [])
        ]);

        pageUrls = (pages || []).map((page: any) => ({
            url: `${baseUrl}${page.path}`,
            lastModified: new Date(page.lastModified || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: page.path === '/' ? 1 : 0.8,
        }));

        productUrls = (products || []).map((product: any) => ({
            url: `${baseUrl}/products/${product.slug || product._id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        blogUrls = (blogs || []).map((blog: any) => ({
            url: `${baseUrl}/blogs/${blog.slug}`,
            lastModified: new Date(blog.publishedAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error("Sitemap generation error:", error);
    }

    return [...pageUrls, ...productUrls, ...blogUrls];
}

export default sitemap;


