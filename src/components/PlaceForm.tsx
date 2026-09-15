"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPlace, PlaceFormState } from "@/lib/actions";
import { NEIGHBORHOODS, getNeighborhoodById } from "@/lib/neighborhoods";
import {
  ATMOSPHERE_LABEL,
  FUN_LEVEL_LABEL,
  PARKING_LABEL,
  TRI_STATE_LABEL,
  Atmosphere,
  FunLevel,
  ParkingLevel,
  TriState,
} from "@/lib/types";
import { WizardHeader, WizardOption } from "./WizardShell";

const initialState: PlaceFormState = {};

interface Draft {
  neighborhoodId: string;
  name: string;
  category: string;
  address: string;
  description: string;
  kidsChair: TriState;
  atmosphere: Atmosphere;
  activities: string;
  kidsFood: TriState;
  kidsFoodNote: string;
  kidsFunLevel: FunLevel;
  parking: ParkingLevel;
  parkingNote: string;
  submittedBy: string;
}

type Step =
  | { kind: "neighborhood" }
  | {
      kind: "text";
      key: "name" | "category" | "address" | "description" | "activities" | "submittedBy";
      question: string;
      placeholder: string;
      required?: boolean;
      multiline?: boolean;
    }
  | {
      kind: "choice";
      key: "kidsChair" | "atmosphere" | "kidsFood" | "kidsFunLevel" | "parking";
      question: string;
      options: { value: string; label: string }[];
      noteKey?: "kidsFoodNote" | "parkingNote";
      notePlaceholder?: string;
    }
  | { kind: "review" };

const STEPS: Step[] = [
  { kind: "neighborhood" },
  { kind: "text", key: "name", question: "장소 이름이 뭔가요?", placeholder: "예: 서촌 마당 한옥카페", required: true },
  { kind: "text", key: "category", question: "어떤 종류의 장소예요?", placeholder: "예: 카페, 레스토랑, 키즈카페", required: true },
  { kind: "text", key: "address", question: "위치가 어디예요?", placeholder: "예: 서울 종로구 자하문로 인근 (몰라도 괜찮아요)" },
  { kind: "text", key: "description", question: "한 줄로 소개해주세요", placeholder: "어떤 곳인지 간단히 알려주세요", multiline: true },
  {
    kind: "choice",
    key: "kidsChair",
    question: "🪑 아기의자가 있나요?",
    options: (Object.keys(TRI_STATE_LABEL) as TriState[]).map((v) => ({ value: v, label: TRI_STATE_LABEL[v] })),
  },
  {
    kind: "choice",
    key: "atmosphere",
    question: "😊 아이랑 가면 눈치가 보이나요?",
    options: (Object.keys(ATMOSPHERE_LABEL) as Atmosphere[]).map((v) => ({ value: v, label: ATMOSPHERE_LABEL[v] })),
  },
  { kind: "text", key: "activities", question: "🎉 아이가 즐길 거리가 있나요?", placeholder: "예: 마당에서 뛰어놀기, 키즈존, 근처 공원 산책" },
  {
    kind: "choice",
    key: "kidsFood",
    question: "🍽️ 아이가 먹을 만한 메뉴가 있나요?",
    options: (Object.keys(TRI_STATE_LABEL) as TriState[]).map((v) => ({ value: v, label: TRI_STATE_LABEL[v] })),
    noteKey: "kidsFoodNote",
    notePlaceholder: "예: 감자튀김, 계란찜, 유아용 식기 제공 등 (선택)",
  },
  {
    kind: "choice",
    key: "kidsFunLevel",
    question: "🎈 아이가 지겨워하지 않을까요?",
    options: (Object.keys(FUN_LEVEL_LABEL) as FunLevel[]).map((v) => ({ value: v, label: FUN_LEVEL_LABEL[v] })),
  },
  {
    kind: "choice",
    key: "parking",
    question: "🅿️ 주차는 어때요?",
    options: (Object.keys(PARKING_LABEL) as ParkingLevel[]).map((v) => ({ value: v, label: PARKING_LABEL[v] })),
    noteKey: "parkingNote",
    notePlaceholder: "예: 건물 지하주차장 2시간 무료 (선택)",
  },
  { kind: "text", key: "submittedBy", question: "제보자님 이름을 알려주세요", placeholder: "닉네임 (입력 안 하면 '익명 제보자'로 표시돼요)" },
  { kind: "review" },
];

export default function PlaceForm({ defaultNeighborhoodId }: { defaultNeighborhoodId?: string }) {
  const [state, formAction, pending] = useActionState(createPlace, initialState);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    neighborhoodId: defaultNeighborhoodId ?? NEIGHBORHOODS[0].id,
    name: "",
    category: "",
    address: "",
    description: "",
    kidsChair: "unknown",
    atmosphere: "neutral",
    activities: "",
    kidsFood: "unknown",
    kidsFoodNote: "",
    kidsFunLevel: "okay",
    parking: "unknown",
    parkingNote: "",
    submittedBy: "",
  });

  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stepRef.current?.querySelector<HTMLElement>(
      "[data-active] input, [data-active] textarea, [data-active] [data-first-option] button"
    );
    el?.focus();
  }, [step]);

  const current = STEPS[step];
  const isValid = current.kind !== "text" || !current.required || draft[current.key].trim().length > 0;

  function goNext() {
    if (!isValid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  const selectedNeighborhood = getNeighborhoodById(draft.neighborhoodId);

  return (
    <form
      action={formAction}
      onKeyDown={(e) => {
        if (e.key === "Enter" && current.kind !== "review" && !(current.kind === "text" && current.multiline)) {
          e.preventDefault();
          goNext();
        }
      }}
    >
      <WizardHeader step={step} totalSteps={STEPS.length} onBack={goBack} />

      {state.error ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {state.error}
        </p>
      ) : null}

      <input type="hidden" name="neighborhoodId" value={draft.neighborhoodId} />
      <input type="hidden" name="kidsChair" value={draft.kidsChair} />
      <input type="hidden" name="atmosphere" value={draft.atmosphere} />
      <input type="hidden" name="kidsFood" value={draft.kidsFood} />
      <input type="hidden" name="kidsFunLevel" value={draft.kidsFunLevel} />
      <input type="hidden" name="parking" value={draft.parking} />

      <div ref={stepRef} className="min-h-[320px] pt-8">
        {STEPS.map((s, i) => (
          <div key={i} hidden={i !== step} data-active={i === step ? "" : undefined}>
            {s.kind === "neighborhood" ? (
              <fieldset>
                <legend className="text-xl font-bold text-stone-800 dark:text-stone-100">
                  어느 동네예요?
                </legend>
                <div className="mt-5 grid max-h-[420px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {NEIGHBORHOODS.map((n, j) => (
                    <span key={n.id} data-first-option={j === 0 ? "" : undefined}>
                      <WizardOption
                        selected={draft.neighborhoodId === n.id}
                        label={n.name}
                        hint={n.tagline}
                        onSelect={() => update("neighborhoodId", n.id)}
                      />
                    </span>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {s.kind === "text" ? (
              <div>
                <label
                  htmlFor={`field-${s.key}`}
                  className="block text-xl font-bold text-stone-800 dark:text-stone-100"
                >
                  {s.question}
                </label>
                {s.multiline ? (
                  <textarea
                    id={`field-${s.key}`}
                    name={s.key}
                    rows={3}
                    maxLength={1000}
                    value={draft[s.key]}
                    onChange={(e) => update(s.key, e.target.value)}
                    placeholder={s.placeholder}
                    className="mt-5 w-full rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-base dark:border-stone-700 dark:bg-[#2a2019]"
                  />
                ) : (
                  <input
                    id={`field-${s.key}`}
                    name={s.key}
                    maxLength={s.key === "category" ? 40 : 80}
                    value={draft[s.key]}
                    onChange={(e) => update(s.key, e.target.value)}
                    placeholder={s.placeholder}
                    className="mt-5 w-full rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-base dark:border-stone-700 dark:bg-[#2a2019]"
                  />
                )}
                {s.required ? (
                  <p className="mt-2 text-xs text-stone-400">꼭 알려주셔야 다음으로 갈 수 있어요</p>
                ) : (
                  <p className="mt-2 text-xs text-stone-400">몰라도 괜찮아요, 비워두고 넘어가도 돼요</p>
                )}
              </div>
            ) : null}

            {s.kind === "choice" ? (
              <fieldset>
                <legend className="text-xl font-bold text-stone-800 dark:text-stone-100">
                  {s.question}
                </legend>
                <div className="mt-5 space-y-2">
                  {s.options.map((opt, j) => (
                    <span key={opt.value} data-first-option={j === 0 ? "" : undefined}>
                      <WizardOption
                        selected={draft[s.key] === opt.value}
                        label={opt.label}
                        onSelect={() => update(s.key, opt.value as never)}
                      />
                    </span>
                  ))}
                </div>
                {s.noteKey ? (
                  <div className="mt-4">
                    <label htmlFor={`field-${s.noteKey}`} className="sr-only">
                      상세 정보
                    </label>
                    <input
                      id={`field-${s.noteKey}`}
                      name={s.noteKey}
                      maxLength={300}
                      value={draft[s.noteKey]}
                      onChange={(e) => update(s.noteKey!, e.target.value)}
                      placeholder={s.notePlaceholder}
                      className="w-full rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
                    />
                  </div>
                ) : null}
              </fieldset>
            ) : null}

            {s.kind === "review" ? (
              <div>
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                  이 내용으로 등록할까요?
                </h2>
                <dl className="mt-5 space-y-3 rounded-2xl border border-stone-200 p-4 text-sm dark:border-stone-700">
                  <Row label="지역" value={selectedNeighborhood?.name ?? "-"} />
                  <Row label="장소 이름" value={draft.name} />
                  <Row label="카테고리" value={draft.category} />
                  <Row label="주소" value={draft.address || "미입력"} />
                  <Row label="아기의자" value={TRI_STATE_LABEL[draft.kidsChair]} />
                  <Row label="분위기" value={ATMOSPHERE_LABEL[draft.atmosphere]} />
                  <Row label="아이 먹거리" value={TRI_STATE_LABEL[draft.kidsFood]} />
                  <Row label="주차" value={PARKING_LABEL[draft.parking]} />
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
            className="w-full rounded-full bg-amber-500 px-4 py-3.5 text-base font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
          >
            {pending ? "등록 중..." : "장소 등록하기"}
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
            data-testid="wizard-next"
            className="w-full rounded-full bg-amber-500 px-4 py-3.5 text-base font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        )}
      </div>
    </form>
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
