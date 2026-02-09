import Header from './Header';
import { PageLayoutProps } from '@/types';

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        tabIndex={0}
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main
        id="main-content"
        className={`flex-1 min-h-0 overflow-auto py-2 sm:py-4 lg:py-6 ${className}`}
        role="main"
        aria-label={`${title} page content`}
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
