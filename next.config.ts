import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimization for Vercel
  output: 'standalone',

  // @ts-expect-error - Valid option for build but missing from type def
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [25, 50, 75, 80, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
