type Props = {
  countryCount: number;
};

export default function TrustBanner({ countryCount }: Props) {
  const items = [
    '全口コミ・体験談は実体験者のみ',
    `対応国 ${countryCount}カ国`,
    '情報は一次情報をもとに定期更新',
  ];

  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="container-custom flex flex-wrap items-center justify-center gap-x-10 gap-y-2 py-5 text-sm text-gray-600">
        {items.map((text, i) => (
          <div key={text} className="flex items-center gap-10">
            {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:inline-block" />}
            <span>{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
