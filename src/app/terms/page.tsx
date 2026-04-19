import PageLayout from '@/components/layout/PageLayout';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: '利用条件',
  path: '/terms',
  description: '個人ポートフォリオサイトの利用条件です。',
});

export default function TermsPage() {
  return (
    <PageLayout title="利用条件">
      <div className="w-[90%] max-w-4xl mx-auto px-4 py-2 sm:py-4">
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              利用条件
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              最終更新日: 2026年4月13日
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              掲載内容について
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              本サイトの内容は、研究活動や開発経験の紹介を目的として掲載しています。引用や参照を行う際は、文脈が分かる形で
              出典を明記してください。転載や再配布を行う場合は、事前にご相談ください。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              免責事項
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              本サイトの内容は正確性に配慮して掲載していますが、完全性や最新性を保証するものではありません。内容は予告なく
              変更、更新、削除されることがあります。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              外部リンク
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              外部サイトへのリンク先で提供される情報やサービスについては、それぞれの運営者の責任で管理されています。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              お問い合わせ
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              本サイトの内容や利用条件に関するご連絡は、公開している各種プロフィールリンクからお願いします。
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

