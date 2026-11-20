import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangelogCategory, ChangelogEntry, EntryStatus, TimelineLayout } from '../types';
import { STATUS_LABELS } from '../types';
import { normalizeEntries, type NormalizedEntry } from '../model/normalize';

export type CategoryFilter = 'all' | ChangelogCategory;
export type StatusFilter = 'all' | EntryStatus;

export interface TimelineStateOptions {
  /** Entries per page for page-based (classic) layouts. */
  pageSize: number;
  /** Turn page-based pagination off; `paged` is then the full filtered list. */
  paginate?: boolean;
  initialLayout: TimelineLayout;
  onLayoutChange?: (layout: TimelineLayout) => void;
}

const matchesQuery = (entry: NormalizedEntry, query: string) => {
  if (!query) return true;
  const version = entry.version?.replace(/^v/i, '');
  return [
    entry.title,
    entry.description,
    ...(version ? [version, `v${version}`] : []),
    entry.milestone ?? '',
    entry.quarter ?? '',
    STATUS_LABELS[entry.status],
    ...entry.tags,
  ]
    .join(' ')
    .toLowerCase()
    .includes(query);
};

/**
 * All filtering in one place: search, category, status, layout and pagination.
 * Layouts receive `filtered` (roadmap) or `paged` (classic) and never filter themselves.
 */
export const useTimelineState = (
  entries: readonly ChangelogEntry[],
  { pageSize, paginate = true, initialLayout, onLayoutChange }: TimelineStateOptions
) => {
  const [query, setQueryState] = useState('');
  const [category, setCategoryState] = useState<CategoryFilter>('all');
  const [status, setStatusState] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [layout, setLayoutState] = useState<TimelineLayout>(initialLayout);

  // Follow the prop when the host app changes it.
  useEffect(() => {
    setLayoutState(initialLayout);
  }, [initialLayout]);

  const normalized = useMemo(() => normalizeEntries(entries), [entries]);

  /** Statuses present in the data, so the status chips only show when useful. */
  const statuses = useMemo(
    () => [...new Set(normalized.map((entry) => entry.status))],
    [normalized]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return normalized.filter(
      (entry) =>
        (category === 'all' || entry.category === category) &&
        (status === 'all' || entry.status === status) &&
        matchesQuery(entry, q)
    );
  }, [normalized, category, status, query]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    if (!paginate) return filtered;
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize, paginate]);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setPage(1);
  }, []);
  const setCategory = useCallback((value: CategoryFilter) => {
    setCategoryState(value);
    setPage(1);
  }, []);
  const setStatus = useCallback((value: StatusFilter) => {
    setStatusState(value);
    setPage(1);
  }, []);
  const setLayout = useCallback(
    (value: TimelineLayout) => {
      setLayoutState(value);
      onLayoutChange?.(value);
    },
    [onLayoutChange]
  );

  return {
    query,
    category,
    status,
    layout,
    page: currentPage,
    pageSize,
    totalCount,
    totalPages,
    statuses,
    filtered,
    paged,
    setQuery,
    setCategory,
    setStatus,
    setLayout,
    setPage,
  };
};

export type TimelineState = ReturnType<typeof useTimelineState>;
