type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Card({ children, className = '', hover = false }: Props) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${
        hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
