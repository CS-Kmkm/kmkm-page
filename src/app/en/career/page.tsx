import PageLayout from '@/components/layout/PageLayout';
import PageContainer from '@/components/layout/PageContainer';
import CareerPageClient from '@/app/career/CareerPageClient';
import { getLocalizedCareerEntries, getLocalizedEvents } from '@/data/localized';
import type { ExtendedCareerEntry } from '@/types';

export const revalidate = 60;

export default function EnglishCareerPage() {
  const careerEntries = getLocalizedCareerEntries('en') as ExtendedCareerEntry[];
  const events = getLocalizedEvents('en');

  return (
    <PageLayout title="Career" locale="en">
      <PageContainer>
        <CareerPageClient careerEntries={careerEntries} events={events} />
      </PageContainer>
    </PageLayout>
  );
}
