type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Card({ children, className = '', hover = false }: Props) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden ${
        hover ? 'hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200 ease-smooth' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
