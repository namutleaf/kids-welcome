import Link from "next/link";
import { PlaceWithStats } from "@/lib/types";
import { getAllBadges } from "@/lib/badges";
import Badge from "./Badge";
import StarRating from "./StarRating";
import { getNeighborhoodById } from "@/lib/neighborhoods";

export default function PlaceCard({
  place,
  showNeighborhood = false,
  feedStyle = false,
}: {
  place: PlaceWithStats;
  showNeighborhood?: boolean;
  feedStyle?: boolean;
}) {
  const badges = getAllBadges(place);
  const neighborhood = showNeighborhood ? getNeighborhoodById(place.neighborhoodId) : undefined;

  if (feedStyle) {
    return (
      <Link
        href={`/places/${place.id}`}
        className="block rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-amber-900/40 dark:bg-[#2a2019]"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-stone-800 dark:text-stone-100">{place.name}</h3>
            <p className="text-xs text-stone-500">
              {neighborhood ? `${neighborhood.name} · ` : ""}
              {place.category}
            </p>

            {place.description ? (
              <p className="mt-2 line-clamp-2 text-sm text-stone-600 dark:text-stone-300">
                {place.description}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-1.5">
              {badges.slice(0, 3).map((badge) => (
                <Badge key={badge.label} tone={badge.tone} icon={badge.icon}>
                  {badge.label}
                </Badge>
              ))}
              {badges.length > 3 && (
                <span className="text-xs text-stone-400">+{badges.length - 3}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <StarRating rating={place.avgRating} reviewCount={place.reviewCount} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/places/${place.id}`}
      className="block rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-amber-900/40 dark:bg-[#2a2019]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-stone-800 dark:text-stone-100">{place.name}</h3>
          <p className="text-xs text-stone-500">
            {neighborhood ? `${neighborhood.name} · ` : ""}
            {place.category}
          </p>
        </div>
      </div>

      {place.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-stone-600 dark:text-stone-300">
          {place.description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {badges.map((badge) => (
          <Badge key={badge.label} tone={badge.tone} icon={badge.icon}>
            {badge.label}
          </Badge>
        ))}
      </div>

      <div className="mt-3">
        <StarRating rating={place.avgRating} reviewCount={place.reviewCount} />
      </div>
    </Link>
  );
}
