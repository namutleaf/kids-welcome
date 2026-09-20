import Link from "next/link";
import { notFound } from "next/navigation";
import StarRating from "@/components/StarRating";
import Badge from "@/components/Badge";
import { getAllBadges } from "@/lib/badges";
import { getNeighborhoodById } from "@/lib/neighborhoods";
import { getPlaceById, getReviewsByPlace } from "@/lib/queries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PlaceDetailPage({ params }: PageProps<"/places/[id]">) {
  const { id } = await params;
  const placeId = Number(id);
  if (!Number.isInteger(placeId)) notFound();

  const place = getPlaceById(placeId);
  if (!place) notFound();

  const neighborhood = getNeighborhoodById(place.neighborhoodId);
  const reviews = getReviewsByPlace(placeId);
  const badges = getAllBadges(place);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {neighborhood ? (
        <Link
          href={`/neighborhoods/${neighborhood.id}`}
          className="text-sm text-teal-700 hover:underline dark:text-teal-400"
        >
          ← {neighborhood.name} 목록으로
        </Link>
      ) : null}

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">
            {place.name}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {neighborhood?.name ?? ""} · {place.category}
            {place.address ? ` · ${place.address}` : ""}
          </p>
        </div>
        <StarRating rating={place.avgRating} reviewCount={place.reviewCount} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <Badge key={badge.label} tone={badge.tone} icon={badge.icon}>
            {badge.label}
          </Badge>
        ))}
      </div>

      {place.description ? (
        <p className="mt-5 whitespace-pre-line text-stone-700 dark:text-stone-300">
          {place.description}
        </p>
      ) : null}

      <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-teal-200/70 bg-white p-5 sm:grid-cols-2 dark:border-teal-900/40 dark:bg-[#163431]">
        <div>
          <dt className="text-xs font-semibold text-stone-500">🎉 즐길거리</dt>
          <dd className="mt-1 text-sm text-stone-700 dark:text-stone-300">
            {place.activities || "등록된 정보가 없어요"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-stone-500">🍽️ 아이 먹거리</dt>
          <dd className="mt-1 text-sm text-stone-700 dark:text-stone-300">
            {place.kidsFoodNote || "등록된 정보가 없어요"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-stone-500">🅿️ 주차 정보</dt>
          <dd className="mt-1 text-sm text-stone-700 dark:text-stone-300">
            {place.parkingNote || "등록된 정보가 없어요"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-stone-500">제보자</dt>
          <dd className="mt-1 text-sm text-stone-700 dark:text-stone-300">
            {place.submittedBy || "익명 제보자"} · {formatDate(place.createdAt)}
          </dd>
        </div>
      </dl>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">
            방문 후기 {reviews.length > 0 ? `(${reviews.length})` : ""}
          </h2>
          <Link
            href={`/places/${place.id}/review/new`}
            className="rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600"
          >
            후기 남기기
          </Link>
        </div>

        {reviews.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-teal-300 p-6 text-center text-sm text-stone-500 dark:border-teal-900/50">
            아직 후기가 없어요. 첫 방문 후기를 남겨주세요!
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-2xl border border-teal-200/70 bg-white p-4 dark:border-teal-900/40 dark:bg-[#163431]"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-stone-700 dark:text-stone-200">
                    {review.authorName}
                    {review.childAge ? (
                      <span className="ml-2 font-normal text-stone-500">
                        아이 {review.childAge}
                      </span>
                    ) : null}
                  </span>
                  <span aria-hidden className="text-teal-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-stone-700 dark:text-stone-300">
                  {review.content}
                </p>
                <p className="mt-2 text-xs text-stone-400">{formatDate(review.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
