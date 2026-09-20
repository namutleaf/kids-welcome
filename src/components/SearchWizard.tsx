"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { WizardHeader, WizardOption } from "./WizardShell";

interface Draft {
  adults: number;
  kids: number;
  parking: "need" | "any";
  kidsChair: "need" | "any";
  kidsFood: "need" | "any";
}

type Step =
  | { kind: "count"; key: "adults" | "kids"; question: string; options: number[]; moreLabel: string }
  | { kind: "choice"; key: "parking" | "kidsChair" | "kidsFood"; question: string }
  | { kind: "review" };

const CHOICE_OPTIONS: { value: Draft["parking"]; label: string }[] = [
  { value: "need", label: "네, 필요해요" },
  { value: "any", label: "상관없어요" },
];

function buildSteps(draft: Draft): Step[] {
  const steps: Step[] = [
    { kind: "count", key: "adults", question: "어른은 몇 명이에요?", options: [1, 2, 3, 4], moreLabel: "5명 이상" },
    { kind: "count", key: "kids", question: "아이는 몇 명이에요?", options: [0, 1, 2, 3], moreLabel: "4명 이상" },
    { kind: "choice", key: "parking", question: "🅿️ 주차가 필요하세요?" },
  ];
  if (draft.kids > 0) {
    steps.push(
      { kind: "choice", key: "kidsChair", question: "🪑 아기의자가 필요하세요?" },
      { kind: "choice", key: "kidsFood", question: "🍽️ 아이 먹거리가 있으면 좋겠어요?" }
    );
  }
  steps.push({ kind: "review" });
  return steps;
}

export default function SearchWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    adults: 2,
    kids: 1,
    parking: "any",
    kidsChair: "any",
    kidsFood: "any",
  });

  const steps = buildSteps(draft);
  const safeStep = Math.min(step, steps.length - 1);
  const current = steps[safeStep];

  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stepRef.current?.querySelector<HTMLElement>("[data-active] [data-first-option] button");
    el?.focus();
  }, [safeStep]);

  function selectAndAdvance<K extends keyof Draft>(key: K, value: Draft[K]) {
    const newDraft = { ...draft, [key]: value };
    setDraft(newDraft);
    const newSteps = buildSteps(newDraft);
    setStep((s) => Math.min(s + 1, newSteps.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    const params = new URLSearchParams();
    params.set("adults", String(draft.adults));
    params.set("kids", String(draft.kids));
    if (draft.parking === "need") params.set("parking", "1");
    if (draft.kids > 0) {
      params.set("nokids", "1");
      if (draft.kidsChair === "need") params.set("chair", "1");
      if (draft.kidsFood === "need") params.set("food", "1");
    }
    router.push(`/search/results?${params.toString()}`);
  }

  return (
    <div>
      <WizardHeader step={safeStep} totalSteps={steps.length} onBack={goBack} />

      <div ref={stepRef} className="min-h-[320px] pt-8">
        <div data-active="">
          {current.kind === "count" ? (
            <fieldset>
              <legend className="text-xl font-bold text-stone-800 dark:text-stone-100">
                {current.question}
              </legend>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {current.options.map((n, j) => (
                  <span key={n} data-first-option={j === 0 ? "" : undefined}>
                    <WizardOption
                      selected={draft[current.key] === n}
                      label={`${n}명`}
                      onSelect={() => selectAndAdvance(current.key, n)}
                    />
                  </span>
                ))}
                <WizardOption
                  selected={draft[current.key] > current.options[current.options.length - 1]}
                  label={current.moreLabel}
                  onSelect={() => selectAndAdvance(current.key, current.options[current.options.length - 1] + 1)}
                />
              </div>
            </fieldset>
          ) : null}

          {current.kind === "choice" ? (
            <fieldset>
              <legend className="text-xl font-bold text-stone-800 dark:text-stone-100">
                {current.question}
              </legend>
              <div className="mt-5 space-y-2">
                {CHOICE_OPTIONS.map((opt, j) => (
                  <span key={opt.value} data-first-option={j === 0 ? "" : undefined}>
                    <WizardOption
                      selected={draft[current.key] === opt.value}
                      label={opt.label}
                      onSelect={() => selectAndAdvance(current.key, opt.value)}
                    />
                  </span>
                ))}
              </div>
            </fieldset>
          ) : null}

          {current.kind === "review" ? (
            <div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                이 조건으로 찾아볼게요
              </h2>
              <dl className="mt-5 space-y-3 rounded-2xl border border-stone-200 p-4 text-sm dark:border-stone-700">
                <Row label="어른" value={`${draft.adults}명`} />
                <Row label="아이" value={`${draft.kids}명`} />
                <Row label="주차" value={draft.parking === "need" ? "필요해요" : "상관없어요"} />
                {draft.kids > 0 ? (
                  <>
                    <Row label="아기의자" value={draft.kidsChair === "need" ? "필요해요" : "상관없어요"} />
                    <Row label="아이 먹거리" value={draft.kidsFood === "need" ? "필요해요" : "상관없어요"} />
                  </>
                ) : null}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      {current.kind === "review" ? (
        <div className="mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-full bg-amber-500 px-4 py-3.5 text-base font-semibold text-white hover:bg-amber-600"
          >
            결과 보기
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-stone-500">{label}</dt>
      <dd className="text-right font-medium text-stone-800 dark:text-stone-200">{value}</dd>
    </div>
  );
}
