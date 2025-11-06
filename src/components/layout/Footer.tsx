import { FooterProps } from '@/types';

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-50 border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright Information */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © {currentYear} Personal Portfolio. All rights reserved.
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              Built with{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                aria-label="Next.js website (opens in new tab)"
              >
                Next.js
              </a>
              {' '}and{' '}
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                aria-label="Tailwind CSS website (opens in new tab)"
              >
                Tailwind CSS
              </a>
            </p>
          </div>
        </div>

        {/* Additional Footer Links - Mobile Responsive */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Privacy policy"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Terms of service"
            >
              Terms of Service
            </a>
            <a
              href="mailto:contact@example.com"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Send email to contact@example.com"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;