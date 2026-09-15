import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceCard from "@/components/PlaceCard";
import FilterForm from "@/components/FilterForm";
import { getNeighborhoodById } from "@/lib/neighborhoods";
import { getPlacesByNeighborhood } from "@/lib/queries";

export default async function NeighborhoodPage({
  params,
  searchParams,
}: PageProps<"/neighborhoods/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;

  const neighborhood = getNeighborhoodById(slug);
  if (!neighborhood) notFound();

  const filters = {
    chair: sp.chair === "on",
    nokids: sp.nokids === "on",
    food: sp.food === "on",
    parking: sp.parking === "on",
  };

  const places = getPlacesByNeighborhood(slug, {
    kidsChair: filters.chair,
    excludeNoKidsZone: filters.nokids,
    kidsFood: filters.food,
    goodParking: filters.parking,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/" className="text-sm text-amber-700 hover:underline dark:text-amber-400">
        ← 전체 동네 보기
      </Link>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">
            {neighborhood.name}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{neighborhood.tagline}</p>
        </div>
        <Link
          href={`/places/new?neighborhood=${neighborhood.id}`}
          className="rounded-full border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40"
        >
          {neighborhood.name}에 장소 제보하기
        </Link>
      </div>

      <div className="mt-5">
        <FilterForm neighborhoodId={neighborhood.id} filters={filters} />
      </div>

      {places.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-amber-300 p-10 text-center text-stone-500 dark:border-amber-900/50">
          <p>조건에 맞는 장소가 아직 없어요.</p>
          <p className="mt-1 text-sm">
            {neighborhood.name}을(를) 잘 아신다면{" "}
            <Link
              href={`/places/new?neighborhood=${neighborhood.id}`}
              className="text-amber-700 underline dark:text-amber-400"
            >
              첫 제보
            </Link>
            를 남겨주세요!
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} feedStyle />
          ))}
        </div>
      )}
    </div>
  );
}
