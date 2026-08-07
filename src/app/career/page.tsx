import PageLayout from '@/components/layout/PageLayout';
import PageContainer from '@/components/layout/PageContainer';
import { getCareerEntries, getEvents } from '@/data';
import type { ExtendedCareerEntry } from '@/types';
import CareerPageClient from './CareerPageClient';

const PAGE_TITLE = '経歴';

export const revalidate = 60;

export default function CareerPage() {
  const careerEntries = getCareerEntries() as ExtendedCareerEntry[];
  const events = getEvents();

  return (
    <PageLayout title={PAGE_TITLE}>
      <PageContainer>
        <CareerPageClient careerEntries={careerEntries} events={events} />
      </PageContainer>
    </PageLayout>
  );
}
