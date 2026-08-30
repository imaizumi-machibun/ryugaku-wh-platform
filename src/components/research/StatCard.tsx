type StatCardColor = 'emerald' | 'amber' | 'rose' | 'sky';

const COLOR_CLASSES: Record<
  StatCardColor,
  { bg: string; border: string; label: string; value: string; note: string }
> = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    label: 'text-emerald-900',
    value: 'text-emerald-900',
    note: 'text-emerald-800',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    label: 'text-amber-900',
    value: 'text-amber-900',
    note: 'text-amber-800',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    label: 'text-rose-900',
    value: 'text-rose-900',
    note: 'text-rose-800',
  },
  sky: {
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    label: 'text-sky-900',
    value: 'text-sky-900',
    note: 'text-sky-800',
  },
};

type Props = {
  label: string;
  value: string | number;
  unit?: string;
  note?: string;
  color?: StatCardColor;
};

/**
 * 調査レポートの「大きな数字」カード。
 * note に n=◯件 など分母を入れて、引用に耐える表示にする。
 */
export default function StatCard({ label, value, unit, note, color = 'sky' }: Props) {
  const c = COLOR_CLASSES[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-5`}>
      <p className={`text-xs font-semibold ${c.label} mb-1`}>{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold ${c.value}`}>
        {value}
        {unit && <span className="text-base font-semibold ml-1">{unit}</span>}
      </p>
      {note && <p className={`text-xs ${c.note} mt-2`}>{note}</p>}
    </div>
  );
}
