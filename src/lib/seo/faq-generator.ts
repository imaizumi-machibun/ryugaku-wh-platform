import type { Country } from '../microcms/types';
import { formatJPY, formatDuration } from '../utils/format';

/**
 * popularCities から例示に使う都市名を取り出すヘルパー
 */
function pickExampleCities(country: Country): { city1?: string; city2?: string } {
  const cities = country.popularCities || [];
  return {
    city1: cities[0]?.cityName,
    city2: cities[1]?.cityName,
  };
}

/**
 * 末尾に句点がない文字列に句点を付ける（後続の例文と繋ぐため）
 */
function withSentenceEnd(text: string): string {
  if (!text) return text;
  const last = text.slice(-1);
  const terminators = ['。', '．', '.', '！', '!', '？', '?'];
  return terminators.includes(last) ? text : `${text}。`;
}

/**
 * 国データからFAQを自動生成
 */
export function generateCountryFAQs(country: Country): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const { city1, city2 } = pickExampleCities(country);
  const twoCities = city1 && city2 ? `${city1}や${city2}` : '';
  const oneCity = city1 || '';

  // ビザ年齢制限
  if (country.visaAgeMin != null && country.visaAgeMax != null) {
    const regional = twoCities
      ? `この年齢条件は国内で統一されており、例えば${twoCities}など、どの都市を目的地とする場合でも同じ基準で判断されます。`
      : oneCity
      ? `この年齢条件は国内で統一されており、例えば${oneCity}を拠点とする場合も同じ基準で判断されます。`
      : '';
    faqs.push({
      question: `${country.nameJp}のワーキングホリデービザに年齢制限はありますか？`,
      answer: `${country.nameJp}のワーキングホリデービザは${country.visaAgeMin}歳から${country.visaAgeMax}歳までの方が申請可能です。${regional}`,
    });
  }

  // 滞在期間
  if (country.visaDurationMonths) {
    const regional =
      city1 && city2
        ? `拠点にする都市によって期間が変わることはなく、例えば${city1}で前半を過ごしたあと${city2}へ移動して後半を過ごす、といった形でも合計の滞在期間はこの範囲内となります。`
        : oneCity
        ? `例えば${oneCity}を拠点にする場合も、途中で別の都市へ移動する場合も、合計の滞在期間はこの範囲内です。`
        : '';
    faqs.push({
      question: `${country.nameJp}のワーキングホリデーではどのくらい滞在できますか？`,
      answer: `${country.nameJp}のワーキングホリデービザでは最大${formatDuration(country.visaDurationMonths)}滞在することができます。${country.visaRenewable ? 'ビザの延長も可能です。' : ''}${regional}`,
    });
  }

  // ビザ費用
  if (country.visaCostJpy) {
    const regional = twoCities
      ? `この申請費用は渡航先の都市に関係なく共通で、例えば${twoCities}のどちらを目的地にしても同じ金額がかかります。`
      : oneCity
      ? `この申請費用は渡航先の都市に関係なく共通で、例えば${oneCity}を目的地にする場合も同じ金額がかかります。`
      : '';
    faqs.push({
      question: `${country.nameJp}のワーキングホリデービザの費用はいくらですか？`,
      answer: `${country.nameJp}のワーキングホリデービザの申請費用は${formatJPY(country.visaCostJpy)}です。${regional}`,
    });
  }

  // 生活費
  if (country.livingCostMonthJpy) {
    const rentPart = country.avgRentMonthlyJpy ? `家賃は平均${formatJPY(country.avgRentMonthlyJpy)}です。` : '';
    const regional =
      city1 && city2
        ? `ただしこの金額は全国平均で、拠点にする都市によって実際の支出は変わります。例えば${city1}のような中心都市では家賃や外食費が相場を押し上げやすく、${city2}など別の都市では内訳が変わってくるため、どのエリアで生活するかによって月々の生活費は前後します。`
        : oneCity
        ? `ただしこの金額は全国平均で、例えば${oneCity}のような主要都市と地方都市では実際の支出が変わります。拠点にするエリアによって月々の生活費は前後する点にご注意ください。`
        : '';
    faqs.push({
      question: `${country.nameJp}での1ヶ月の生活費はどのくらいですか？`,
      answer: `${country.nameJp}での平均的な月間生活費は${formatJPY(country.livingCostMonthJpy)}程度です。${rentPart}${regional}`,
    });
  }

  // 就労制限
  if (country.visaWorkLimit) {
    const regional =
      city1 && city2
        ? `例えば${city1}で働いたあと${city2}へ移動して別の職場で働く、といった移動を伴う就労もこの条件の範囲内で行えます。`
        : oneCity
        ? `例えば${oneCity}で働く場合も、他の都市に移動して働く場合も、この条件が共通で適用されます。`
        : '';
    faqs.push({
      question: `${country.nameJp}のワーキングホリデーで働くことはできますか？`,
      answer: `はい、${country.nameJp}のワーキングホリデービザでは就労が可能です。${withSentenceEnd(country.visaWorkLimit)}${regional}`,
    });
  }

  // 就学制限
  if (country.visaStudyLimit) {
    const regional = twoCities
      ? `この条件は国内共通のため、例えば${twoCities}など、どの都市の語学学校を選んでも同じ期間までとなります。`
      : oneCity
      ? `この条件は国内共通のため、例えば${oneCity}の語学学校を選んでも同じ期間までとなります。`
      : '';
    faqs.push({
      question: `${country.nameJp}のワーキングホリデーで学校に通えますか？`,
      answer: `${country.nameJp}のワーキングホリデービザでは、${withSentenceEnd(country.visaStudyLimit)}${regional}`,
    });
  }

  // 最低賃金
  if (country.minimumWageLocal) {
    const regional =
      city1 && city2
        ? `これは全国一律の法定下限ですが、実際の求人時給は働くエリアや業種によって上下します。例えば${city1}や${city2}のような主要都市では、生活費に合わせて相場が高めに設定される求人も見られます。`
        : oneCity
        ? `これは全国一律の法定下限で、例えば${oneCity}のような主要都市では生活費に合わせて実際の時給が上下することがあります。`
        : '';
    faqs.push({
      question: `${country.nameJp}の最低賃金はいくらですか？`,
      answer: `${country.nameJp}の最低賃金は${country.minimumWageLocal}です。${regional}`,
    });
  }

  // フライト時間
  if (country.flightTimeHours) {
    const regional =
      city1 && city2
        ? `ただしこの時間は目安で、到着都市によって所要時間は前後します。例えば${city1}への直行便を使う場合と、${city2}を最終目的地とする場合では、乗り継ぎの有無や便によって実際の所要時間が変わります。`
        : oneCity
        ? `ただしこれは目安で、例えば${oneCity}を最終目的地にする場合でも、直行便を使うか乗り継ぎ便を使うかで所要時間は変わります。`
        : '';
    faqs.push({
      question: `日本から${country.nameJp}へのフライト時間はどのくらいですか？`,
      answer: `日本から${country.nameJp}への直行便で約${country.flightTimeHours}時間です。${regional}`,
    });
  }

  return faqs;
}
