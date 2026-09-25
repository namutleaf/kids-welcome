import Link from "next/link";
import { ManualMergeForm, MergePairForm } from "@/components/MergeForms";
import { getNeighborhoodById } from "@/lib/neighborhoods";
import { findDuplicatePairs, getPlaceById } from "@/lib/queries";

export default async function DuplicatesPage({ searchParams }: PageProps<"/admin/duplicates">) {
  const sp = await searchParams;
  const mergedId = typeof sp.merged === "string" ? Number(sp.merged) : NaN;
  const merged = Number.isInteger(mergedId) ? getPlaceById(mergedId) : undefined;
  const pairs = findDuplicatePairs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">중복 장소 정리</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        같은 동네에서 이름이 비슷한 장소를 모아 보여줘요. 병합하면 후기는 남길 장소로 옮겨지고, 비어
        있던 정보는 없어지는 쪽에서 채워져요.
      </p>

      {merged ? (
        <p className="mt-4 rounded-xl bg-teal-50 px-4 py-2 text-sm text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
          병합 완료 —{" "}
          <Link href={`/places/${merged.id}`} className="font-semibold underline">
            {merged.name}
          </Link>
        </p>
      ) : null}

      <section className="mt-6 space-y-4">
        {pairs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-teal-300 p-8 text-center text-sm text-stone-500 dark:border-teal-900/50">
            중복으로 보이는 장소가 없어요.
          </p>
        ) : (
          pairs.map(([a, b]) => (
            <div key={`${a.id}-${b.id}`}>
              <p className="mb-1.5 text-xs font-semibold text-stone-500">
                {getNeighborhoodById(a.neighborhoodId)?.name}
              </p>
              <MergePairForm a={a} b={b} />
            </div>
          ))
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-base font-bold text-stone-800 dark:text-stone-100">ID로 직접 병합</h2>
        <p className="mt-1 text-xs text-stone-500">
          이름이 많이 달라서 위 목록에 안 잡힌 중복은 장소 주소창의 ID(/places/<b>12</b>)로 병합하세요.
        </p>
        <div className="mt-3">
          <ManualMergeForm />
        </div>
      </section>
    </div>
  );
}
