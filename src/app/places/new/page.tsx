import PlaceForm from "@/components/PlaceForm";
import { getNeighborhoodById } from "@/lib/neighborhoods";

export default async function NewPlacePage({ searchParams }: PageProps<"/places/new">) {
  const sp = await searchParams;
  const neighborhoodParam = typeof sp.neighborhood === "string" ? sp.neighborhood : undefined;
  const neighborhood = neighborhoodParam ? getNeighborhoodById(neighborhoodParam) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">
        장소 제보하기
      </h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        {neighborhood ? `${neighborhood.name} 지역에 ` : ""}
        아이와 갔던 곳을 알려주시면 다른 부모님들에게 큰 도움이 돼요.
      </p>

      <div className="mt-6">
        <PlaceForm defaultNeighborhoodId={neighborhood?.id} />
      </div>
    </div>
  );
}
