// changelog-timeline\src\types.ts
export type ChangelogCategory =
  | 'feature'
  | 'fix'
  | 'improvement'
  | 'security'
  | 'breaking'
  | 'docs';

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  category: ChangelogCategory;
  title: string;
  description: string;
  tags: string[];
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