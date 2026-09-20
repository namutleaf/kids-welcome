import Link from "next/link";

export interface FilterValues {
  chair?: boolean;
  nokids?: boolean;
  food?: boolean;
  parking?: boolean;
}

const FILTER_OPTIONS: { key: keyof FilterValues; label: string; icon: string }[] = [
  { key: "chair", label: "아기의자 있는 곳만", icon: "🪑" },
  { key: "nokids", label: "노키즈존 제외", icon: "🚫" },
  { key: "food", label: "아이 먹거리 있는 곳만", icon: "🍽️" },
  { key: "parking", label: "주차 편한 곳만", icon: "🅿️" },
];

export default function FilterForm({
  neighborhoodId,
  filters,
}: {
  neighborhoodId: string;
  filters: FilterValues;
}) {
  const hasActiveFilter = Object.values(filters).some(Boolean);

  return (
    <form
      method="GET"
      action={`/neighborhoods/${neighborhoodId}`}
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-teal-200/70 bg-white/70 p-3 dark:border-teal-900/40 dark:bg-[#163431]/70"
    >
      {FILTER_OPTIONS.map((option) => (
        <label
          key={option.key}
          className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-3 py-1.5 text-sm text-stone-700 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-800 dark:border-teal-900/50 dark:bg-[#102220] dark:text-stone-300 dark:has-[:checked]:bg-teal-950/50"
        >
          <input
            type="checkbox"
            name={option.key}
            defaultChecked={filters[option.key]}
            className="accent-teal-600"
          />
          <span aria-hidden>{option.icon}</span>
          {option.label}
        </label>
      ))}
      <button
        type="submit"
        className="rounded-full bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-600"
      >
        필터 적용
      </button>
      {hasActiveFilter ? (
        <Link
          href={`/neighborhoods/${neighborhoodId}`}
          className="text-sm text-stone-500 underline hover:text-stone-700"
        >
          초기화
        </Link>
      ) : null}
    </form>
  );
}
