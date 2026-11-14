import { markdownPages, renderMarkdown, type MarkdownPage } from '@/lib/markdown';
import type { ContentLocale } from '@/data/localized';

// Suspense reveal scripts cannot run with JavaScript disabled. Put a readable
// snapshot in the fallback itself; ordinary browsers never display <noscript>.
export default function NoScriptContent({ locale, page }: { locale: ContentLocale; page: MarkdownPage }) {
  const labels = locale === 'en' ? ['Home', 'Career', 'Publications', 'Development Experience'] : ['ホーム', '経歴', '論文', '開発経験'];
  return (
    <noscript>
      <style>{`.loading-visual { display: none !important; }`}</style>
      <main className="mx-auto max-w-5xl p-6" lang={locale} data-no-js-content>
        <nav aria-label={locale === 'en' ? 'Main pages' : '主要ページ'}>
          {markdownPages.map((path, index) => (
            <a className="mr-4 underline" key={path} href={`/${locale}${path ? `/${path}` : ''}`}>{labels[index]}</a>
          ))}
        </nav>
        <pre className="mt-6 whitespace-pre-wrap font-sans">{renderMarkdown(locale, page)}</pre>
      </main>
    </noscript>
  );
}
