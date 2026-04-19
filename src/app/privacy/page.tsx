import PageLayout from '@/components/layout/PageLayout';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'プライバシーポリシー',
  path: '/privacy',
  description: '個人ポートフォリオサイトにおけるデータの取り扱い方針です。',
});

export default function PrivacyPage() {
  return (
    <PageLayout title="プライバシーポリシー">
      <div className="w-[90%] max-w-4xl mx-auto px-4 py-2 sm:py-4">
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              プライバシーポリシー
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              最終更新日: 2026年4月13日
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              取得する情報
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              このサイトは個人ポートフォリオであり、研究活動や開発経験の紹介を主目的としています。
              フォーム入力や会員登録は設けておらず、氏名やメールアドレスなどの個人情報を直接収集する仕組みはありません。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              アクセス解析とローカル保存
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              利用状況の把握のために、環境設定によってはアクセス解析を有効にする場合があります。また、テーマ設定はブラウザの
              `localStorage` に保存されます。これらの情報はサイト表示や改善のためにのみ利用します。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              外部サービス
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              GitHub、X、ORCID、研究室サイトなどの外部リンクを利用した場合、遷移先サービスのポリシーが適用されます。
              詳細は各サービスの案内をご確認ください。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              お問い合わせ
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              このポリシーに関するご連絡は、サイト内に掲載している公開プロフィールリンクからお願いします。
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

