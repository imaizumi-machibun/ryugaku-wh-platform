'use client';

import { useState } from 'react';
import type { School } from '@/lib/microcms/types';
import StarRatingInput from '@/components/ui/StarRatingInput';

type Props = {
  schools: School[];
  defaultSchoolId?: string;
};

export default function ReviewForm({ schools, defaultSchoolId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(defaultSchoolId || '');

  const school = schools.find((s) => s.id === selectedSchool);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Auto-fill country from school
    if (school) {
      data.countryId = school.country?.id;
    }

    try {
      const res = await fetch('/api/submit-review', {
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
        <h2 className="text-2xl font-bold mb-2">口コミありがとうございます！</h2>
        <p className="text-gray-600">管理者が確認後、公開されます。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      {/* School Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          学校 <span className="text-red-500">*</span>
        </label>
        <select
          name="schoolId"
          required
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">学校を選択</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}（{s.country?.nameJp}）
            </option>
          ))}
        </select>
      </div>

      <input type="hidden" name="countryId" value={school?.country?.id || ''} />

      {/* Nickname & Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ニックネーム <span className="text-red-500">*</span>
          </label>
          <input name="nickname" type="text" required maxLength={50} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            通学年 <span className="text-red-500">*</span>
          </label>
          <input name="attendedYear" type="number" required min={2000} max={new Date().getFullYear()} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      {/* Ratings - Interactive Stars */}
      <div>
        <h3 className="font-semibold mb-3">評価</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StarRatingInput name="ratingOverall" label="総合" required />
          <StarRatingInput name="ratingTeaching" label="授業の質" />
          <StarRatingInput name="ratingFacilities" label="施設" />
          <StarRatingInput name="ratingLocation" label="立地" />
          <StarRatingInput name="ratingCostPerf" label="コスパ" />
        </div>
      </div>

      {/* Title & Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input name="title" type="text" required minLength={5} maxLength={100} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          口コミ本文 <span className="text-red-500">*</span>
        </label>
        <textarea name="body" required minLength={50} maxLength={5000} rows={8} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">良い点</label>
          <textarea name="pros" rows={4} maxLength={1000} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">改善点</label>
          <textarea name="cons" rows={4} maxLength={1000} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent-500 text-white py-3 rounded-lg font-medium hover:bg-accent-600 disabled:opacity-50"
      >
        {isSubmitting ? '送信中...' : '口コミを投稿する'}
      </button>
    </form>
  );
}
