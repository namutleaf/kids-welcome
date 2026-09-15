import Link from "next/link";
import NeighborhoodCard from "@/components/NeighborhoodCard";
import PlaceCard from "@/components/PlaceCard";
import { getNeighborhoodPlaceCounts, getNeighborhoods, getRecentPlaces } from "@/lib/queries";

export default async function HomePage() {
  const neighborhoods = getNeighborhoods();
  const placeCounts = getNeighborhoodPlaceCounts();
  const recentPlaces = getRecentPlaces(6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-stone-100 sm:text-4xl">
          아이랑 갈 만한 곳,{" "}
          <span className="text-amber-600 dark:text-amber-400">동네</span>로 찾아보세요
        </h1>
        <p className="mt-3 text-stone-600 dark:text-stone-400">
          아기의자, 노키즈존 여부, 주차, 즐길거리까지 — 행정동이 아니라 서촌, 성수/서울숲처럼
          실제로 부르는 동네 이름으로 찾아요.
        </p>
        <Link
          href="/places/new"
          className="mt-5 inline-block rounded-full bg-amber-500 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-amber-600"
        >
          우리 동네 장소 제보하기
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">동네별로 둘러보기</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {neighborhoods.map((n) => (
            <NeighborhoodCard key={n.id} neighborhood={n} placeCount={placeCounts[n.id] ?? 0} />
          ))}
        </div>
      </section>

      {recentPlaces.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
            최근에 등록된 장소
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} showNeighborhood />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
