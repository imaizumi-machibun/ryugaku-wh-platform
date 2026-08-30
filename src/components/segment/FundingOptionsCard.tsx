import type { SegmentFundingNotes } from '@/lib/segments/types';

type Props = {
  notes?: SegmentFundingNotes;
  className?: string;
};

const DEFAULT_NOTES: SegmentFundingNotes = {
  scholarships: [
    'JASSO（日本学生支援機構）— 給付型/貸与型（第二種）',
    'トビタテ留学JAPAN — 給付型・大学生/高校生対象',
    'Fulbright（米国）— 大学院・研究者向け、競争率高',
    'Chevening（英国）— 修士・1年間・帰国義務あり',
    'DAAD（独）— ドイツ語学修士・博士',
    '経団連グローバル人材育成スカラシップ',
    '船井情報科学振興財団',
  ],
  loans: [
    '日本政策金融公庫「教育一般貸付」— 最大450万円（海外留学）',
    '銀行系教育ローン（オリコ・三井住友信託など）— 500〜1,000万円超も可',
    'JASSO第二種奨学金（貸与型・有利子）',
  ],
  selfFundingTip: '自己資金は学費＋初期6ヶ月分の生活費を最低ラインに。為替変動±5%のバッファを必ず確保。',
};

export default function FundingOptionsCard({ notes, className = '' }: Props) {
  const data: SegmentFundingNotes = {
    scholarships: notes?.scholarships ?? DEFAULT_NOTES.scholarships,
    loans: notes?.loans ?? DEFAULT_NOTES.loans,
    selfFundingTip: notes?.selfFundingTip ?? DEFAULT_NOTES.selfFundingTip,
  };

  return (
    <section className={`bg-amber-50 border border-amber-100 rounded-xl p-5 ${className}`}>
      <h3 className="font-bold text-base text-amber-900 mb-3">資金計画の3本柱</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-bold text-amber-800 mb-2">給付型奨学金</p>
          <ul className="text-xs text-gray-800 space-y-1.5">
            {data.scholarships?.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-600 mt-0.5 shrink-0" aria-hidden="true">
                  ▸
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-amber-800 mb-2">教育ローン・貸与型</p>
          <ul className="text-xs text-gray-800 space-y-1.5">
            {data.loans?.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-600 mt-0.5 shrink-0" aria-hidden="true">
                  ▸
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-amber-800 mb-2">自己資金のポイント</p>
          <p className="text-xs text-gray-800 leading-relaxed">{data.selfFundingTip}</p>
        </div>
      </div>
    </section>
  );
}
