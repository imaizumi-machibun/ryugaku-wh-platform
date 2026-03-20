import type { TipItem } from '@/lib/microcms/types';
import { TIP_STYLES } from '@/lib/utils/constants';

type Props = {
  tips: TipItem[];
};

export default function GuideTipBox({ tips }: Props) {
  if (tips.length === 0) return null;

  return (
    <div className="space-y-4 my-6">
      {tips.map((tip, i) => {
        const style = TIP_STYLES[tip.type] || TIP_STYLES.tip;
        return (
          <div
            key={i}
            className={`${style.bg} border-l-4 ${style.border} rounded-r-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{style.icon}</span>
              <span className="text-sm font-bold text-gray-800">{style.label}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{tip.text}</p>
          </div>
        );
      })}
    </div>
  );
}
