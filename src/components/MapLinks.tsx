const MAP_SERVICES: {
  name: string;
  icon: string;
  buildUrl: (query: string) => string;
}[] = [
  {
    name: "네이버지도",
    icon: "🟢",
    buildUrl: (q) => `https://map.naver.com/p/search/${encodeURIComponent(q)}`,
  },
  {
    name: "카카오맵",
    icon: "🟡",
    buildUrl: (q) => `https://map.kakao.com/?q=${encodeURIComponent(q)}`,
  },
  {
    name: "구글맵",
    icon: "🔵",
    buildUrl: (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
  },
  {
    name: "애플지도",
    icon: "⚪",
    buildUrl: (q) => `https://maps.apple.com/?q=${encodeURIComponent(q)}`,
  },
];

export default function MapLinks({ name, address }: { name: string; address: string }) {
  const query = address ? `${name} ${address}` : name;

  return (
    <div className="flex flex-wrap gap-2">
      {MAP_SERVICES.map((service) => (
        <a
          key={service.name}
          href={service.buildUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-50 dark:border-teal-900/40 dark:bg-[#163431] dark:text-teal-300 dark:hover:bg-teal-950/40"
        >
          <span aria-hidden>{service.icon}</span>
          {service.name}
        </a>
      ))}
    </div>
  );
}
