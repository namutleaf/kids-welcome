import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";
import { searchPlaces } from "@/lib/queries";

export default async function SearchResultsPage({
  searchParams,
}: PageProps<"/search/results">) {
  const sp = await searchParams;

  const adults = Number(sp.adults ?? 0) || 0;
  const kids = Number(sp.kids ?? 0) || 0;

  const places = searchPlaces({
    kidsChair: sp.chair === "1",
    excludeNoKidsZone: sp.nokids === "1",
    kidsFood: sp.food === "1",
    goodParking: sp.parking === "1",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/search" className="text-sm text-amber-700 hover:underline dark:text-amber-400">
        ← 조건 다시 설정하기
      </Link>

      <h1 className="mt-2 text-2xl font-extrabold text-stone-800 dark:text-stone-100">검색 결과</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        어른 {adults}명{kids > 0 ? `, 아이 ${kids}명` : ""} 기준으로 찾았어요 · {places.length}곳
      </p>

      {places.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-amber-300 p-10 text-center text-stone-500 dark:border-amber-900/50">
          <p>조건에 맞는 장소가 아직 없어요.</p>
          <Link
            href="/search"
            className="mt-2 inline-block text-amber-700 underline dark:text-amber-400"
          >
            조건을 다시 설정해보세요
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} feedStyle showNeighborhood />
          ))}
        </div>
      )}
    </div>
  );
}
