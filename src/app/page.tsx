import type { Metadata } from 'next';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'PERM Processing Time Tracker 2026 | Daily PERM Timeline & Backlog',
  description:
    'Current PERM processing times updated daily from DOL data. Track the PERM backlog, see which months DOL is working on, and predict when your labor certification will be decided.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'PERM Analytics',
    url: '/',
    title: 'PERM Processing Time Tracker — Updated Daily',
    description:
      'Current PERM processing times, backlog by month, and case timeline predictions — updated daily from DOL data.',
  },
};

const schemaData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PERM Analytics',
    url: 'https://permupdate.com',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PERM Timeline Tracker',
    url: 'https://permupdate.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    description:
      'Tracks PERM labor certification processing times and predicts case completion dates using daily Department of Labor data.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Container />
    </>
  );
}
