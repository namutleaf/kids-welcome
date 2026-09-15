"use client";

import { useActionState } from "react";
import { createPlace, PlaceFormState } from "@/lib/actions";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import {
  ATMOSPHERE_LABEL,
  FUN_LEVEL_LABEL,
  PARKING_LABEL,
  TRI_STATE_LABEL,
} from "@/lib/types";

const initialState: PlaceFormState = {};

function RadioGroup({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: { value: string; label: string }[];
  defaultValue: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-700 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 has-[:checked]:text-amber-800 dark:border-stone-700 dark:text-stone-300 dark:has-[:checked]:bg-amber-950/50"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === defaultValue}
            className="accent-amber-600"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export default function PlaceForm({ defaultNeighborhoodId }: { defaultNeighborhoodId?: string }) {
  const [state, formAction, pending] = useActionState(createPlace, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {state.error}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="neighborhoodId"
          className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
        >
          지역
        </label>
        <select
          id="neighborhoodId"
          name="neighborhoodId"
          defaultValue={defaultNeighborhoodId ?? NEIGHBORHOODS[0].id}
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
        >
          {NEIGHBORHOODS.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
          >
            장소 이름
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={80}
            placeholder="예: 서촌 마당 한옥카페"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
          >
            카테고리
          </label>
          <input
            id="category"
            name="category"
            required
            maxLength={40}
            placeholder="예: 카페, 레스토랑, 키즈카페"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
        >
          주소 / 위치 설명
        </label>
        <input
          id="address"
          name="address"
          maxLength={200}
          placeholder="예: 서울 종로구 자하문로 인근"
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
        >
          한 줄 소개
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={1000}
          rows={3}
          placeholder="어떤 곳인지 간단히 소개해주세요"
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          🪑 아기의자
        </legend>
        <div className="mt-1">
          <RadioGroup
            name="kidsChair"
            defaultValue="unknown"
            options={Object.entries(TRI_STATE_LABEL).map(([value, label]) => ({ value, label }))}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          😊 분위기 (아이 동반 시 눈치가 보이나요?)
        </legend>
        <div className="mt-1">
          <RadioGroup
            name="atmosphere"
            defaultValue="neutral"
            options={Object.entries(ATMOSPHERE_LABEL).map(([value, label]) => ({ value, label }))}
          />
        </div>
      </fieldset>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
          <input type="checkbox" name="noKidsZone" className="accent-amber-600" />
          🚫 이 곳은 노키즈존이에요
        </label>
      </div>

      <div>
        <label
          htmlFor="activities"
          className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
        >
          🎉 즐길거리
        </label>
        <input
          id="activities"
          name="activities"
          maxLength={500}
          placeholder="예: 마당에서 뛰어놀기, 키즈존, 근처 공원 산책"
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          🍽️ 아이가 먹을 만한 메뉴가 있나요?
        </legend>
        <div className="mt-1">
          <RadioGroup
            name="kidsFood"
            defaultValue="unknown"
            options={Object.entries(TRI_STATE_LABEL).map(([value, label]) => ({ value, label }))}
          />
        </div>
        <label htmlFor="kidsFoodNote" className="sr-only">
          아이 먹거리 상세 정보
        </label>
        <input
          id="kidsFoodNote"
          name="kidsFoodNote"
          maxLength={300}
          placeholder="예: 감자튀김, 계란찜, 유아용 식기 제공 등"
          className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
        />
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          🎈 아이가 지겨워하지 않을까요?
        </legend>
        <div className="mt-1">
          <RadioGroup
            name="kidsFunLevel"
            defaultValue="okay"
            options={Object.entries(FUN_LEVEL_LABEL).map(([value, label]) => ({ value, label }))}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          🅿️ 주차
        </legend>
        <div className="mt-1">
          <RadioGroup
            name="parking"
            defaultValue="unknown"
            options={Object.entries(PARKING_LABEL).map(([value, label]) => ({ value, label }))}
          />
        </div>
        <label htmlFor="parkingNote" className="sr-only">
          주차 상세 정보
        </label>
        <input
          id="parkingNote"
          name="parkingNote"
          maxLength={300}
          placeholder="예: 건물 지하주차장 2시간 무료"
          className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
        />
      </fieldset>

      <div>
        <label
          htmlFor="submittedBy"
          className="block text-sm font-semibold text-stone-700 dark:text-stone-300"
        >
          제보자 이름 (선택)
        </label>
        <input
          id="submittedBy"
          name="submittedBy"
          maxLength={40}
          placeholder="닉네임 (입력 안 하면 '익명 제보자'로 표시돼요)"
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#2a2019]"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-amber-500 px-4 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
      >
        {pending ? "등록 중..." : "장소 등록하기"}
      </button>
    </form>
  );
}
