"use client";

import { useActionState, useState } from "react";
import { mergePlaces, MergeFormState } from "@/lib/actions";

const initialState: MergeFormState = {};

interface PairPlace {
  id: number;
  name: string;
  category: string;
  address: string;
  reviewCount: number;
  createdAt: string;
}

const inputClass =
  "w-full rounded-xl border-2 border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-[#163431]";
const submitClass =
  "rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50";

function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>;
}

export function MergePairForm({ a, b }: { a: PairPlace; b: PairPlace }) {
  const [state, formAction, pending] = useActionState(mergePlaces, initialState);
  const [keepId, setKeepId] = useState(a.reviewCount >= b.reviewCount ? a.id : b.id);
  const removeId = keepId === a.id ? b.id : a.id;

  return (
    <form action={formAction} className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-[#163431]">
      <p className="text-xs font-semibold text-stone-500">남길 장소를 고르세요</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {[a, b].map((p) => (
          <label
            key={p.id}
            className={`cursor-pointer rounded-xl border-2 p-3 text-sm ${
              keepId === p.id
                ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40"
                : "border-stone-200 dark:border-stone-700"
            }`}
          >
            <input
              type="radio"
              name="keepChoice"
              className="sr-only"
              checked={keepId === p.id}
              onChange={() => setKeepId(p.id)}
            />
            <span className="block font-semibold text-stone-800 dark:text-stone-100">
              #{p.id} {p.name}
            </span>
            <span className="mt-0.5 block text-xs text-stone-500">
              {p.category}
              {p.address ? ` · ${p.address}` : ""}
            </span>
            <span className="mt-0.5 block text-xs text-stone-500">
              후기 {p.reviewCount}개 · {new Date(p.createdAt).toLocaleDateString("ko-KR")} 등록
            </span>
            {keepId === p.id ? (
              <span className="mt-1 inline-block text-xs font-bold text-teal-700 dark:text-teal-300">남김</span>
            ) : (
              <span className="mt-1 inline-block text-xs font-bold text-rose-600">후기만 옮기고 삭제</span>
            )}
          </label>
        ))}
      </div>
      <input type="hidden" name="keepId" value={keepId} />
      <input type="hidden" name="removeId" value={removeId} />
      <div className="mt-3 flex gap-2">
        <input type="password" name="password" placeholder="관리자 비밀번호" required className={inputClass} />
        <button type="submit" disabled={pending} className={`shrink-0 ${submitClass}`}>
          {pending ? "병합 중..." : "병합"}
        </button>
      </div>
      <ErrorText error={state.error} />
    </form>
  );
}

export function ManualMergeForm() {
  const [state, formAction, pending] = useActionState(mergePlaces, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-[#163431]">
      <div className="grid gap-2 sm:grid-cols-2">
        <input type="number" name="keepId" min={1} required placeholder="남길 장소 ID" className={inputClass} />
        <input type="number" name="removeId" min={1} required placeholder="없앨 장소 ID" className={inputClass} />
      </div>
      <div className="mt-2 flex gap-2">
        <input type="password" name="password" placeholder="관리자 비밀번호" required className={inputClass} />
        <button type="submit" disabled={pending} className={`shrink-0 ${submitClass}`}>
          {pending ? "병합 중..." : "병합"}
        </button>
      </div>
      <ErrorText error={state.error} />
    </form>
  );
}
