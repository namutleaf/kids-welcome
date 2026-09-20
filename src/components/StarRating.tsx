export default function StarRating({
  rating,
  reviewCount,
}: {
  rating: number | null;
  reviewCount: number;
}) {
  if (rating === null || reviewCount === 0) {
    return <span className="text-sm text-stone-500">아직 리뷰가 없어요</span>;
  }

  const rounded = Math.round(rating * 2) / 2;

  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span aria-hidden className="text-yellow-400">
        {"★".repeat(Math.round(rounded))}
        {"☆".repeat(5 - Math.round(rounded))}
      </span>
      <span className="font-medium text-stone-700 dark:text-stone-300">
        {rating.toFixed(1)}
      </span>
      <span className="text-stone-500">({reviewCount})</span>
    </span>
  );
}
