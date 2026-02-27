import { MetadataRoute } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Fetch all necessary data concurrently
    const [pages, products, blogs] = await Promise.all([
        convex.query(api.pages.getAllPagePaths),
        convex.query(api.products.listNames),
        convex.query(api.blogs.listBlogs)
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://naturesboon.net';

    const pageUrls = pages.map((page: any) => ({
        url: `${baseUrl}${page.path}`,
        lastModified: new Date(page.lastModified || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: page.path === '/' ? 1 : 0.8,
    }));

    const productUrls = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug || product._id}`, // fallback to _id if slug missing in light query
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
