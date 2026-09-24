import type { Metadata } from 'next';
import CaseSearchClient from './CaseSearchClient';

export const metadata: Metadata = {
  title: 'PERM Case Search by Employer | Find Your Case Number',
  description:
    'Search PERM labor certification cases by employer name and submission date range. Look up case numbers, statuses, and decision dates for any company.',
  alternates: { canonical: '/case-search' },
  openGraph: {
    title: 'PERM Case Search by Employer',
    description:
      'Search PERM labor certification cases by employer name and submission date range.',
    url: '/case-search',
  },
};

export default function CaseSearchPage() {
  return <CaseSearchClient />;
}
