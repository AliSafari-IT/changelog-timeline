import { useMemo, useState } from 'react';
import type { ChangelogCategory, EntryStatus } from '../types';
import { ENTRY_STATUSES, STATUS_LABELS } from '../types';
import { groupKeyOf, parseEntryDate, type NormalizedEntry } from '../model/normalize';
import { compareVersions, isVersionLabel } from '../model/sort';
import { CATEGORIES } from '../model/categories';

export interface EntryGroup {
  /** Stable key: version, milestone or status label. */
  key: string;
  /** Display label: "v1.2.0" for versions, the label itself otherwise. */
  label: string;
  /** Most advanced (furthest in the future) status in the group. */
  status: EntryStatus;
  entries: NormalizedEntry[];
}

const STATUS_RANK: Record<EntryStatus, number> = {
  shipped: 0,
  'in-progress': 1,
  next: 2,
  idea: 3,
};

export const labelForKey = (key: string) => (isVersionLabel(key) ? `v${key}` : key);

const groupStatus = (entries: NormalizedEntry[]): EntryStatus =>
  entries.reduce<EntryStatus>(
    (acc, entry) => (STATUS_RANK[entry.status] > STATUS_RANK[acc] ? entry.status : acc),
    'shipped'
  );

const timeOf = (entry: NormalizedEntry) => parseEntryDate(entry.date)?.getTime() ?? 0;

/**
 * Order inside a status:
 * shipped newest first; in progress and next by quarter, then version, then input order;
 * ideas by votes (most first), then input order.
 */
export const compareWithinStatus = (a: NormalizedEntry, b: NormalizedEntry): number => {
  if (a.status !== b.status) return STATUS_RANK[a.status] - STATUS_RANK[b.status];
  switch (a.status) {
    case 'shipped':
      return (
        compareVersions(b.version ?? '', a.version ?? '') ||
        timeOf(b) - timeOf(a) ||
        a.order - b.order
      );
    case 'idea':
      return (b.votes ?? 0) - (a.votes ?? 0) || a.order - b.order;
    default:
      return (
        (a.quarter ?? '￿').localeCompare(b.quarter ?? '￿') ||
        compareVersions(a.version ?? groupKeyOf(a), b.version ?? groupKeyOf(b)) ||
        a.order - b.order
      );
  }
};

const collect = (entries: readonly NormalizedEntry[]) => {
  const map = new Map<string, NormalizedEntry[]>();
  for (const entry of entries) {
    const key = groupKeyOf(entry);
    const list = map.get(key);
    if (list) list.push(entry);
    else map.set(key, [entry]);
  }
  return [...map].map<EntryGroup>(([key, list]) => ({
    key,
    label: labelForKey(key),
    status: groupStatus(list),
    entries: list,
  }));
};

/**
 * Classic changelog order: future groups first (ideas, next, in progress),
 * then releases newest first. Entries keep their input order inside a group.
 */
export const groupByVersion = (entries: readonly NormalizedEntry[]): EntryGroup[] =>
  collect(entries).sort(
    (a, b) =>
      STATUS_RANK[b.status] - STATUS_RANK[a.status] || compareVersions(b.key, a.key)
  );

/**
 * Milestones on a time axis, oldest to newest:
 * shipped versions ascending, then in progress, next and ideas.
 */
export const groupByMilestone = (entries: readonly NormalizedEntry[]): EntryGroup[] =>
  collect(entries)
    .map((group) => ({ ...group, entries: [...group.entries].sort(compareWithinStatus) }))
    .sort(
      (a, b) =>
        STATUS_RANK[a.status] - STATUS_RANK[b.status] || compareVersions(a.key, b.key)
    );

export interface StatusGroup {
  status: EntryStatus;
  label: string;
  entries: NormalizedEntry[];
}

/** One group per status that has entries, in ENTRY_STATUSES order. */
export const groupByStatus = (
  entries: readonly NormalizedEntry[],
  labels: Record<EntryStatus, string> = STATUS_LABELS
): StatusGroup[] =>
  ENTRY_STATUSES.map((status) => ({
    status,
    label: labels[status],
    entries: entries.filter((entry) => entry.status === status).sort(compareWithinStatus),
  })).filter((group) => group.entries.length > 0);

export interface StatusCategoryMatrix {
  statuses: EntryStatus[];
  categories: ChangelogCategory[];
  cell: (status: EntryStatus, category: ChangelogCategory) => NormalizedEntry[];
}

/** Statuses × categories, keeping only the rows and columns that have entries. */
export const groupByStatusAndCategory = (
  entries: readonly NormalizedEntry[]
): StatusCategoryMatrix => {
  const cells = new Map<string, NormalizedEntry[]>();
  for (const entry of [...entries].sort(compareWithinStatus)) {
    const id = `${entry.status}|${entry.category}`;
    const list = cells.get(id);
    if (list) list.push(entry);
    else cells.set(id, [entry]);
  }
  return {
    statuses: ENTRY_STATUSES.filter((s) => entries.some((e) => e.status === s)),
    categories: CATEGORIES.filter((c) => entries.some((e) => e.category === c)),
    cell: (status, category) => cells.get(`${status}|${category}`) ?? [],
  };
};

/**
 * "Show N more" per group. Returns the visible slice for a group and a toggle.
 * Roadmap layouts use this instead of page-based pagination.
 */
export const useGroupLimit = (limit: number) => {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  return useMemo(
    () => ({
      visible: <T,>(key: string, items: readonly T[]) =>
        expanded.has(key) ? items : items.slice(0, limit),
      hiddenCount: (key: string, total: number) =>
        expanded.has(key) ? 0 : Math.max(0, total - limit),
      isExpanded: (key: string) => expanded.has(key),
      toggle: (key: string) =>
        setExpanded((prev) => {
          const next = new Set(prev);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          return next;
        }),
    }),
    [expanded, limit]
  );
};
