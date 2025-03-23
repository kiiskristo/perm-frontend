import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // This tells Next.js to export static files
  basePath: '', // This tells Next.js that the app is hosted at / path
  assetPrefix: '/', // This tells Next.js to prefix asset URLs
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
