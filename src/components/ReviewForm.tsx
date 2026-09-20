"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createReview, ReviewFormState } from "@/lib/actions";
import { WizardHeader } from "./WizardShell";

const initialState: ReviewFormState = {};

interface Draft {
  rating: number;
  content: string;
  authorName: string;
  childAge: string;
}

type Step =
  | { kind: "rating" }
  | { kind: "content" }
  | { kind: "authorName" }
  | { kind: "childAge" }
  | { kind: "review" };

const STEPS: Step[] = [
  { kind: "rating" },
  { kind: "content" },
  { kind: "authorName" },
  { kind: "childAge" },
  { kind: "review" },
];

export default function ReviewForm({ placeId }: { placeId: number }) {
  const [state, formAction, pending] = useActionState(createReview, initialState);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ rating: 5, content: "", authorName: "", childAge: "" });

  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stepRef.current?.querySelector<HTMLElement>(
      "[data-active] input, [data-active] textarea, [data-active] [data-first-option] button"
    );
    el?.focus();
  }, [step]);

  const current = STEPS[step];
  const isValid = current.kind !== "content" || draft.content.trim().length >= 2;

  function goNext() {
    if (!isValid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <form
      action={formAction}
      onKeyDown={(e) => {
        if (e.key === "Enter" && current.kind !== "review" && current.kind !== "content") {
          e.preventDefault();
          goNext();
        }
      }}
    >
      <input type="hidden" name="placeId" value={placeId} />
      <input type="hidden" name="rating" value={draft.rating} />

      <WizardHeader step={step} totalSteps={STEPS.length} onBack={goBack} />

      {state.error ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {state.error}
        </p>
      ) : null}

      <div ref={stepRef} className="min-h-[280px] pt-8">
        {STEPS.map((s, i) => (
          <div key={i} hidden={i !== step} data-active={i === step ? "" : undefined}>
            {s.kind === "rating" ? (
              <div>
                <p id="rating-label" className="text-xl font-bold text-stone-800 dark:text-stone-100">
                  별점을 매겨주세요
                </p>
                <div className="mt-6 flex items-center gap-2" role="group" aria-labelledby="rating-label">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      data-first-option={value === 1 ? "" : undefined}
                      onClick={() => setDraft((d) => ({ ...d, rating: value }))}
                      className="text-4xl leading-none"
                      aria-label={`${value}점`}
                    >
                      <span
                        aria-hidden
                        className={value <= draft.rating ? "text-teal-500" : "text-stone-300"}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {s.kind === "content" ? (
              <div>
                <label
                  htmlFor="content"
                  className="block text-xl font-bold text-stone-800 dark:text-stone-100"
                >
                  후기를 들려주세요
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  minLength={2}
                  maxLength={1000}
                  rows={5}
                  value={draft.content}
                  onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                  placeholder="아이와 방문했던 경험을 공유해주세요"
                  className="mt-5 w-full rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-base dark:border-stone-700 dark:bg-[#163431]"
                />
              </div>
            ) : null}

            {s.kind === "authorName" ? (
              <div>
                <label
                  htmlFor="authorName"
                  className="block text-xl font-bold text-stone-800 dark:text-stone-100"
                >
                  닉네임을 알려주세요
                </label>
                <input
                  id="authorName"
                  name="authorName"
                  maxLength={40}
                  value={draft.authorName}
                  onChange={(e) => setDraft((d) => ({ ...d, authorName: e.target.value }))}
                  placeholder="입력 안 하면 '익명'으로 표시돼요"
                  className="mt-5 w-full rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-base dark:border-stone-700 dark:bg-[#163431]"
                />
                <p className="mt-2 text-xs text-stone-400">몰라도 괜찮아요, 비워두고 넘어가도 돼요</p>
              </div>
            ) : null}

            {s.kind === "childAge" ? (
              <div>
                <label
                  htmlFor="childAge"
                  className="block text-xl font-bold text-stone-800 dark:text-stone-100"
                >
                  아이 나이가 어떻게 되나요?
                </label>
                <input
                  id="childAge"
                  name="childAge"
                  maxLength={30}
                  value={draft.childAge}
                  onChange={(e) => setDraft((d) => ({ ...d, childAge: e.target.value }))}
                  placeholder="예: 24개월, 5세"
                  className="mt-5 w-full rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-base dark:border-stone-700 dark:bg-[#163431]"
                />
                <p className="mt-2 text-xs text-stone-400">몰라도 괜찮아요, 비워두고 넘어가도 돼요</p>
              </div>
            ) : null}

            {s.kind === "review" ? (
              <div>
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                  이 내용으로 등록할까요?
                </h2>
                <dl className="mt-5 space-y-3 rounded-2xl border border-stone-200 p-4 text-sm dark:border-stone-700">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-stone-500">별점</dt>
                    <dd aria-hidden className="text-teal-500">
                      {"★".repeat(draft.rating)}
                      {"☆".repeat(5 - draft.rating)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="shrink-0 text-stone-500">닉네임</dt>
                    <dd className="text-right font-medium text-stone-800 dark:text-stone-200">
                      {draft.authorName || "익명"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">후기</dt>
                    <dd className="mt-1 whitespace-pre-line font-medium text-stone-800 dark:text-stone-200">
                      {draft.content}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-8">
        {current.kind === "review" ? (
          <button
            key="submit"
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-teal-500 px-4 py-3.5 text-base font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
          >
            {pending ? "등록 중..." : "후기 등록하기"}
          </button>
        ) : (
          <button
            key="next"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              goNext();
            }}
            disabled={!isValid}
            className="w-full rounded-full bg-teal-500 px-4 py-3.5 text-base font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        )}
      </div>
    </form>
  );
}
