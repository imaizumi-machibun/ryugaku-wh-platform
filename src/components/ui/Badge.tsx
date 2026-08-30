type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'new' | 'popular';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const VARIANTS: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-accent-100 text-accent-800',
  danger: 'bg-rose-100 text-rose-800',
  info: 'bg-sky-100 text-sky-800',
  accent: 'bg-accent-100 text-accent-800',
  new: 'bg-accent-400 text-primary-900',
  popular: 'bg-rose-500 text-white',
};

export default function Badge({ children, variant = 'default', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
