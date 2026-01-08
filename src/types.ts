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
  /** @default 'left' */
  layout?: 'left' | 'center';
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