'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getMessages, localeFromPathname, localizeHref } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export interface NotFoundContentProps {
  locale?: Locale;
}

// The root boundary serves unmatched URLs of both locale trees, so the locale falls back to the
// one of the rendered route; locale-scoped boundaries pass it explicitly.
const NotFoundContent = ({ locale: localeProp }: NotFoundContentProps) => {
  const pathname = usePathname();
  const locale = localeProp ?? localeFromPathname(pathname);
  const messages = getMessages(locale);
  const suggestions = [
    { href: localizeHref('/career', locale), label: messages.career },
    { href: localizeHref('/dev-experience', locale), label: messages.devExperience },
    { href: localizeHref('/publications', locale), label: messages.publications },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {messages.notFoundTitle}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {messages.notFoundDescription}
        </p>
        <div className="space-y-3">
          <Link
            href={localizeHref('/', locale)}
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {messages.backToTop}
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {messages.notFoundSuggestions}
          </div>

          <div className="space-y-2 text-sm">
            {suggestions.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundContent;
