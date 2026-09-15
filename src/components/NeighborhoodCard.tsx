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
      className="block rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-amber-900/40 dark:bg-[#2a2019]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
          {neighborhood.name}
        </h3>
        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
          장소 {placeCount}곳
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{neighborhood.tagline}</p>
    </Link>
  );
}
