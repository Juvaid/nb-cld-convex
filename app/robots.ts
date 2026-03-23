import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin',
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'ClaudeBot', 'PerplexityBot', 'OAI-SearchBot', 'CCBot'],
        allow: '/',
      }
    ],
    sitemap: 'https://naturesboon.net/sitemap.xml',
  };
}
