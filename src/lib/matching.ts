// ============================================================
// 国診断ツール（/matching）のスコアリングロジック
// 5問の回答から上位3カ国を推薦する
// ============================================================

export type AnswerKey =
  | 'purpose'
  | 'duration'
  | 'budget'
  | 'safety'
  | 'language';

export type MatchingAnswer = {
  question: AnswerKey;
  value: string;
};

export type MatchingResult = {
  countrySlug: string;
  countryName: string;
  flagEmoji: string;
  score: number;
  reasons: string[];
};

// 質問定義
export const MATCHING_QUESTIONS = [
  {
    key: 'purpose' as AnswerKey,
    question: 'ワーホリ・留学の主な目的は？',
    options: [
      { value: 'english', label: '英語力を本気で伸ばしたい' },
      { value: 'career', label: '海外でのキャリア経験を積みたい' },
      { value: 'save', label: '稼ぎながらリゾートで楽しみたい' },
      { value: 'culture', label: '文化体験・旅・自分探し' },
    ],
  },
  {
    key: 'duration' as AnswerKey,
    question: 'どのくらいの期間滞在したいですか？',
    options: [
      { value: 'short', label: '3ヶ月以内' },
      { value: 'mid', label: '半年程度' },
      { value: 'long', label: '1年' },
      { value: 'extra', label: '1年以上（ビザ延長含む）' },
    ],
  },
  {
    key: 'budget' as AnswerKey,
    question: '月の生活費はどのくらいまで出せますか？',
    options: [
      { value: 'low', label: '月15万円以下に抑えたい' },
      { value: 'mid', label: '月15〜25万円' },
      { value: 'high', label: '月25万円以上でもOK' },
    ],
  },
  {
    key: 'safety' as AnswerKey,
    question: '治安・安心感は重視しますか？',
    options: [
      { value: 'high', label: 'はい、最重要視したい' },
      { value: 'normal', label: '普通レベルでOK' },
    ],
  },
  {
    key: 'language' as AnswerKey,
    question: '英語圏にこだわりますか？',
    options: [
      { value: 'english-only', label: '英語圏のみ希望' },
      { value: 'asia-ok', label: 'アジア圏でもOK' },
      { value: 'any', label: '特に問わない' },
    ],
  },
];

// 9カ国の特性プロファイル
type CountryProfile = {
  slug: string;
  name: string;
  flag: string;
  // 各属性ごとのマッチ度（0-3）
  english: number; // 英語学習向き
  career: number; // キャリア向き
  save: number; // 稼ぎやすさ
  culture: number; // 文化体験
  // 期間適性
  shortStay: number;
  longStay: number;
  // 予算（月生活費感覚）
  budgetLow: number; // 低予算で行ける度
  budgetMid: number;
  budgetHigh: number;
  // 治安
  safety: number; // 0-3
  // 言語環境
  englishImmersion: number; // 0-3
  isAsia: boolean;
  // 説明文素材
  highlights: string[];
};

const COUNTRY_PROFILES: CountryProfile[] = [
  {
    slug: 'australia',
    name: 'オーストラリア',
    flag: '🇦🇺',
    english: 3,
    career: 3,
    save: 3,
    culture: 2,
    shortStay: 2,
    longStay: 3,
    budgetLow: 1,
    budgetMid: 2,
    budgetHigh: 3,
    safety: 3,
    englishImmersion: 3,
    isAsia: false,
    highlights: ['最低賃金が高く現地で稼ぎやすい', 'ビザ延長で最大3年滞在可能', '英語環境が整っている'],
  },
  {
    slug: 'canada',
    name: 'カナダ',
    flag: '🇨🇦',
    english: 3,
    career: 3,
    save: 2,
    culture: 2,
    shortStay: 2,
    longStay: 3,
    budgetLow: 1,
    budgetMid: 2,
    budgetHigh: 3,
    safety: 3,
    englishImmersion: 3,
    isAsia: false,
    highlights: ['治安が良くシェアハウス文化が成熟', 'IT・ヘルスケア求人が豊富', 'フレンチも学べる地域あり'],
  },
  {
    slug: 'new-zealand',
    name: 'ニュージーランド',
    flag: '🇳🇿',
    english: 3,
    career: 2,
    save: 2,
    culture: 3,
    shortStay: 2,
    longStay: 3,
    budgetLow: 2,
    budgetMid: 3,
    budgetHigh: 2,
    safety: 3,
    englishImmersion: 3,
    isAsia: false,
    highlights: ['自然豊かで治安が良好', '農業・観光業の季節求人が多い', 'のんびり過ごしたい人に最適'],
  },
  {
    slug: 'ireland',
    name: 'アイルランド',
    flag: '🇮🇪',
    english: 3,
    career: 3,
    save: 2,
    culture: 3,
    shortStay: 2,
    longStay: 2,
    budgetLow: 2,
    budgetMid: 3,
    budgetHigh: 2,
    safety: 3,
    englishImmersion: 3,
    isAsia: false,
    highlights: ['ヨーロッパで英語圏', '欧米IT企業の欧州本社が集積', '陽気な国民性で日本人にもフレンドリー'],
  },
  {
    slug: 'united-kingdom',
    name: 'イギリス',
    flag: '🇬🇧',
    english: 3,
    career: 3,
    save: 2,
    culture: 3,
    shortStay: 2,
    longStay: 3,
    budgetLow: 0,
    budgetMid: 1,
    budgetHigh: 3,
    safety: 3,
    englishImmersion: 3,
    isAsia: false,
    highlights: ['ヨーロッパ各国へのアクセス◎', '本場のクイーンズ・イングリッシュ', '歴史・芸術・音楽の宝庫'],
  },
  {
    slug: 'malta',
    name: 'マルタ',
    flag: '🇲🇹',
    english: 3,
    career: 1,
    save: 1,
    culture: 3,
    shortStay: 3,
    longStay: 1,
    budgetLow: 2,
    budgetMid: 3,
    budgetHigh: 2,
    safety: 3,
    englishImmersion: 3,
    isAsia: false,
    highlights: ['英語圏のリゾート国', '日本人が少なく英語漬けになれる', 'EU圏内の旅行拠点に最適'],
  },
  {
    slug: 'philippines',
    name: 'フィリピン',
    flag: '🇵🇭',
    english: 3,
    career: 1,
    save: 1,
    culture: 2,
    shortStay: 3,
    longStay: 1,
    budgetLow: 3,
    budgetMid: 2,
    budgetHigh: 1,
    safety: 2,
    englishImmersion: 3,
    isAsia: true,
    highlights: ['マンツーマン語学学校が充実', '物価が安く滞在費を抑えやすい', '短期集中で英語力を伸ばせる'],
  },
  {
    slug: 'taiwan',
    name: '台湾',
    flag: '🇹🇼',
    english: 1,
    career: 2,
    save: 2,
    culture: 3,
    shortStay: 3,
    longStay: 2,
    budgetLow: 3,
    budgetMid: 2,
    budgetHigh: 1,
    safety: 3,
    englishImmersion: 1,
    isAsia: true,
    highlights: ['日本から近く時差が少ない', '中国語（北京語）が学べる', '親日的で生活しやすい'],
  },
  {
    slug: 'south-korea',
    name: '韓国',
    flag: '🇰🇷',
    english: 1,
    career: 2,
    save: 2,
    culture: 3,
    shortStay: 3,
    longStay: 2,
    budgetLow: 2,
    budgetMid: 3,
    budgetHigh: 1,
    safety: 3,
    englishImmersion: 1,
    isAsia: true,
    highlights: ['韓国語が学べる', 'K-POP・コスメ・カフェ文化好きに人気', '日本から短時間でアクセス可'],
  },
];

export function scoreCountries(answers: Record<AnswerKey, string>): MatchingResult[] {
  return COUNTRY_PROFILES.map((p) => {
    let score = 0;
    const reasons: string[] = [];

    // 目的スコア
    const purpose = answers.purpose;
    if (purpose === 'english') {
      score += p.english * 3;
      if (p.english === 3) reasons.push('英語学習に最適な英語ネイティブ環境');
    } else if (purpose === 'career') {
      score += p.career * 3;
      if (p.career === 3) reasons.push('海外キャリア構築の選択肢が豊富');
    } else if (purpose === 'save') {
      score += p.save * 3;
      if (p.save === 3) reasons.push('現地での稼ぎやすさが圧倒的');
    } else if (purpose === 'culture') {
      score += p.culture * 3;
      if (p.culture === 3) reasons.push('歴史・文化体験が魅力的');
    }

    // 期間スコア
    const duration = answers.duration;
    if (duration === 'short' || duration === 'mid') {
      score += p.shortStay * 2;
    } else {
      score += p.longStay * 2;
      if (p.longStay === 3) reasons.push('長期滞在・ビザ延長の選択肢あり');
    }

    // 予算スコア
    const budget = answers.budget;
    if (budget === 'low') {
      score += p.budgetLow * 3;
      if (p.budgetLow === 3) reasons.push('低予算でも生活しやすい');
    } else if (budget === 'mid') {
      score += p.budgetMid * 2;
    } else {
      score += p.budgetHigh * 2;
    }

    // 治安スコア
    const safety = answers.safety;
    if (safety === 'high') {
      score += p.safety * 3;
      if (p.safety === 3) reasons.push('治安レベルが高く安心して滞在可能');
    } else {
      score += p.safety * 1;
    }

    // 言語環境スコア
    const language = answers.language;
    if (language === 'english-only') {
      score += p.englishImmersion * 3;
      if (p.isAsia) score -= 5;
    } else if (language === 'asia-ok') {
      score += p.englishImmersion * 1;
      if (p.isAsia) score += 3;
    }
    // 'any' は加算なし

    // 国固有のハイライトを最大2件追加
    p.highlights.forEach((h) => {
      if (reasons.length < 3) reasons.push(h);
    });

    return {
      countrySlug: p.slug,
      countryName: p.name,
      flagEmoji: p.flag,
      score,
      reasons: reasons.slice(0, 3),
    };
  })
    .sort((a, b) => b.score - a.score);
}
