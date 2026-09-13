import PageLayout from '@/components/layout/PageLayout';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  locale: 'en',
  title: 'Terms of Use',
  path: '/en/terms',
  description: 'The terms of use of this personal portfolio site.',
  keywords: ['terms of use', 'disclaimer', 'external links'],
});

export default function EnglishTermsPage() {
  return (
    <PageLayout title="Terms of Use" locale="en">
      <div className="w-[90%] max-w-4xl mx-auto px-4 py-2 sm:py-4">
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Terms of Use
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: April 13, 2026
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              About the published content
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              The content of this site is published in order to introduce research activities and development
              experience. When quoting or referring to it, please state the source in a way that makes the context
              clear. Please get in touch in advance if you would like to reprint or redistribute it.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Disclaimer
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              The content of this site is published with care for its accuracy, but its completeness and timeliness
              are not guaranteed. The content may be changed, updated or removed without prior notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              External links
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Information and services provided beyond links to external sites are managed under the
              responsibility of their respective operators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contact
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              For inquiries about the content of this site or about these terms of use, please use the various
              profile links that are published here.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
