import Link from 'next/link';
import type { FooterProps, SocialLink } from '@/types';
import { footerLinks, footerSocialLinks, siteConfig } from '@/lib/site';

const getSocialIcon = (platform: SocialLink['platform']) => {
  switch (platform) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.69.08-.69 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .97-.31 3.19 1.17a10.9 10.9 0 0 1 5.82 0c2.21-1.49 3.18-1.17 3.18-1.17.63 1.58.24 2.75.12 3.03.73.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.37-5.25 5.66.41.36.77 1.06.77 2.15 0 1.55-.01 2.81-.01 3.2 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M18.9 2.25h3.68l-8.04 9.2L24 21.75h-7.41l-5.8-6.73-5.89 6.73H1.22l8.6-9.82L0 2.25h7.6l5.24 6.09 6.06-6.09Zm-1.3 17.33h2.04L6.5 4.31H4.3L17.6 19.58Z" />
        </svg>
      );
    case 'orcid':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-5.2 4.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM5.7 10h2.2v7.4H5.7V10Zm4.1 0h5.95c2.84 0 4.25 1.81 4.25 3.83 0 2.36-1.92 3.79-4.39 3.79H9.8V10Zm2.2 5.57h3.43c1.43 0 2.35-.69 2.35-1.77 0-1.07-.86-1.8-2.3-1.8h-3.48v3.57Z" />
        </svg>
      );
    case 'website':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.4 3.8 5.7 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.7-3.8-9S9.5 5.4 12 3Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
          <path d="M14 4h6v6" />
          <path d="M10 14 20 4" />
          <path d="M20 14v6H4V4h6" />
        </svg>
      );
  }
};

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 transition-colors duration-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {siteConfig.personName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {siteConfig.currentPosition} / {siteConfig.currentAffiliation}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex flex-wrap items-center">
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center">
              <ul className="flex flex-wrap items-center gap-1.5">
                {footerSocialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
                      aria-label={`${link.label}を新しいタブで開く`}
                      title={link.label}
                    >
                      {getSocialIcon(link.platform)}
                      <span className="sr-only">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
