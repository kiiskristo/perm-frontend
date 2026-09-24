import type { Metadata } from 'next';
import UpdatedCasesClient from './UpdatedCasesClient';

export const metadata: Metadata = {
  title: 'Daily Updated PERM Cases | Status Changes by Date',
  description:
    'See every PERM case whose status changed on a given day — previous and current status side by side. Updated nightly with the latest Department of Labor data.',
  alternates: { canonical: '/updated-cases' },
  openGraph: {
    title: 'Daily Updated PERM Cases',
    description:
      'See every PERM case whose status changed on a given day. Updated nightly with the latest DOL data.',
    url: '/updated-cases',
  },
};

export default function UpdatedCasesPage() {
  return <UpdatedCasesClient />;
}
