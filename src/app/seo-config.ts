import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  title: 'PERM Tracker & Timeline Analytics | Processing Time Predictions',
  description: 'Track your PERM case processing times with our advanced timeline tracker. Get accurate predictions and real-time analytics for your labor certification process.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://permupdate.com/',
    siteName: 'PERM Timeline Tracker',
    images: [
      {
        url: 'https://permupdate.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PERM Processing Time Tracker Dashboard',
      },
    ],
  },
  twitter: {
    handle: '@permanalytics',
    site: '@permanalytics',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'perm tracker, perm timeline, perm processing time tracker, perm case tracking, labor certification timeline, perm approval tracker, perm processing tracker, perm timeline tracker',
    },
    {
      name: 'application-name',
      content: 'PERM Timeline Tracker',
    },
  ],
};

export default config; 