import type { Country } from '../microcms/types';
import { formatJPY, formatDuration } from '../utils/format';

/**
 * 国データからFAQを自動生成
 */
export function generateCountryFAQs(country: Country): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];

  // ビザ年齢制限
  if (country.visaAgeMin != null && country.visaAgeMax != null) {
    faqs.push({
      question: `${country.nameJp}のワーキングホリデービザに年齢制限はありますか？`,
      answer: `${country.nameJp}のワーキングホリデービザは${country.visaAgeMin}歳から${country.visaAgeMax}歳までの方が申請可能です。`,
    });
  }

  // 滞在期間
  if (country.visaDurationMonths) {
    faqs.push({
      question: `${country.nameJp}のワーキングホリデーではどのくらい滞在できますか？`,
      answer: `${country.nameJp}のワーキングホリデービザでは最大${formatDuration(country.visaDurationMonths)}滞在することができます。${country.visaRenewable ? 'ビザの延長も可能です。' : ''}`,
    });
  }

  // ビザ費用
  if (country.visaCostJpy) {
    faqs.push({
      question: `${country.nameJp}のワーキングホリデービザの費用はいくらですか？`,
      answer: `${country.nameJp}のワーキングホリデービザの申請費用は${formatJPY(country.visaCostJpy)}です。`,
    });
  }

  // 生活費
  if (country.livingCostMonthJpy) {
    faqs.push({
      question: `${country.nameJp}での1ヶ月の生活費はどのくらいですか？`,
      answer: `${country.nameJp}での平均的な月間生活費は${formatJPY(country.livingCostMonthJpy)}程度です。${country.avgRentMonthlyJpy ? `家賃は平均${formatJPY(country.avgRentMonthlyJpy)}です。` : ''}`,
    });
  }

  // 就労制限
  if (country.visaWorkLimit) {
    faqs.push({
      question: `${country.nameJp}のワーキングホリデーで働くことはできますか？`,
      answer: `はい、${country.nameJp}のワーキングホリデービザでは就労が可能です。${country.visaWorkLimit}`,
    });
  }

  // 就学制限
  if (country.visaStudyLimit) {
    faqs.push({
      question: `${country.nameJp}のワーキングホリデーで学校に通えますか？`,
      answer: `${country.nameJp}のワーキングホリデービザでは、${country.visaStudyLimit}`,
    });
  }

  // 最低賃金
  if (country.minimumWageLocal) {
    faqs.push({
      question: `${country.nameJp}の最低賃金はいくらですか？`,
      answer: `${country.nameJp}の最低賃金は${country.minimumWageLocal}です。`,
    });
  }

  // フライト時間
  if (country.flightTimeHours) {
    faqs.push({
      question: `日本から${country.nameJp}へのフライト時間はどのくらいですか？`,
      answer: `日本から${country.nameJp}への直行便で約${country.flightTimeHours}時間です。`,
    });
  }

  return faqs;
}
