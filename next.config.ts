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
        hostname: '**.naturesboon.net',
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

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ];
  },

  // 301 Redirects: WordPress → Next.js URL mappings for SEO continuity
  async redirects() {
    return [
      // ─── PHASE 1: OLD WORDPRESS URLS → NEW SITE ────────────────────────────
      // These are the exact URLs Google has indexed on naturesboon.net
      // When you switch the domain, these 301s will pass ranking to the new URLs

      // About page (indexed as /about-us)
      { source: '/about-us', destination: '/about', permanent: true },

      // Contact (indexed as /contact — same slug, keep anyway)
      { source: '/contact-us', destination: '/contact', permanent: true },

      // Blog
      { source: '/blog', destination: '/blogs', permanent: true },
      { source: '/blog/:slug', destination: '/blogs/blog/:slug', permanent: true },

      // Product category pages → products page with hash anchors
      { source: '/skin-care-products', destination: '/products#skin-care', permanent: true },
      { source: '/skin-care', destination: '/products#skin-care', permanent: true },
      { source: '/mens-grooming-products', destination: '/products#mens-grooming', permanent: true },
      { source: '/mens-grooming', destination: '/products#mens-grooming', permanent: true },
      { source: '/hair-care-products', destination: '/products#hair-care', permanent: true },
      { source: '/hair-care', destination: '/products#hair-care', permanent: true },
      { source: '/personal-care', destination: '/products#personal-care', permanent: true },
      { source: '/personal-care/:path*', destination: '/products', permanent: true },

      // OLD keyword landing pages → new dedicated pages (CREATE THESE FIRST - see Phase 2)
      { source: '/private-label-skin-care-products-manufacturer', destination: '/services#private-label', permanent: true },
      { source: '/private-label-skin-care-products-:slug', destination: '/services#private-label', permanent: true },
      { source: '/top-derma-products-manufacturers-india', destination: '/services#derma', permanent: true },
      { source: '/top-derma-products-m', destination: '/services#derma', permanent: true },
      { source: '/customised-finished-product', destination: '/services#custom-formulation', permanent: true },

      // Case study → blog or about (no exact equivalent yet)
      { source: '/case-study', destination: '/blogs', permanent: true },

      // Site-map page → homepage (WordPress generated)
      { source: '/site-map', destination: '/', permanent: true },
      { source: '/sitemap', destination: '/sitemap.xml', permanent: true },

      // WordPress admin/login pages → homepage (prevent 404s)
      { source: '/wp-admin', destination: '/', permanent: true },
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/wp-json/:path*', destination: '/', permanent: true },

      // WordPress PDF uploads → redirect to services (don't 404)
      { source: '/wp-content/uploads/:path*', destination: '/services', permanent: true },

      // WordPress pagination & feed URLs
      { source: '/page/:num', destination: '/', permanent: true },
      { source: '/feed', destination: '/', permanent: true },
      { source: '/feed/:path*', destination: '/', permanent: true },

      // Our brands page (visible in old SERP)
      { source: '/our-brands', destination: '/about', permanent: true },
      { source: '/brands', destination: '/about', permanent: true },

      // Services
      { source: '/our-services', destination: '/services', permanent: true },
      { source: '/services-offered', destination: '/services', permanent: true },

      // ─── PHASE 2: TRAILING SLASH NORMALISATION ──────────────────────────────
      // Uncomment these if you see duplicate canonicals in GSC later
      // { source: '/about/', destination: '/about', permanent: true },
      // { source: '/products/', destination: '/products', permanent: true },
      // { source: '/services/', destination: '/services', permanent: true },
      // { source: '/contact/', destination: '/contact', permanent: true },
      // { source: '/blogs/', destination: '/blogs', permanent: true },
    ];
  },
};

export default nextConfig;
