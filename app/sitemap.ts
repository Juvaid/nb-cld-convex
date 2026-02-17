import { MetadataRoute } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const pages = await convex.query(api.pages.getAllPagePaths);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://naturesboon.net';

    return pages.map((page: any) => ({
        url: `${baseUrl}${page.path}`,
        lastModified: new Date(page.lastModified),
        changeFrequency: 'weekly',
        priority: page.path === '/' ? 1 : 0.8,
    }));
}
