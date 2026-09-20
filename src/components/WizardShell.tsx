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
          className="h-full rounded-full bg-teal-500 transition-all duration-300"
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
  center = false,
}: {
  selected: boolean;
  label: string;
  hint?: string;
  onSelect: () => void;
  center?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border-2 px-4 py-3.5 transition-all duration-150 ${
        center ? "text-center" : "text-left"
      } ${
        selected
          ? "border-teal-600 bg-teal-600 shadow-md shadow-teal-600/20"
          : "border-stone-200 hover:border-teal-300 hover:bg-teal-50/60 dark:border-stone-700 dark:hover:border-teal-700 dark:hover:bg-teal-950/20"
      }`}
    >
      <span
        className={`block text-sm font-semibold ${
          selected ? "text-white" : "text-stone-700 dark:text-stone-200"
        }`}
      >
        {label}
      </span>
      {hint ? (
        <span className={`mt-0.5 block text-xs ${selected ? "text-teal-50/90" : "text-stone-500"}`}>
          {hint}
        </span>
      ) : null}
    </button>
  );
}
