import Link from 'next/link';
import { FooterProps } from '@/types';
import { footerLinks, footerSocialLinks, siteConfig } from '@/lib/site';

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 transition-colors duration-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {siteConfig.personName}
            </p>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              自然言語処理の研究活動、開発経験、論文投稿履歴をまとめた個人ポートフォリオです。
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {siteConfig.currentPosition} / {siteConfig.currentAffiliation}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              サイト情報
            </h2>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              外部リンク
            </h2>
            <ul className="space-y-2">
              {footerSocialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                    aria-label={`${link.label}を新しいタブで開く`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {currentYear} {siteConfig.personName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Next.js / Tailwind CSS で構築
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
