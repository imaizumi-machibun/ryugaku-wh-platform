'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MATCHING_QUESTIONS, scoreCountries, type AnswerKey } from '@/lib/matching';

export default function MatchingFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<AnswerKey, string>>>({});
  const [showResult, setShowResult] = useState(false);

  const totalSteps = MATCHING_QUESTIONS.length;
  const isLastQuestion = step === totalSteps - 1;
  const currentQuestion = MATCHING_QUESTIONS[step];

  const handleSelect = (value: string) => {
    const nextAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(nextAnswers);
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    const completeAnswers = answers as Record<AnswerKey, string>;
    const results = scoreCountries(completeAnswers).slice(0, 3);

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold text-primary-600 mb-2">診断結果</p>
          <h2 className="text-2xl font-bold">あなたにぴったりのワーホリ先 TOP3</h2>
          <p className="text-sm text-gray-600 mt-2">
            5問の回答をもとに、9カ国の特性とマッチングしました。
          </p>
        </div>

        <ol className="space-y-4">
          {results.map((r, i) => (
            <li
              key={r.countrySlug}
              className="bg-gradient-to-r from-primary-50 to-white border border-primary-100 rounded-xl p-5"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl" aria-hidden="true">{r.flagEmoji}</span>
                    <h3 className="text-xl font-bold">{r.countryName}</h3>
                    <span className="text-xs text-gray-500">マッチスコア {r.score}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    あなたにマッチした理由
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4 list-disc pl-5">
                    {r.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/countries/${r.countrySlug}`}
                    className="inline-block bg-accent-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
                  >
                    {r.countryName}の詳細を見る →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-block text-sm text-primary-600 hover:underline"
          >
            ↻ もう一度診断する
          </button>
          <p className="text-xs text-gray-500">
            さらに詳しく比較したい方は
            <Link href="/compare/countries" className="text-primary-600 hover:underline mx-1">
              ワーホリ国 比較ランキング
            </Link>
            もご活用ください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
      {/* プログレス */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary-600">
            Step {step + 1} / {totalSteps}
          </span>
          <span className="text-xs text-gray-500">
            あと{totalSteps - step - 1}問
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-6">{currentQuestion.question}</h2>

      <div className="space-y-3">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className="w-full text-left bg-gray-50 hover:bg-primary-50 hover:border-primary-400 border border-gray-200 rounded-lg px-4 py-3 font-medium text-gray-900 transition-colors flex items-center justify-between"
          >
            <span>{opt.label}</span>
            <span className="text-gray-400">→</span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700"
        >
          ← 前の質問に戻る
        </button>
      )}
    </div>
  );
}
