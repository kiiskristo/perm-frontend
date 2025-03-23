import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'PERM Analytics | Labor Certification Timeline Predictor',
  description: 'Track and predict PERM processing times with our analytics tools. Get accurate timeline estimates for your labor certification case.',
  keywords: 'PERM timeline, PERM processing time, labor certification, PERM prediction, PERM analytics, PERM case tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get API URL from environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  return (
    <html lang="en" className="h-full">
      <head>
        {apiUrl && <link rel="dns-prefetch" href={apiUrl} />}

        {/* Preload critical CSS */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
        
        {/* Add JS optimization hints */}
        <Script id="performance-optimization" strategy="beforeInteractive">
          {`
            // Use requestIdleCallback to defer non-critical operations
            const deferredOperations = () => {
              // Report performance metrics
              if ('performance' in window && 'PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                  const entries = list.getEntries();
                  entries.forEach(entry => {
                    if (entry.entryType === 'largest-contentful-paint') {
                      console.log('LCP:', entry.startTime);
                    }
                  });
                });
                observer.observe({ type: 'largest-contentful-paint', buffered: true });
              }
            };
            
            // Use requestIdleCallback if available, or setTimeout as fallback
            if ('requestIdleCallback' in window) {
              requestIdleCallback(deferredOperations);
            } else {
              setTimeout(deferredOperations, 1000);
            }
          `}
        </Script>
      </head>
      <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID!} />
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
