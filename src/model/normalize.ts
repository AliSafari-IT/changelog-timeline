import type { ChangelogEntry, EntryStatus } from '../types';
import { ENTRY_STATUSES, STATUS_LABELS } from '../types';

export interface NormalizedEntry extends ChangelogEntry {
  status: EntryStatus;
  /** Position in the input array, used as a stable tie-breaker. */
  order: number;
}

const isStatus = (value: unknown): value is EntryStatus =>
  typeof value === 'string' && (ENTRY_STATUSES as readonly string[]).includes(value);

/**
 * Fill in defaults without mutating the input:
 * a missing (or unknown) status becomes 'shipped', and every entry gets its input order.
 */
export const normalizeEntries = (entries: readonly ChangelogEntry[]): NormalizedEntry[] =>
  entries.map((entry, order) => ({
    ...entry,
    status: isStatus(entry.status) ? entry.status : 'shipped',
    order,
  }));

/**
 * The label an entry is grouped under: its version, else its milestone,
 * else the status label ("Next", "Ideas", ...).
 */
export const groupKeyOf = (entry: Pick<ChangelogEntry, 'version' | 'milestone' | 'status'>) => {
  const version = entry.version?.trim();
  if (version) return version.replace(/^v(?=\d)/i, '');
  const milestone = entry.milestone?.trim();
  if (milestone) return milestone;
  return STATUS_LABELS[isStatus(entry.status) ? entry.status : 'shipped'];
};

/** A parsed date, or null when the entry has no usable date. */
export const parseEntryDate = (date: string | undefined): Date | null => {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
