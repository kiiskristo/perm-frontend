import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // This tells Next.js to export static files
  basePath: '', // This tells Next.js that the app is hosted at / path
  assetPrefix: '/', // This tells Next.js to prefix asset URLs
  images: {
    unoptimized: true,
  },
  // Optimize JS performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.log in production
  },
  // Optimize bundle size
  experimental: {
    optimizeCss: true, // CSS optimization
    optimisticClientCache: true,
  },
  // Reduce JS bundle size
  webpack: (config, { dev, isServer }) => {
    // Production optimizations only
    if (!dev && !isServer) {
      // Split chunks more aggressively
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a chart-specific chunk for visualization libraries
          recharts: {
            name: 'chunk-recharts',
            test: /[\\/]node_modules[\\/](recharts|d3-.*|internmap|delaunator|robust-predicates)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Create framework chunk
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 30,
            enforce: true,
          },
          // Group larger third-party libraries together, keeping them out of the main bundle
          lib: {
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            name(module: any) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `lib-${packageName.replace('@', '')}`;
            },
          },
          // Group smaller common chunks together
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
