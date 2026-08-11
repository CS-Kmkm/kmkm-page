import PageLayout from '@/components/layout/PageLayout';
import PageContainer from '@/components/layout/PageContainer';
import PageHeading from '@/components/layout/PageHeading';
import PublicationList from '@/components/ui/PublicationList';
import { getLocalizedPublications } from '@/data/localized';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  locale: 'en',
  title: 'Publications',
  path: '/en/publications',
  description: 'Research publications, filterable by authorship and peer-review status.',
  keywords: ['publications', 'research', 'natural language processing', 'digital libraries'],
});

export default function EnglishPublicationsPage() {
  const publications = getLocalizedPublications('en');

  return (
    <PageLayout title="Publications" locale="en">
      <PageContainer>
        <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
          {publications.length > 0 ? (
            <PublicationList publications={publications} />
          ) : (
            <div className="py-12 text-center">
              <PageHeading className="mb-4">Publications</PageHeading>
              <p className="text-gray-600 dark:text-gray-400">No publications are currently available.</p>
            </div>
          )}
        </div>
      </PageContainer>
    </PageLayout>
  );
}
