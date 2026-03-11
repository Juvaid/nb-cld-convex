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
    ],
    minimumCacheTTL: 31536000,
  },
  productionBrowserSourceMaps: true,
  allowedDevOrigins: ['192.168.1.62'],
  transpilePackages: ["@convex-dev/auth"],
  serverExternalPackages: ["convex"],
};

export default nextConfig;
