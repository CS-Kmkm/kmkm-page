import PageLayout from '@/components/layout/PageLayout';
import PageContainer from '@/components/layout/PageContainer';
import { getProjectDetails, getTechExperience } from '@/data';
import DevExperienceClient from './DevExperienceClient';

const PAGE_TITLE = '開発経験';

export const revalidate = 60;

export default function DevExperiencePage() {
  return (
    <PageLayout title={PAGE_TITLE}>
      <PageContainer>
        <DevExperienceClient
          allTechItems={getTechExperience()}
          allProjects={getProjectDetails()}
        />
      </PageContainer>
    </PageLayout>
  );
}
