import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.62'],
  transpilePackages: ["@convex-dev/auth"],
  serverExternalPackages: ["convex"],
};

export default nextConfig;
