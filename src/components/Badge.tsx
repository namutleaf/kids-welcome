type Tone = "good" | "warn" | "bad" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  warn: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  bad: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  neutral: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

export default function Badge({
  children,
  tone = "neutral",
  icon,
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {icon ? (
        <span aria-hidden className="text-sm leading-none">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
