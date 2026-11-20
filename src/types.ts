// changelog-timeline\src\types.ts
export type ChangelogCategory =
  | 'feature'
  | 'fix'
  | 'improvement'
  | 'security'
  | 'breaking'
  | 'docs';

/**
 * Where an entry is in its life cycle.
 * Entries without a status are treated as `'shipped'`, so plain changelogs keep working.
 */
export type EntryStatus = 'shipped' | 'in-progress' | 'next' | 'idea';

/** Display order of the statuses (past to future). */
export const ENTRY_STATUSES: readonly EntryStatus[] = [
  'shipped',
  'in-progress',
  'next',
  'idea',
] as const;

/** Default labels for each status. */
export const STATUS_LABELS: Record<EntryStatus, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  next: 'Next',
  idea: 'Ideas',
};

export interface ChangelogEntry {
  id: string;
  /** Release version, e.g. `'1.2.0'`. Optional for roadmap items that have none yet. */
  version?: string;
  /** ISO date (`'2026-11-20'`). Optional for roadmap items; the date line is hidden without one. */
  date?: string;
  category: ChangelogCategory;
  title: string;
  description: string;
  tags: string[];
  /** @default 'shipped' */
  status?: EntryStatus;
  /** Planning horizon for upcoming work, e.g. `'2026-Q1'`. */
  quarter?: string;
  /** Interest signal, mostly for ideas. */
  votes?: number;
  /** Group label for entries without a version, e.g. `'2.x'` or `'Later'`. */
  milestone?: string;
}

export type TimelineLayout =
  | 'left'
  | 'center'
  | 'right'
  | 'compact'
  | 'horizontal';

export interface PaginationConfig {
  page: number;  
  /** @default 10 */
  pageSize: number;
  totalCount: number;
  categoryFilter: 'all' | ChangelogCategory;
  onPageChange: (page: number) => void;
}

export interface ChangelogTimelineProps {
  entries: ChangelogEntry[];
  className?: string;
  headerClassName?: string;
  maxVisible?: number;
  showPagination?: boolean;
  searchable?: boolean;
  /**
   * Timeline type. With `layoutSwitcher` enabled this is the initial value.
   * `horizontal` falls back to the left-axis layout on narrow screens.
   * @default 'left'
   */
  layout?: TimelineLayout;
  /**
   * Show a control that lets the viewer pick the timeline type.
   * `true` offers every layout; pass an array to offer a subset.
   * @default false
   */
  layoutSwitcher?: boolean | TimelineLayout[];
  /** Called when the viewer picks a layout in the switcher. */
  onLayoutChange?: (layout: TimelineLayout) => void;
  title?: string;
  subtitle?: string;
}

export interface TimelineItemProps {
  entry: ChangelogEntry;
  isLast: boolean;
  categoryConfig: {
    color: string;
    bgColor: string;
    textColor: string;
    icon: string;
    label: string;
  };
}