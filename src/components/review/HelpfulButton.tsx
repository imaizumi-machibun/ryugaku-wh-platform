'use client';

import { useState, useEffect } from 'react';

type Props = {
  reviewId: string;
};

const STORAGE_KEY = 'helpful-votes';

function getVotedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveVote(id: string) {
  const ids = getVotedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
}

export default function HelpfulButton({ reviewId }: Props) {
  const [hasVoted, setHasVoted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const voted = getVotedIds().includes(reviewId);
    setHasVoted(voted);
    // In a real app, count would come from an API
    // For MVP, we just track the user's own vote
    if (voted) setCount(1);
  }, [reviewId]);

  function handleClick() {
    if (hasVoted) return;
    saveVote(reviewId);
    setHasVoted(true);
    setCount((c) => c + 1);
  }

  return (
    <button
      onClick={handleClick}
      disabled={hasVoted}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
        hasVoted
          ? 'bg-primary-100 text-primary-700 cursor-default'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
      役に立った{count > 0 ? ` (${count})` : ''}
    </button>
  );
}
