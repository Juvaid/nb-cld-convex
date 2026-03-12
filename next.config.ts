import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.convex.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.natureboon.com',
      }
    ],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  productionBrowserSourceMaps: true,
  allowedDevOrigins: ['192.168.1.62'],
  transpilePackages: ["@convex-dev/auth"],
  serverExternalPackages: ["convex"],

  // 301 Redirects: WordPress → Next.js URL mappings for SEO continuity
  async redirects() {
    return [
      // Category page redirects (customize these with your actual WordPress URLs)
      { source: '/skin-care', destination: '/products', permanent: true },
      { source: '/skin-care/:path*', destination: '/products', permanent: true },
      { source: '/hair-care', destination: '/products', permanent: true },
      { source: '/hair-care/:path*', destination: '/products', permanent: true },
      { source: '/personal-care', destination: '/products', permanent: true },
      { source: '/personal-care/:path*', destination: '/products', permanent: true },

      // Common WordPress page slugs
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/our-services', destination: '/services', permanent: true },
      { source: '/blog', destination: '/blogs', permanent: true },
      { source: '/blog/:slug', destination: '/blogs/blog/:slug', permanent: true },

      // WordPress pagination & feed URLs
      { source: '/page/:num', destination: '/', permanent: true },
      { source: '/feed', destination: '/', permanent: true },
      { source: '/feed/:path*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
