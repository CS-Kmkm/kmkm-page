import type { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | Personal Portfolio',
  description: 'Terms of service for this personal portfolio website.',
};

export default function TermsPage() {
  return (
    <PageLayout title="Terms of Service">
      <div className="w-[90%] max-w-4xl mx-auto px-4 py-2 sm:py-4">
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: January 27, 2026
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Use of Content
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Unless otherwise stated, the content on this site is provided for informational
              purposes. Please request permission before redistributing substantial portions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              No Warranty
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              This site is provided on an as-is basis without warranties of any kind. Content may
              be updated, changed, or removed at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contact
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              For questions about these terms, please use the contact information provided on the
              site.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

