export function normalizePlaceName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFC")
    .replace(/[\s\p{P}\p{S}]/gu, "");
}

function levenshtein(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  let prev = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    const curr = [i];
    for (let j = 1; j <= y.length; j++) {
      const cost = x[i - 1] === y[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[y.length];
}

// "서촌마당카페" vs "서촌 마당 한옥카페": containment catches added words,
// edit-distance ratio catches typos.
export function arePlaceNamesSimilar(a: string, b: string): boolean {
  const na = normalizePlaceName(a);
  const nb = normalizePlaceName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;

  const shorter = na.length <= nb.length ? na : nb;
  const longer = na.length <= nb.length ? nb : na;
  if ([...shorter].length >= 3 && longer.includes(shorter)) return true;

  const maxLen = Math.max([...na].length, [...nb].length);
  return 1 - levenshtein(na, nb) / maxLen >= 0.75;
}
