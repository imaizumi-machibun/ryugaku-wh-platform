import type { ArticleCategory } from '@/lib/microcms/types';

// ============================================================
// 状況別ガイド（トップページ SituationGuide）のキュレーションデータ。
// 主力記事の多くは microCMS ではなく静的ルート（/no-english 等）のため、
// ここを「状況タグ付きの記事メタ」の正本として手キュレーションする。
// slug の正本は src/lib/sitemap/sources.ts の getStaticEntries()。
// 新しい静的記事を作ったらここにも追記する。
// ============================================================

export type SituationAxis = 'purpose' | 'concern' | 'journey';

// 目的別
export type PurposeTag = 'language' | 'working-holiday' | 'degree' | 'internship' | 'family';
// 悩み・属性別
export type ConcernTag = 'no-english' | 'low-budget' | 'over-30' | 'women' | 'first-time' | 'quit-job';
// ジャーニー段階別
export type JourneyTag = 'research' | 'visa-cost' | 'prep' | 'onsite' | 'return-career';

export type SituationTag = PurposeTag | ConcernTag | JourneyTag;

export type GuideArticle = {
  /** 遷移先（静的記事は '/no-english' のような絶対パス） */
  href: string;
  title: string;
  description: string;
  /** カードの色・アイコン決定に使う */
  category: ArticleCategory;
  /** 複数の状況軸に出せる */
  tags: SituationTag[];
  /** タブ内の表示順（小さいほど上） */
  priority?: number;
};

// タブ（軸）と、その中の中分類（状況タグ）の定義
export const SITUATION_TABS: {
  axis: SituationAxis;
  label: string;
  groups: { tag: SituationTag; label: string }[];
}[] = [
  {
    axis: 'purpose',
    label: '目的から',
    groups: [
      { tag: 'language', label: '語学留学' },
      { tag: 'working-holiday', label: 'ワーキングホリデー' },
      { tag: 'degree', label: '大学・大学院' },
      { tag: 'internship', label: 'インターン・キャリア' },
      { tag: 'family', label: '親子・家族' },
    ],
  },
  {
    axis: 'concern',
    label: '悩みから',
    groups: [
      { tag: 'no-english', label: '英語に自信がない' },
      { tag: 'low-budget', label: '予算が少ない' },
      { tag: 'over-30', label: '30代から' },
      { tag: 'women', label: '女性ひとり' },
      { tag: 'first-time', label: 'はじめて・不安' },
      { tag: 'quit-job', label: '仕事を辞めて' },
    ],
  },
  {
    axis: 'journey',
    label: '準備の段階から',
    groups: [
      { tag: 'research', label: '情報収集・国選び' },
      { tag: 'visa-cost', label: 'ビザ・費用' },
      { tag: 'prep', label: '出発準備' },
      { tag: 'onsite', label: '現地での仕事・生活' },
      { tag: 'return-career', label: '帰国・キャリア' },
    ],
  },
];

export const GUIDE_ARTICLES: GuideArticle[] = [
  // 悩み・属性別
  { href: '/no-english', title: '英語に自信がなくても大丈夫', description: '英語ゼロから始める国選び・仕事・準備のコツ。', category: 'language', tags: ['no-english', 'first-time', 'language'], priority: 1 },
  { href: '/wh-budget-100man', title: '予算100万円のワーホリ', description: '100万円で渡航するための費用配分と国選び。', category: 'cost', tags: ['low-budget', 'working-holiday', 'visa-cost'], priority: 1 },
  { href: '/regret', title: 'ワーホリで後悔しないために', description: '経験者が語る「やっておけばよかった」と回避策。', category: 'other', tags: ['first-time'], priority: 1 },
  { href: '/women', title: '女性の留学・ワーホリガイド', description: '安全・お金・仕事、女性ならではの不安に回答。', category: 'other', tags: ['women', 'first-time'], priority: 1 },
  { href: '/wh-female-safety', title: '女性の海外安全対策', description: '治安・トラブル回避の実践ガイド。', category: 'other', tags: ['women'], priority: 2 },
  { href: '/30s-guide', title: '30代から始めるワーホリ・留学', description: '年齢制限・キャリア両立・国選びを徹底解説。', category: 'other', tags: ['over-30'], priority: 1 },
  { href: '/wh-after-30', title: '30歳を過ぎても間に合うワーホリ', description: '31歳以降でも申請できる国と戦略。', category: 'visa', tags: ['over-30', 'visa-cost'], priority: 2 },
  { href: '/wh-after-30-no-experience', title: '30代・未経験からの海外挑戦', description: 'キャリアチェンジを成功させる進め方。', category: 'other', tags: ['over-30'], priority: 3 },
  { href: '/quit-job-wh', title: '仕事を辞めてワーホリへ', description: '退職タイミング・お金・復職の不安に回答。', category: 'other', tags: ['quit-job', 'first-time'], priority: 1 },
  { href: '/wh-anxiety-and-persuasion', title: '出発前の不安と親の説得', description: '家族への伝え方と不安の解消法。', category: 'other', tags: ['first-time'], priority: 3 },
  { href: '/fresh-grad-wh', title: '新卒でワーホリという選択', description: '就職とワーホリ、後悔しない選び方。', category: 'other', tags: ['first-time', 'working-holiday'], priority: 2 },

  // 目的別（語学）
  { href: '/short-term-study', title: '短期留学のすべて', description: '1〜3ヶ月で行く語学留学の費用と国選び。', category: 'language', tags: ['language'], priority: 1 },
  { href: '/language-school-ranking', title: '語学学校の選び方7基準', description: '失敗しない学校選びの判断軸を解説。', category: 'language', tags: ['language', 'research'], priority: 2 },
  { href: '/cebu-study-real-cost', title: 'セブ島留学のリアルな費用', description: 'フィリピン留学の総額と内訳を公開。', category: 'cost', tags: ['language', 'low-budget'], priority: 3 },
  { href: '/korea-study', title: '韓国 語学留学ガイド', description: 'ソウルの語学堂・費用・ビザを解説。', category: 'language', tags: ['language'], priority: 4 },
  { href: '/malta-study', title: 'マルタ留学ガイド', description: '地中海の多国籍環境で英語を学ぶ。', category: 'language', tags: ['language'], priority: 5 },

  // 目的別（大学・大学院 / インターン / 家族）
  { href: '/wh-overseas-university', title: '海外大学・大学院への進学', description: '正規留学で学位を取るルートを解説。', category: 'preparation', tags: ['degree'], priority: 1 },
  { href: '/wh-internship', title: '海外インターンシップ', description: '実務経験を積むインターンの探し方。', category: 'job', tags: ['internship'], priority: 1 },
  { href: '/wh-tech-engineer', title: 'エンジニアの海外就職・ワーホリ', description: 'IT人材が海外でキャリアを築く道。', category: 'job', tags: ['internship', 'working-holiday'], priority: 2 },
  { href: '/family-study', title: '親子留学ガイド', description: '子連れ留学の費用・学校・滞在先。', category: 'preparation', tags: ['family'], priority: 1 },
  { href: '/couple-wh', title: 'カップル・夫婦のワーホリ', description: '二人で行くための準備とお金の話。', category: 'other', tags: ['family'], priority: 2 },

  // ジャーニー段階別（情報収集）
  { href: '/au-vs-canada', title: 'オーストラリア vs カナダ', description: '人気2カ国を費用・仕事・気候で比較。', category: 'other', tags: ['research', 'working-holiday'], priority: 1 },
  { href: '/us-vs-canada', title: 'アメリカ vs カナダ', description: '留学先としての違いを徹底比較。', category: 'other', tags: ['research'], priority: 2 },
  { href: '/agent-comparison', title: '留学エージェントの比較', description: '無料・有料エージェントの選び方。', category: 'other', tags: ['research'], priority: 3 },

  // ジャーニー段階別（ビザ・費用）
  { href: '/scholarship-wh', title: '留学・ワーホリの奨学金', description: '使える支援制度と費用計画を解説。', category: 'cost', tags: ['visa-cost', 'low-budget'], priority: 1 },
  { href: '/canada-iec-visa', title: 'カナダ ワーホリ（IEC）ビザ', description: '申請の流れと必要書類を解説。', category: 'visa', tags: ['visa-cost', 'working-holiday'], priority: 2 },
  { href: '/uk-yms-visa-guide', title: 'イギリス YMS ビザ完全ガイド', description: '抽選の仕組みと申請のコツ。', category: 'visa', tags: ['visa-cost'], priority: 3 },
  { href: '/banking-overseas', title: '海外の銀行口座・送金の基本', description: 'お金の管理と送金方法をやさしく。', category: 'other', tags: ['visa-cost', 'prep'], priority: 4 },

  // ジャーニー段階別（出発準備）
  { href: '/pre-departure-checklist', title: '出発前チェックリスト', description: '渡航前にやるべき手続き・持ち物。', category: 'preparation', tags: ['prep', 'first-time'], priority: 1 },
  { href: '/packing', title: '持ち物・パッキング完全版', description: '何を持っていくべきかを総まとめ。', category: 'preparation', tags: ['prep'], priority: 2 },
  { href: '/homestay-guide', title: 'ホームステイ完全ガイド', description: '滞在の流れとトラブル回避法。', category: 'housing', tags: ['prep'], priority: 3 },
  { href: '/international-driving-permit', title: '国際運転免許の取り方', description: '取得手順と使える国を解説。', category: 'preparation', tags: ['prep'], priority: 4 },

  // ジャーニー段階別（現地での仕事・生活）
  { href: '/australia-jobs', title: '現地での仕事の探し方', description: '到着後の仕事探しとTFN手続き。', category: 'job', tags: ['onsite', 'working-holiday'], priority: 1 },
  { href: '/sydney-sharehouse', title: 'シェアハウスの探し方', description: 'シドニーの家探しとトラブル回避。', category: 'housing', tags: ['onsite'], priority: 2 },
  { href: '/au-second-year-visa', title: 'セカンドビザの取り方', description: '88日就労の条件と進め方。', category: 'visa', tags: ['onsite'], priority: 3 },

  // ジャーニー段階別（帰国・キャリア）
  { href: '/wh-job-hunting-japan', title: '帰国後の就職活動', description: 'ワーホリ経験を活かす再就職。', category: 'job', tags: ['return-career'], priority: 1 },
  { href: '/after-wh', title: 'ワーホリ後のキャリア', description: '帰国後の選択肢を整理する。', category: 'other', tags: ['return-career', 'quit-job'], priority: 2 },
  { href: '/tax-return', title: '税金・タックスリターン', description: '現地と帰国後の税手続きを解説。', category: 'other', tags: ['return-career'], priority: 3 },
  { href: '/english-resume-guide', title: '英語履歴書の書き方', description: '海外就職に通るレジュメの作り方。', category: 'job', tags: ['return-career', 'onsite'], priority: 4 },
];

/** 指定した状況タグの記事を priority 順で取得する */
export function getGuideArticlesByTag(tag: SituationTag, limit = 6): GuideArticle[] {
  return GUIDE_ARTICLES.filter((a) => a.tags.includes(tag))
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .slice(0, limit);
}
