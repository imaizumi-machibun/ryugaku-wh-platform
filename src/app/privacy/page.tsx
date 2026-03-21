import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'Study Work Hubのプライバシーポリシーについてご説明します。',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <p>
          Study Work Hub（以下「当サイト」）は、ユーザーの個人情報の保護を重要と考え、以下のとおりプライバシーポリシーを定めます。
        </p>

        <section>
          <h2 className="text-xl font-bold mb-3">1. 収集する情報</h2>
          <p>当サイトでは、以下の情報を収集する場合があります。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>体験談・口コミ投稿時にご提供いただく情報（ニックネーム、メールアドレス、投稿内容など）</li>
            <li>お問い合わせ時にご提供いただく情報（氏名、メールアドレス、お問い合わせ内容など）</li>
            <li>アクセス解析ツールにより自動的に収集される情報（IPアドレス、ブラウザの種類、閲覧ページなど）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. 情報の利用目的</h2>
          <p>収集した情報は、以下の目的で利用します。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>サービスの提供・運営</li>
            <li>ユーザーからのお問い合わせへの対応</li>
            <li>サービスの改善・新機能の開発</li>
            <li>利用状況の分析・統計データの作成</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. 第三者への提供</h2>
          <p>
            当サイトは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. アクセス解析ツール</h2>
          <p>
            当サイトでは、Googleアナリティクスを利用してアクセス情報を収集しています。Googleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
          </p>
          <p className="mt-2">
            詳細については、
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Googleのサービスを使用するサイトやアプリから収集した情報のGoogleによる使用
            </a>
            をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Cookieの使用</h2>
          <p>
            当サイトでは、ユーザー体験の向上およびアクセス解析のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることが可能ですが、一部の機能が利用できなくなる場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. 個人情報の管理</h2>
          <p>
            当サイトは、収集した個人情報の漏洩・滅失・毀損の防止のため、適切なセキュリティ対策を講じます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. プライバシーポリシーの変更</h2>
          <p>
            当サイトは、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは、当ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
