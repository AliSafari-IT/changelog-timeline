// Semver-aware comparison that also copes with roadmap labels.
//
// - "1.10.0" > "1.9.0" (numeric, not string, comparison)
// - "2.0.0-beta.1" < "2.0.0" (pre-releases come before the release)
// - "2.x" > "2.9.3" (a wildcard means "some later 2.* version")
// - Labels without a leading number ("Next", "Later") sort after every version.

const WILDCARDS = new Set(['x', 'X', '*']);

type Part = number | string;

const parse = (raw: string) => {
  const value = raw.trim().replace(/^v(?=\d)/i, '');
  const [core, ...pre] = value.split('-');
  const toParts = (s: string): Part[] =>
    s
      .split('.')
      .filter((p) => p !== '')
      .map((p) => (WILDCARDS.has(p) ? Infinity : /^\d+$/.test(p) ? Number(p) : p));
  return {
    isVersion: /^\d/.test(value),
    core: toParts(core ?? ''),
    pre: pre.length ? toParts(pre.join('-')) : [],
  };
};

const compareParts = (a: Part[], b: Part[]): number => {
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x === y) continue;
    if (typeof x === 'number' && typeof y === 'number') return x < y ? -1 : 1;
    if (typeof x === 'number') return -1; // numeric parts before text parts
    if (typeof y === 'number') return 1;
    return x.localeCompare(y);
  }
  return 0;
};

/** Ascending comparator for version strings and roadmap labels. */
export const compareVersions = (a: string, b: string): number => {
  const pa = parse(a);
  const pb = parse(b);
  if (pa.isVersion !== pb.isVersion) return pa.isVersion ? -1 : 1;
  if (!pa.isVersion) return a.localeCompare(b);

  const core = compareParts(pa.core, pb.core);
  if (core !== 0) return core;
  // A release ranks above its own pre-releases.
  if (pa.pre.length === 0 && pb.pre.length > 0) return 1;
  if (pa.pre.length > 0 && pb.pre.length === 0) return -1;
  return compareParts(pa.pre, pb.pre);
};

/** True when the label looks like a version number (starts with a digit, optional "v"). */
export const isVersionLabel = (label: string) => /^v?\d/i.test(label.trim());
