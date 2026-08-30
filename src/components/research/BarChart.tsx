type BarChartColor = 'primary' | 'emerald' | 'sky' | 'amber';

const BAR_COLOR: Record<BarChartColor, string> = {
  primary: 'bg-primary-600',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
};

export type BarItem = {
  label: string;
  /** 棒の長さ計算に使う生の数値 */
  value: number;
  /** 棒の右に表示する文字列（「15.0万円」など） */
  valueLabel: string;
  /** 強調表示（最大値・注目値など） */
  highlight?: boolean;
};

type Props = {
  items: BarItem[];
  color?: BarChartColor;
  /** 100%とみなす最大値（未指定なら items 内の最大値） */
  max?: number;
};

/**
 * 依存ライブラリなしの横棒グラフ。div の width(%) だけで描画する。
 * スクリーンリーダー向けに各行へ aria-label を付与。
 */
export default function BarChart({ items, color = 'primary', max }: Props) {
  const maxValue = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = Math.max(2, Math.round((item.value / maxValue) * 100));
        return (
          <div key={item.label}>
            <div className="flex items-baseline justify-between text-sm mb-1">
              <span className="text-gray-800">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.valueLabel}</span>
            </div>
            <div
              className="w-full bg-gray-100 rounded-full h-3 overflow-hidden"
              role="img"
              aria-label={`${item.label}: ${item.valueLabel}`}
            >
              <div
                className={`${item.highlight ? 'bg-amber-500' : BAR_COLOR[color]} h-3 rounded-full`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
