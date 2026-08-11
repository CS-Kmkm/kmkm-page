import PageLayout from '@/components/layout/PageLayout';
import PageContainer from '@/components/layout/PageContainer';
import DevExperienceClient from '@/app/dev-experience/DevExperienceClient';
import { getLocalizedProjectDetails, getLocalizedTechExperience } from '@/data/localized';

export const revalidate = 60;

export default function EnglishDevExperiencePage() {
  return (
    <PageLayout title="Development Experience" locale="en">
      <PageContainer>
        <DevExperienceClient
          allTechItems={getLocalizedTechExperience('en')}
          allProjects={getLocalizedProjectDetails('en')}
        />
      </PageContainer>
    </PageLayout>
  );
}
