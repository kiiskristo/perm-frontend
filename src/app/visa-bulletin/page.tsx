import Container from '@/components/Container';
import BulletinPage from '@/components/bulletin/BulletinPage';

export const metadata = {
  title: 'Visa Bulletin Tracker | PERM Analytics',
  description:
    'Track USCIS visa bulletin priority dates over time. View Final Action Dates and Dates for Filing for all employment-based preference categories and countries.',
};

export default function VisaBulletin() {
  return (
    <Container>
      <BulletinPage />
    </Container>
  );
}
