import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';

export const metadata: Metadata = {
  title: 'アンケート調査について',
  description:
    'Study Work Hubに掲載している体験談データの収集方法（アンケート調査）と、その集計・公開についてご説明します。',
};

export default function SurveyPage() {
  return (
    <div className="container-custom py-12">
      <Breadcrumb items={[{ label: 'アンケート調査について' }]} />

      <h1 className="text-3xl font-bold mb-8">アンケート調査について</h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <p>
          Study Work Hub（以下「当サイト」）では、留学・ワーキングホリデー経験者のリアルな声をお届けするため、クラウドソーシングサービス「ランサーズ」を通じてアンケート調査を実施しています。これまでに2回の調査で、合計77名の方からご回答をいただきました。
        </p>

        <p>
          収集した体験談は、回答内容の確認・校正を行ったうえで当サイトに掲載するとともに、統計データとして集計し、
          <Link href="/research" className="text-primary-700 hover:underline">
            ワーホリ・留学実態調査2026
          </Link>
          として公開しています。
        </p>

        <section>
          <h2 className="text-xl font-bold mb-4">調査概要</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                    項目
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                    第1回
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                    第2回
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                    第3回
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium">
                    調査方法
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    インターネットアンケート
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    インターネットアンケート
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    インターネットアンケート
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium">
                    調査媒体
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    ランサーズ
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    ランサーズ
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    ランサーズ
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium">
                    調査対象
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    留学・ワーキングホリデー経験者
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    留学・ワーキングホリデー経験者
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    留学・ワーキングホリデー経験者
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium">
                    調査期間
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    2026年3月20日〜2026年4月3日
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    2026年4月16日〜2026年4月30日
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    2026年6月26日〜2026年7月10日
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium">
                    回答数
                  </td>
                  <td className="border border-gray-200 px-4 py-3">42件</td>
                  <td className="border border-gray-200 px-4 py-3">35件</td>
                  <td className="border border-gray-200 px-4 py-3">21件</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">調査内容</h2>
          <p>アンケートでは、以下の項目について回答をお願いしています。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>渡航先の国・滞在都市・通った学校名</li>
            <li>出発時の年齢・性別・滞在期間</li>
            <li>
              6項目の満足度評価（総合満足度・治安・仕事の見つけやすさ・コストパフォーマンス・生活の充実度・語学力の伸び）
            </li>
            <li>月々の生活費・家賃・食費・収入</li>
            <li>出発前・帰国後の語学レベル</li>
            <li>良かった点・大変だった点・体験談・アドバイス</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">集計・公開について</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              回答は、設問ごとに件数（n）を明示したうえで統計集計し、費用相場・語学力の伸び・満足度などのデータとして公開しています。
            </li>
            <li>
              サンプル数が極端に少ない国（n&lt;3）は、ランキング等から除外しています。
            </li>
            <li>
              公開している数値・グラフは、出典の明記とリンクを添えていただければ、報道・教育・研究目的を含め自由にご利用いただけます。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">掲載にあたって</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              回答内容に明らかな誤りがある場合は、事実関係を確認のうえ修正を行っています。
            </li>
            <li>
              個人が特定される情報は掲載しておりません。投稿者名はニックネームで表示しています。
            </li>
            <li>
              掲載されている体験談は個人の感想であり、すべての方に当てはまるものではありません。
            </li>
          </ul>
        </section>

        <section className="not-prose bg-sky-50 border border-sky-100 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2 text-sky-900">調査結果を公開しています</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            集めた体験談データを集計し、国別の費用相場・語学力の伸び・満足度・年代別の傾向などをまとめました。
          </p>
          <Link
            href="/research"
            className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            ワーホリ・留学実態調査2026を見る →
          </Link>
        </section>
      </div>
    </div>
  );
}
