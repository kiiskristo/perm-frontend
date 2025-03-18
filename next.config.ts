import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // This tells Next.js to export static files
  basePath: '/perm-frontend', // This tells Next.js that the app is hosted at /perm-frontend path
  assetPrefix: '/perm-frontend/', // This tells Next.js to prefix asset URLs
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
