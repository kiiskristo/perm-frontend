import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PERM Analytics | Labor Certification Timeline Predictor',
  description: 'Track and predict PERM processing times with our analytics tools. Get accurate timeline estimates for your labor certification case.',
  keywords: 'PERM timeline, PERM processing time, labor certification, PERM prediction, PERM analytics, PERM case tracker',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#4F46E5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PERM Analytics',
  },
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
      </head>
      <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID!} />
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
