import type {
  Experience,
  ExperienceClassificationStatus,
  ExperiencePrimaryPurpose,
  ExperienceStudyType,
} from '@/lib/microcms/types';

export type ReviewedExperienceClassification = {
  primaryPurpose: ExperiencePrimaryPurpose;
  secondaryPurposes: ExperiencePrimaryPurpose[];
  studyType?: ExperienceStudyType;
  visaOrPermit?: string;
  classificationStatus: ExperienceClassificationStatus;
  classificationNote: string;
};

// 2026-08-27時点の公開94件を、本文と回答属性を1件ずつ確認した固定母集団。
// IDがここにない既存レコードや新規投稿は、確認完了まで目的別一覧へ出さない。
export const REVIEWED_EXPERIENCE_IDS = [
  '2n0adqmmxbe', 'z4-mpgair4', 'v6a13ncnx871', '4ntxzs33_wgx', 'tyiibax_3s0',
  '8nbi2thglp', 'pqjb44zngy', 'qx83421-zp', 'aw9jnxiprb6', '8qu_zs4-z',
  'wqof6c7s4', 'qon70d0ncx1', '47p16a3dsdn', 'zd26agz8t', '0vo8whh46d',
  'gf38c-yve2l', 'c3rc0hbas33', 'n4p8ztx7s66a', '64wmgpape9', '6rg0y_5svyny',
  'a8hdbejz7g', 'tw7x5m_nb1vs', 'aadd0aqbwh', 'a3om_lco56of', 'pmyqpcsfq5fp',
  'c1o0gmpc3', '9mrtux-4lg', 'x3uzvfx9w', '0jqqqu3r9dj0', 'v7qs96o-aakd',
  's88ayjn0-2j', 'qpktq4tl1w', '2o_63xt7i9', 'ye3lq1l77c2', '30olbzxsmv8',
  'm2mcwcb56ef', '6zwnz7x4nn74', 'x1ttp-tqj', 't9dxflwr9', '03uwbflew',
  'z30i0r43wa', '905qs3r_h', 'jyrv3_ysb5', 'p1_2w2sdthlg', '0y_cg6-n3',
  'pv6ub18pggo', 't1925z5rt', '93njxl5k2g', 'r7sfpuy0n0', 'bbmp737ch2',
  '2lf1cvm16vt', '60evvpno7pa1', 'q1-_5sk4ok4x', 'z9v7qa4b9f6', 'y-p6fcroqyey',
  'n765wr7rtl', 'v4ses9j4tnw', 'sk_6dphwqq', '56gph7-dh', 'zroadtm22',
  'hqp_lm-pcvl', '8xdu2woz6', '5twyd-6rt', 'b94_cymcppuu', '83jl4v-1m0',
  'hfk0rmpipb9o', 'z8ror8-si', 'n1f455x0smc4', 'bmab_2ohlh', 'bjv-p9kb45',
  'um_hjk4l8', 'ohz2rkvi2', 'z1-pp4bku', 'o8r9b7z838lc', 'xp_qrfkaf',
  'b5z853wc8', 'r97ioirfs', 'zmmyc9ru_b2s', '6eumw2p_e', '8f85wdspb2',
  'egon76h26r5h', 'xacitm7ukp3y', '1lbrbtjqe', 'aujqv200te', 'o0jer8lu5vn',
  '22zs335lvzz', 'qd772jacj', 'tds6gr8vll', 'umcvlp-di4i1', 'my25s-qow48',
  '43ybdtn5w8cz', 'i1wc3bayp', 'v0nujw6cjt6', '7kc6xewjq',
] as const;

const verified = (
  primaryPurpose: Exclude<ExperiencePrimaryPurpose, 'unknown'>,
  evidence: string,
  extras: Partial<Pick<ReviewedExperienceClassification, 'secondaryPurposes' | 'studyType' | 'visaOrPermit'>> = {}
): ReviewedExperienceClassification => ({
  primaryPurpose,
  secondaryPurposes: extras.secondaryPurposes ?? [],
  studyType: extras.studyType,
  visaOrPermit: extras.visaOrPermit,
  classificationStatus: 'verified',
  classificationNote: evidence,
});

const VERIFIED_OVERRIDES: Record<string, ReviewedExperienceClassification> = {
  // 本人がワーキングホリデー／WHを主目的として明記した回答だけを採用。
  '2n0adqmmxbe': verified('working-holiday', '本文でオーストラリアのワーホリ経験を本人が明記', { visaOrPermit: 'Working Holiday visa' }),
  'z4-mpgair4': verified('working-holiday', '本文でオーストラリアのワーホリ経験を本人が明記', { visaOrPermit: 'Working Holiday visa' }),
  'qx83421-zp': verified('working-holiday', '本文でカナダのワーホリ経験を本人が明記', { visaOrPermit: 'IEC Working Holiday' }),
  'qon70d0ncx1': verified('working-holiday', '本文でワーホリ中の仕事と生活を本人が明記'),
  'c3rc0hbas33': verified('working-holiday', '本文でオーストラリアのワーホリを本人が明記'),
  'pmyqpcsfq5fp': verified('working-holiday', '本文でワーホリ渡航を本人が明記'),
  '9mrtux-4lg': verified('working-holiday', '本文でニュージーランドのワーホリ経験を本人が明記'),
  'v7qs96o-aakd': verified('working-holiday', '本文でワーホリ生活を本人が明記'),
  't9dxflwr9': verified('working-holiday', '本文で英国YMSでの滞在を本人が明記', { visaOrPermit: 'Youth Mobility Scheme visa' }),
  '905qs3r_h': verified('working-holiday', '本文でワーホリの仕事・生活を本人が明記'),
  'pv6ub18pggo': verified('working-holiday', '本文で韓国ワーホリを本人が明記', { visaOrPermit: 'H-1' }),
  'r7sfpuy0n0': verified('working-holiday', '本文でオーストラリアのワーホリを本人が明記'),
  'y-p6fcroqyey': verified('working-holiday', '本文でワーホリ経験を本人が明記'),
  '56gph7-dh': verified('working-holiday', '本文でワーホリ生活を本人が明記'),
  'zroadtm22': verified('working-holiday', '本文でカナダのワーホリとビザ期限を本人が明記', { visaOrPermit: 'IEC Working Holiday' }),
  'hqp_lm-pcvl': verified('working-holiday', '本文でドイツのワーホリ経験を本人が明記'),
  'z8ror8-si': verified('working-holiday', '本文でオーストラリアのワーホリを本人が明記'),
  'um_hjk4l8': verified('working-holiday', '本文でワーホリ生活を本人が明記'),
  'xp_qrfkaf': verified('working-holiday', '留学後に英国ワーホリへ移ったことを本人が明記', { secondaryPurposes: ['study-abroad'], visaOrPermit: 'Youth Mobility Scheme visa' }),
  'o0jer8lu5vn': verified('working-holiday', '本文でドイツのワーホリ経験を本人が明記'),
  '22zs335lvzz': verified('working-holiday', '本文でアイルランドのワーホリ経験を本人が明記'),
  '43ybdtn5w8cz': verified('working-holiday', '本文でオーストラリアのワーホリ経験を本人が明記'),

  // 本人が学校・学位・交換・Co-op等の留学プログラムを主目的として明記。
  'v6a13ncnx871': verified('study-abroad', '大学で学んだ経験を本人が明記', { studyType: 'university' }),
  'wqof6c7s4': verified('study-abroad', '語学留学を本人が明記', { studyType: 'language' }),
  'zd26agz8t': verified('study-abroad', '学校で学ぶ留学経験を本人が明記', { studyType: 'other' }),
  '0vo8whh46d': verified('study-abroad', '大学留学を本人が明記', { studyType: 'university' }),
  'n4p8ztx7s66a': verified('study-abroad', '学校で学ぶ留学経験を本人が明記', { studyType: 'language' }),
  'tw7x5m_nb1vs': verified('study-abroad', '語学学校への留学を本人が明記', { studyType: 'language' }),
  'aadd0aqbwh': verified('study-abroad', '学校で学ぶ留学経験を本人が明記', { studyType: 'language' }),
  'c1o0gmpc3': verified('study-abroad', '語学留学を本人が明記', { studyType: 'language' }),
  '0jqqqu3r9dj0': verified('study-abroad', 'Co-op留学を本人が明記', { studyType: 'coop', visaOrPermit: 'study permit / co-op work permit' }),
  'qpktq4tl1w': verified('study-abroad', '学校で学ぶ留学経験を本人が明記', { studyType: 'language' }),
  'm2mcwcb56ef': verified('study-abroad', '学校で学ぶ留学経験を本人が明記', { studyType: 'language' }),
  '6zwnz7x4nn74': verified('study-abroad', '語学留学を本人が明記', { studyType: 'language' }),
  '03uwbflew': verified('study-abroad', '大学留学を本人が明記', { studyType: 'university' }),
  'jyrv3_ysb5': verified('study-abroad', '語学学校への留学を本人が明記', { studyType: 'language' }),
  'p1_2w2sdthlg': verified('study-abroad', '交換留学プログラムを本人が明記', { studyType: 'exchange' }),
  '0y_cg6-n3': verified('study-abroad', '学校で学ぶ留学経験を本人が明記', { studyType: 'other' }),
  't1925z5rt': verified('study-abroad', '学生ビザでの留学を本人が明記', { studyType: 'language', visaOrPermit: 'study permit' }),
  '93njxl5k2g': verified('study-abroad', '語学留学を本人が明記', { studyType: 'language' }),
  'n765wr7rtl': verified('study-abroad', '学校で学ぶ留学経験を本人が明記', { studyType: 'language' }),
  'v4ses9j4tnw': verified('study-abroad', '語学留学を本人が明記', { studyType: 'language' }),
  '83jl4v-1m0': verified('study-abroad', '語学学校への留学を本人が明記', { studyType: 'language' }),
  '8xdu2woz6': verified('study-abroad', '留学プログラムを本人が明記', { studyType: 'other' }),
  'ohz2rkvi2': verified('study-abroad', '大学留学を本人が明記', { studyType: 'university' }),
  'z1-pp4bku': verified('study-abroad', '留学プログラムを本人が明記', { studyType: 'other' }),
  'o8r9b7z838lc': verified('study-abroad', '留学プログラムを本人が明記', { studyType: 'other' }),
  'b5z853wc8': verified('study-abroad', '大学留学を本人が明記', { studyType: 'university' }),
  'zmmyc9ru_b2s': verified('study-abroad', '学校で学ぶ留学経験を本人が明記', { studyType: 'language' }),
  'egon76h26r5h': verified('study-abroad', '大学留学を本人が明記', { studyType: 'university' }),
  '1lbrbtjqe': verified('study-abroad', '留学プログラムを本人が明記', { studyType: 'other' }),
  'umcvlp-di4i1': verified('study-abroad', '留学プログラムを本人が明記', { studyType: 'other' }),
  'v0nujw6cjt6': verified('study-abroad', '大学で学んだ経験を本人が明記', { studyType: 'university' }),
};

const UNKNOWN_CLASSIFICATION: ReviewedExperienceClassification = {
  primaryPurpose: 'unknown',
  secondaryPurposes: [],
  classificationStatus: 'needs-review',
  classificationNote: '本文・回答属性から本人明記の主目的を一意に確定できないため、推測せず保留',
};

export const EXPERIENCE_CLASSIFICATIONS: Readonly<Record<string, ReviewedExperienceClassification>> =
  Object.fromEntries(
    REVIEWED_EXPERIENCE_IDS.map((id) => [id, VERIFIED_OVERRIDES[id] ?? UNKNOWN_CLASSIFICATION])
  );

const asScalar = <T extends string>(value: T | T[] | undefined): T | undefined =>
  Array.isArray(value) ? value[0] : value;

export function normalizeExperienceClassification(experience: Experience): Experience {
  const cmsPrimary = asScalar(experience.primaryPurpose as ExperiencePrimaryPurpose | ExperiencePrimaryPurpose[] | undefined);
  const cmsStatus = asScalar(experience.classificationStatus as ExperienceClassificationStatus | ExperienceClassificationStatus[] | undefined);
  const cmsStudyType = asScalar(experience.studyType as ExperienceStudyType | ExperienceStudyType[] | undefined);
  const fallback = EXPERIENCE_CLASSIFICATIONS[experience.id];

  if (cmsPrimary && cmsStatus) {
    return {
      ...experience,
      primaryPurpose: cmsPrimary,
      classificationStatus: cmsStatus,
      studyType: cmsStudyType,
      secondaryPurposes: experience.secondaryPurposes ?? [],
    };
  }

  const embeddedMatch = experience.content?.match(/<!--\s*swh:experience-classification\s+([^\s]+)\s*-->/);
  if (embeddedMatch) {
    try {
      const embedded = JSON.parse(decodeURIComponent(embeddedMatch[1])) as ReviewedExperienceClassification;
      if (embedded.primaryPurpose && embedded.classificationStatus) {
        return { ...experience, ...embedded };
      }
    } catch {
      // 壊れた埋め込み値を推測で採用せず、レジストリまたはunknownへフォールバックする。
    }
  }

  return fallback ? { ...experience, ...fallback } : { ...experience, ...UNKNOWN_CLASSIFICATION };
}

export function isVerifiedForPurpose(
  experience: Experience,
  purpose: 'working-holiday' | 'study-abroad'
): boolean {
  const normalized = normalizeExperienceClassification(experience);
  return normalized.classificationStatus === 'verified' && normalized.primaryPurpose === purpose;
}

export function getPurposePath(experience: Experience): string | null {
  const normalized = normalizeExperienceClassification(experience);
  if (
    normalized.classificationStatus !== 'verified' ||
    (normalized.primaryPurpose !== 'working-holiday' && normalized.primaryPurpose !== 'study-abroad') ||
    !normalized.country?.id
  ) {
    return null;
  }
  return `/countries/${normalized.country.id}/${normalized.primaryPurpose}`;
}

export const PURPOSE_LABELS: Record<'working-holiday' | 'study-abroad', string> = {
  'working-holiday': 'ワーホリ',
  'study-abroad': '留学',
};

export const STUDY_TYPE_LABELS: Record<ExperienceStudyType, string> = {
  language: '語学留学',
  university: '大学',
  graduate: '大学院',
  vocational: '専門留学',
  coop: 'Co-op',
  exchange: '交換留学',
  'high-school': '高校留学',
  other: 'その他',
};
