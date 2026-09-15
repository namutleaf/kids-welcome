import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewForm from "@/components/ReviewForm";
import { getPlaceById } from "@/lib/queries";

export default async function NewReviewPage({
  params,
}: PageProps<"/places/[id]/review/new">) {
  const { id } = await params;
  const placeId = Number(id);
  if (!Number.isInteger(placeId)) notFound();

  const place = getPlaceById(placeId);
  if (!place) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/places/${place.id}`}
        className="text-sm text-amber-700 hover:underline dark:text-amber-400"
      >
        ← {place.name}으로 돌아가기
      </Link>

      <h1 className="mt-2 text-2xl font-extrabold text-stone-800 dark:text-stone-100">
        {place.name} 후기 남기기
      </h1>

      <div className="mt-6">
        <ReviewForm placeId={place.id} />
      </div>
    </div>
  );
}
