import type { NextConfig } from "next";

const nextConfig: any = {
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
  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=1, stale-while-revalidate=59', // Cache on CDN but check for fresh content frequently
          },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate', // Never cache admin pages
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

      // Blog — fix: old /blog/:slug now correctly points to /blogs/:slug (not /blogs/blog/:slug)
      { source: '/blog', destination: '/blogs', permanent: true },
      { source: '/blog/:slug', destination: '/blogs/:slug', permanent: true },
      // Redirect old /blogs/blog/:slug to the clean /blogs/:slug path
      { source: '/blogs/blog/:slug', destination: '/blogs/:slug', permanent: true },

      // Product category pages → products page with hash anchors
      { source: '/skin-care-products', destination: '/products#skin-care', permanent: true },
      { source: '/skin-care', destination: '/products#skin-care', permanent: true },
      { source: '/mens-grooming-products', destination: '/products#mens-grooming', permanent: true },
      { source: '/mens-grooming', destination: '/products#mens-grooming', permanent: true },
      { source: '/hair-care-products', destination: '/products#hair-care', permanent: true },
      { source: '/hair-care', destination: '/products#hair-care', permanent: true },
      { source: '/personal-care', destination: '/products#body-personal-care', permanent: true },
      { source: '/personal-care/:path*', destination: '/products#body-personal-care', permanent: true },
      { source: '/body-personal-care', destination: '/products#body-personal-care', permanent: true },
      { source: '/body-care', destination: '/products#body-personal-care', permanent: true },

      // Old SEO landing pages → blog posts (301 authority transfer)
      { source: '/best-face-wash-manufacturers-in-india', destination: '/blogs/best-face-wash-manufacturers-in-india', permanent: true },
      { source: '/best-face-wash-manufacturers-in-india/', destination: '/blogs/best-face-wash-manufacturers-in-india', permanent: true },
      { source: '/best-facial-kit-manufacturers-in-india', destination: '/blogs/best-facial-kit-manufacturers-in-india', permanent: true },
      { source: '/best-facial-kit-manufacturers-in-india/', destination: '/blogs/best-facial-kit-manufacturers-in-india', permanent: true },
      { source: '/best-hair-serum-manufacturers-in-india', destination: '/blogs/best-hair-serum-manufacturers-in-india', permanent: true },
      { source: '/best-hair-serum-manufacturers-in-india/', destination: '/blogs/best-hair-serum-manufacturers-in-india', permanent: true },
      { source: '/best-shampoo-manufacturers-in-india', destination: '/blogs/best-shampoo-manufacturers-in-india', permanent: true },
      { source: '/best-shampoo-manufacturers-in-india/', destination: '/blogs/best-shampoo-manufacturers-in-india', permanent: true },
      { source: '/best-body-lotion-manufacturers-in-india', destination: '/blogs/best-body-lotion-manufacturers-in-india', permanent: true },
      { source: '/best-body-lotion-manufacturers-in-india/', destination: '/blogs/best-body-lotion-manufacturers-in-india', permanent: true },
      { source: '/best-body-scrub-manufacturers-in-india', destination: '/blogs/best-body-scrub-manufacturers-in-india', permanent: true },
      { source: '/best-body-scrub-manufacturers-in-india/', destination: '/blogs/best-body-scrub-manufacturers-in-india', permanent: true },
      { source: '/best-face-serum-manufacturers-in-india', destination: '/blogs/best-face-serum-manufacturers-in-india', permanent: true },
      { source: '/best-face-serum-manufacturers-in-india/', destination: '/blogs/best-face-serum-manufacturers-in-india', permanent: true },
      { source: '/best-sunscreen-manufacturers-in-india', destination: '/blogs/best-sunscreen-manufacturers-in-india', permanent: true },
      { source: '/best-sunscreen-manufacturers-in-india/', destination: '/blogs/best-sunscreen-manufacturers-in-india', permanent: true },
      { source: '/hair-oil-manufacturers-in-india', destination: '/blogs/hair-oil-manufacturers-in-india', permanent: true },
      { source: '/hair-oil-manufacturers-in-india/', destination: '/blogs/hair-oil-manufacturers-in-india', permanent: true },
      { source: '/private-label-skin-care-products-manufacturers-in-india', destination: '/blogs/private-label-skin-care-products-manufacturers-in-india', permanent: true },
      { source: '/private-label-skin-care-products-manufacturers-in-india/', destination: '/blogs/private-label-skin-care-products-manufacturers-in-india', permanent: true },
      { source: '/private-label-skin-care-products-manufacturer', destination: '/blogs/private-label-skin-care-products-manufacturers-in-india', permanent: true },
      { source: '/private-label-skin-care-products-:slug', destination: '/blogs/private-label-skin-care-products-manufacturers-in-india', permanent: true },
      { source: '/private-label-third-party-beard-oil-manufacturers-in-india', destination: '/blogs/private-label-third-party-beard-oil-manufacturers-in-india', permanent: true },
      { source: '/private-label-third-party-beard-oil-manufacturers-in-india/', destination: '/blogs/private-label-third-party-beard-oil-manufacturers-in-india', permanent: true },
      { source: '/third-party-contract-cosmetics-products-manufacturers-in-india', destination: '/blogs/third-party-contract-cosmetics-products-manufacturers-in-india', permanent: true },
      { source: '/third-party-contract-cosmetics-products-manufacturers-in-india/', destination: '/blogs/third-party-contract-cosmetics-products-manufacturers-in-india', permanent: true },
      { source: '/top-derma-products-manufacturers-in-india', destination: '/blogs/top-derma-products-manufacturers-in-india', permanent: true },
      { source: '/top-derma-products-manufacturers-in-india/', destination: '/blogs/top-derma-products-manufacturers-in-india', permanent: true },
      { source: '/top-derma-products-manufacturers-india', destination: '/blogs/top-derma-products-manufacturers-in-india', permanent: true },
      { source: '/top-derma-products-m', destination: '/blogs/top-derma-products-manufacturers-in-india', permanent: true },
      { source: '/customised-finished-product', destination: '/services#custom-formulation', permanent: true },
      { source: '/customised-finished-product/', destination: '/services#custom-formulation', permanent: true },

      // Case study → blog or about (no exact equivalent yet)
      // { source: '/case-study', destination: '/blogs', permanent: true },

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
      // { source: '/our-brands', destination: '/about', permanent: true },
      // { source: '/brands', destination: '/about', permanent: true },

      // Services
      { source: '/our-services', destination: '/services', permanent: true },
      { source: '/services-offered', destination: '/services', permanent: true },

      // ─── PHASE 4: TRAILING SLASH NORMALISATION ──────────────────────────────
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
