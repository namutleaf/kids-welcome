import Link from "next/link";
import { Neighborhood } from "@/lib/types";

export default function NeighborhoodCard({
  neighborhood,
  placeCount,
}: {
  neighborhood: Neighborhood;
  placeCount: number;
}) {
  return (
    <Link
      href={`/neighborhoods/${neighborhood.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg dark:border-stone-700/60 dark:bg-[#163431] dark:hover:border-teal-700"
    >
      <span
        aria-hidden
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-2xl transition-colors group-hover:bg-teal-100 dark:bg-teal-950/50 dark:group-hover:bg-teal-900/60"
      >
        {neighborhood.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-bold text-stone-800 dark:text-stone-100">
            {neighborhood.name}
          </h3>
          <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
            {placeCount}곳
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-stone-500 dark:text-stone-400">
          {neighborhood.tagline}
        </p>
      </div>
    </Link>
  );
}
