"use client";

export function WizardHeader({
  step,
  totalSteps,
  onBack,
}: {
  step: number;
  totalSteps: number;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="이전 질문으로"
        className={`shrink-0 rounded-full p-1.5 text-lg text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 ${
          step === 0 ? "invisible" : ""
        }`}
      >
        ←
      </button>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-300"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-medium text-stone-400">
        {step + 1} / {totalSteps}
      </span>
    </div>
  );
}

export function WizardOption({
  selected,
  label,
  hint,
  onSelect,
}: {
  selected: boolean;
  label: string;
  hint?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border-2 px-4 py-3.5 text-left transition-colors ${
        selected
          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40"
          : "border-stone-200 hover:border-stone-300 dark:border-stone-700 dark:hover:border-stone-600"
      }`}
    >
      <span
        className={`block text-sm font-semibold ${
          selected ? "text-amber-800 dark:text-amber-200" : "text-stone-700 dark:text-stone-200"
        }`}
      >
        {label}
      </span>
      {hint ? <span className="mt-0.5 block text-xs text-stone-500">{hint}</span> : null}
    </button>
  );
}
