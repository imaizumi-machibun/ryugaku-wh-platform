'use client';

import { useState } from 'react';

type Props = {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: number;
};

export default function StarRatingInput({ name, label, required = false, defaultValue = 0 }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type="hidden" name={name} value={value || ''} />
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="p-0.5 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center sm:min-w-0 sm:min-h-0"
            aria-label={`${star}点`}
          >
            <svg
              className={`w-7 h-7 transition-colors ${
                star <= displayValue ? 'text-yellow-400' : 'text-gray-200'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {value > 0 && (
          <span className="text-sm text-gray-500 ml-2">{value}.0</span>
        )}
      </div>
    </div>
  );
}
