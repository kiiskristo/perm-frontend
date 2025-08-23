import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ClientWrapper from '@/components/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  themeColor: '#4F46E5',
};

export const metadata = {
  title: 'PERM Tracker & Timeline Analytics | Processing Time Predictions',
  description: 'Track your PERM case processing times with our advanced timeline tracker. Get accurate predictions and real-time analytics for your labor certification process.',
  keywords: 'perm tracker, perm timeline, perm processing time tracker, perm case tracking, labor certification timeline, perm approval tracker',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PERM Timeline Tracker',
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9390909578965799"
          crossOrigin="anonymous"
        />
      </head>
      <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID!} />
      <body className={`${inter.className} h-full`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
