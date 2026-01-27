import type { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Personal Portfolio',
  description: 'Privacy policy for this personal portfolio website.',
};

export default function PrivacyPage() {
  return (
    <PageLayout title="Privacy Policy">
      <div className="w-[90%] max-w-4xl mx-auto px-4 py-2 sm:py-4">
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: January 27, 2026
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Overview
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              This site is a personal portfolio. It is designed to share professional work and
              background information, with minimal data collection.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Analytics
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Basic analytics may be used to understand site usage and improve the experience.
              Analytics data is aggregated and not used to identify individual visitors.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contact
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have questions about this policy, please use the contact information provided
              on the site.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

