import PageLayout from '@/components/layout/PageLayout';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  locale: 'en',
  title: 'Privacy Policy',
  path: '/en/privacy',
  description: 'How this personal portfolio site handles data.',
  keywords: ['privacy policy', 'personal data', 'analytics'],
});

export default function EnglishPrivacyPage() {
  return (
    <PageLayout title="Privacy Policy" locale="en">
      <div className="w-[90%] max-w-4xl mx-auto px-4 py-2 sm:py-4">
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: April 13, 2026
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Information collected
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              This site is a personal portfolio whose main purpose is to introduce research activities and
              development experience. It offers no input forms and no account registration, so there is no
              mechanism that directly collects personal information such as names or email addresses.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Analytics and local storage
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Depending on the deployment configuration, access analytics may be enabled in order to understand
              how the site is used. The theme setting is also saved in the browser&apos;s{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-[0.9em] dark:bg-gray-800">localStorage</code>. This
              information is used only to display and improve the site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              External services
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              When you follow an external link such as GitHub, X, ORCID or the laboratory site, the policy of the
              service you move to applies. Please check the notices of each service for details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contact
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              For inquiries about this policy, please use the public profile links published on this site.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
