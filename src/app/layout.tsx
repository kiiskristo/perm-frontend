import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

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
  return (
    <html lang="en" className="h-full">
      <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID!} />
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
