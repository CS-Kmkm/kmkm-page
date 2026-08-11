import Header from './Header';
import Footer from './Footer';
import { PageLayoutProps } from '@/types';
import { LocaleProvider } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

type LocalizedPageLayoutProps = PageLayoutProps & { locale?: Locale };

const PageLayout: React.FC<LocalizedPageLayoutProps> = ({
  children,
  title,
  className = '',
  locale = 'ja',
}) => {
  const skipToContent = locale === 'en' ? 'Skip to main content' : 'メインコンテンツへスキップ';
  return (
    <LocaleProvider locale={locale}>
    <div lang={locale} className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        tabIndex={0}
      >
        {skipToContent}
      </a>

      {/* Header */}
      <Header locale={locale} />

      {/* Main Content */}
      <main
        id="main-content"
        className={`flex-1 py-4 sm:py-6 lg:py-8 ${className}`}
        role="main"
        aria-label={title}
        tabIndex={-1}
      >
        {children}
      </main>

      <Footer locale={locale} />
    </div>
    </LocaleProvider>
  );
};

export default PageLayout;
