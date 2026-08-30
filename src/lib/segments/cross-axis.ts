// ============================================================
// 横断ナビ（他の切り口で探す）
// 絞り込み軸ページ同士（予算 / 期間 / 年代 / 職種 / 目的）を
// 相互リンクし、サイト内の回遊と内部リンクの受け渡しを強化する。
// SegmentRelatedLinks の crossAxis プロパティから利用する。
// ============================================================

import type { SegmentType } from './types';

export type AxisHub = {
  // SegmentType と揃えたキー（現在いる軸を除外するために使う）
  key: SegmentType;
  label: string;
  href: string;
  description: string;
};

// グローバルなインデックスページを持つ「切り口」だけを並べる。
// purpose はグローバル一覧がないため、目的別に診断できる /matching を充てる。
export const AXIS_HUBS: AxisHub[] = [
  {
    key: 'budget',
    label: '予算から探す',
    href: '/budget',
    description: '使える予算から国・期間を逆算する',
  },
  {
    key: 'duration',
    label: '期間から探す',
    href: '/duration',
    description: '2週間〜1年、滞在期間で選ぶ',
  },
  {
    key: 'age',
    label: '年代から探す',
    href: '/age',
    description: '20代前半〜30代、年代別のリアル',
  },
  {
    key: 'occupation',
    label: '職種から探す',
    href: '/jobs',
    description: '看護師・エンジニアなど職種別の進路',
  },
  {
    key: 'purpose',
    label: '目的から探す',
    href: '/matching',
    description: '語学・ワーホリ・進学など目的で診断',
  },
];

export type CrossAxisLink = {
  label: string;
  href: string;
  description: string;
};

/**
 * 現在いる軸（currentAxis）を除いた「他の切り口で探す」リンク群を返す。
 * currentAxis がハブに該当しない場合（city / cost など）は全ハブを返す。
 */
export function buildCrossAxisLinks(currentAxis?: SegmentType): CrossAxisLink[] {
  return AXIS_HUBS.filter((hub) => hub.key !== currentAxis).map((hub) => ({
    label: hub.label,
    href: hub.href,
    description: hub.description,
  }));
}
