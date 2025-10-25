import Header from './Header';
import Footer from './Footer';
import { PageLayoutProps } from '@/types';

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
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
        className={`flex-grow ${className}`}
        role="main"
        aria-label={`${title} page content`}
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageLayout;