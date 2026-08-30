'use client';

import { useRef, useState } from 'react';
import type { Country, School } from '@/lib/microcms/types';
import { GENDERS, LANGUAGE_LEVELS } from '@/lib/utils/constants';
import StarRatingInput from '@/components/ui/StarRatingInput';

type Props = {
  countries: Country[];
  schools: School[];
};

const STEP_LABELS = ['基本情報', '体験内容', '評価・費用', 'あなたについて'];

export default function ExperienceForm({ countries, schools }: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [primaryPurpose, setPrimaryPurpose] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const totalSteps = 4;

  function goToNextStep() {
    if (!formRef.current) return;
    const values = new FormData(formRef.current);
    let message = '';
    if (step === 1) {
      if (String(values.get('title') ?? '').trim().length < 5) message = 'タイトルを5文字以上で入力してください。';
      else if (!values.get('primaryPurpose')) message = '主な渡航目的を選択してください。';
      else if (!String(values.get('visaOrPermit') ?? '').trim()) message = 'ビザ・許可・プログラム名を入力してください。';
      else if (primaryPurpose === 'study-abroad' && !values.get('studyType')) message = '留学種別を選択してください。';
      else if (!values.get('countryId')) message = '国を選択してください。';
      else if (!String(values.get('cityPrimary') ?? '').trim()) message = '主な滞在都市を入力してください。';
    } else if (step === 2 && String(values.get('content') ?? '').trim().length < 100) {
      message = '体験談を100文字以上で入力してください。';
    } else if (step === 3 && !values.get('ratingOverall')) {
      message = '総合評価を選択してください。';
    }
    if (message) {
      setError(message);
      return;
    }
    setError('');
    setStep((current) => current + 1);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      if (key === 'secondaryPurposes') return;
      if (key === 'pros' || key === 'cons') {
        const items = (value as string)
          .split('\n')
          .filter((s) => s.trim())
          .map((text) => text.trim());
        data[key] = items;
      } else if (key === 'wouldRecommend') {
        data[key] = value === 'true';
      } else {
        data[key] = value;
      }
    });
    data.secondaryPurposes = formData.getAll('secondaryPurposes').map(String);

    try {
      const res = await fetch('/api/submit-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '投稿に失敗しました');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">投稿ありがとうございます！</h2>
        <p className="text-gray-600">
          管理者が確認後、公開されます。しばらくお待ちください。
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto">
      {/* Progress Bar with Labels */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-colors ${
                  i + 1 < step
                    ? 'bg-green-500 text-white'
                    : i + 1 === step
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1 < step ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs hidden sm:block ${i + 1 <= step ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        {/* Continuous progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Step 1: Basic Info */}
      <div className={step === 1 ? 'space-y-4' : 'hidden'} aria-hidden={step !== 1}>
          <h2 className="text-xl font-bold mb-4">基本情報</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              minLength={5}
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="例: オーストラリアワーホリで人生が変わった話"
            />
          </div>
          <fieldset className="rounded-xl border border-gray-200 p-4">
            <legend className="px-1 text-sm font-semibold text-gray-800">
              主な渡航目的 <span className="text-red-500">*</span>
            </legend>
            <p className="mb-3 text-xs leading-5 text-gray-500">最も中心だった目的を1つ選んでください。年齢や滞在期間ではなく、実際のビザ・プログラムに沿って回答してください。</p>
            <select
              name="primaryPurpose"
              value={primaryPurpose}
              onChange={(event) => setPrimaryPurpose(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">選択してください</option>
              <option value="working-holiday">ワーキングホリデー</option>
              <option value="study-abroad">留学</option>
              <option value="other">その他</option>
            </select>
          </fieldset>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ビザ・許可・プログラム名 <span className="text-red-500">*</span>
            </label>
            <input name="visaOrPermit" type="text" maxLength={120} className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="例：IEC Working Holiday、学生ビザ、交換留学（分からない場合は「不明」）" />
          </div>
          {primaryPurpose === 'study-abroad' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                留学種別 <span className="text-red-500">*</span>
              </label>
              <select name="studyType" className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">選択してください</option>
                <option value="language">語学留学</option>
                <option value="university">大学</option>
                <option value="graduate">大学院</option>
                <option value="vocational">専門留学</option>
                <option value="coop">Co-op</option>
                <option value="exchange">交換留学</option>
                <option value="high-school">高校留学</option>
                <option value="other">その他</option>
              </select>
            </div>
          )}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700">副目的（任意・複数可）</legend>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              {[
                ['working-holiday', 'ワーキングホリデー'],
                ['study-abroad', '留学'],
                ['other', 'その他'],
              ].filter(([value]) => value !== primaryPurpose).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2"><input type="checkbox" name="secondaryPurposes" value={value} className="rounded" />{label}</label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              国 <span className="text-red-500">*</span>
            </label>
            <select name="countryId" required className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">選択してください</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.flagEmoji} {c.nameJp}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">学校（任意）</label>
            <select name="schoolId" className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">選択しない</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                主な滞在都市 <span className="text-red-500">*</span>
              </label>
              <input name="cityPrimary" type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">滞在期間（月）</label>
              <input name="durationMonths" type="number" min="1" max="120" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </div>
      </div>

      {/* Step 2: Content */}
      <div className={step === 2 ? 'space-y-4' : 'hidden'} aria-hidden={step !== 2}>
          <h2 className="text-xl font-bold mb-4">体験談の内容</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              体験談 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              required
              minLength={100}
              maxLength={10000}
              rows={12}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="留学・ワーホリの体験を詳しく教えてください（100文字以上）"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">良かった点（1行1項目）</label>
            <textarea name="pros" rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="自然が美しい&#10;人が親切" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">大変だった点（1行1項目）</label>
            <textarea name="cons" rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="物価が高い&#10;ホームシック" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">アドバイス</label>
            <textarea name="advice" rows={4} maxLength={2000} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
      </div>

      {/* Step 3: Ratings & Cost */}
      <div className={step === 3 ? 'space-y-6' : 'hidden'} aria-hidden={step !== 3}>
          <h2 className="text-xl font-bold mb-4">評価と費用</h2>
          <div>
            <h3 className="font-semibold mb-3">6軸評価</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StarRatingInput name="ratingOverall" label="総合評価" required />
              <StarRatingInput name="ratingSafety" label="治安" />
              <StarRatingInput name="ratingJob" label="仕事の見つけやすさ" />
              <StarRatingInput name="ratingCost" label="コスパ" />
              <StarRatingInput name="ratingLifestyle" label="充実度" />
              <StarRatingInput name="ratingLanguage" label="語学上達" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">費用内訳（月額・円）</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'monthlyLivingJpy', label: '生活費' },
                { name: 'monthlyRentJpy', label: '家賃' },
                { name: 'monthlyFoodJpy', label: '食費' },
                { name: 'monthlyIncomeJpy', label: '収入' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input name={field.name} type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Step 4: Personal Info */}
      <div className={step === 4 ? 'space-y-4' : 'hidden'} aria-hidden={step !== 4}>
          <h2 className="text-xl font-bold mb-4">あなたについて</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">出発時年齢</label>
              <input name="ageAtDeparture" type="number" min="15" max="80" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
              <select name="gender" className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">選択しない</option>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">出発前の語学力</label>
              <select name="languageBefore" className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">選択しない</option>
                {LANGUAGE_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">帰国後の語学力</label>
              <select name="languageAfter" className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">選択しない</option>
                {LANGUAGE_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="wouldRecommend" id="wouldRecommend" value="true" className="rounded" />
            <label htmlFor="wouldRecommend" className="text-sm">この留学先をおすすめしますか？</label>
          </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            戻る
          </button>
        ) : (
          <div />
        )}
        {step < totalSteps ? (
          <button
            type="button"
            onClick={goToNextStep}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            次へ
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-50 font-semibold"
          >
            {isSubmitting ? '送信中...' : '投稿する'}
          </button>
        )}
      </div>
    </form>
  );
}
