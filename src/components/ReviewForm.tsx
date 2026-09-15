"use client";

import { useActionState, useState } from "react";
import { createReview, ReviewFormState } from "@/lib/actions";

const initialState: ReviewFormState = {};

export default function ReviewForm({ placeId }: { placeId: number }) {
  const [state, formAction, pending] = useActionState(createReview, initialState);
  const [rating, setRating] = useState(5);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="placeId" value={placeId} />

      {state.error ? (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {state.error}
        </p>
      ) : null}

      <div>
        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
          별점
        </label>
        <div className="mt-1 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="text-2xl leading-none"
              aria-label={`${value}점`}
            >
              <span aria-hidden className={value <= rating ? "text-amber-500" : "text-stone-300"}>
                ★
              </span>
            </button>
          ))}
          <input type="hidden" name="rating" value={rating} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
          >
            닉네임 (선택)
          </label>
          <input
            id="authorName"
            name="authorName"
            maxLength={40}
            placeholder="입력 안 하면 '익명'으로 표시돼요"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
          />
        </div>
        <div>
          <label
            htmlFor="childAge"
            className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
          >
            아이 나이 (선택)
          </label>
          <input
            id="childAge"
            name="childAge"
            maxLength={30}
            placeholder="예: 24개월, 5세"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
        >
          후기 내용
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={2}
          maxLength={1000}
          rows={5}
          placeholder="아이와 방문했던 경험을 공유해주세요"
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-amber-500 px-4 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
      >
        {pending ? "등록 중..." : "후기 등록하기"}
      </button>
    </form>
  );
}
