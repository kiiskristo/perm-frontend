import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import Container from '@/components/Container';
import BulletinPage from '@/components/bulletin/BulletinPage';

export const metadata: Metadata = {
  title: 'Visa Bulletin Tracker | EB-2 & EB-3 Priority Date History',
  description:
    'Track visa bulletin priority date movement for EB-1, EB-2, EB-3 and more. Charts and tables of Final Action Dates and Dates for Filing for India, China, Mexico, Philippines and all other countries.',
  alternates: { canonical: '/visa-bulletin' },
  openGraph: {
    title: 'Visa Bulletin Tracker — Priority Date History',
    description:
      'Charts and tables of employment-based Final Action Dates and Dates for Filing, by category and country.',
    url: '/visa-bulletin',
  },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function toIsoMonth(bulletinDate: string): string {
  const [month, year] = bulletinDate.split(' ');
  return `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, '0')}`;
}

// Read at build time so coverage tracks the data file without manual updates.
const bulletinMonths: { date: string }[] = JSON.parse(
  readFileSync(join(process.cwd(), 'public', 'bulletin.json'), 'utf8'),
).months;
const temporalCoverage = `${toIsoMonth(bulletinMonths[bulletinMonths.length - 1].date)}/${toIsoMonth(bulletinMonths[0].date)}`;

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Employment-Based Visa Bulletin Priority Dates',
  description:
    'Monthly employment-based Final Action Dates and Dates for Filing from the U.S. Department of State Visa Bulletin, by preference category and country of chargeability.',
  url: 'https://permupdate.com/visa-bulletin',
  isAccessibleForFree: true,
  temporalCoverage,
  creator: { '@type': 'Organization', name: 'PERM Analytics', url: 'https://permupdate.com' },
  isBasedOn: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html',
  distribution: {
    '@type': 'DataDownload',
    encodingFormat: 'application/json',
    contentUrl: 'https://permupdate.com/bulletin.json',
  },
};

export default function VisaBulletin() {
  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <BulletinPage />
    </Container>
  );
}
