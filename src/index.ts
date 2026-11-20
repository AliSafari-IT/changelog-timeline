// changelog-timeline\src\index.ts
import '@asafarim/design-tokens/css';
import './styles/vtimeline.css';

export { default as ChangelogTimeline } from './components/ChangelogTimeline';
export { ENTRY_STATUSES, STATUS_LABELS } from './types';
export { normalizeEntries, groupKeyOf } from './model/normalize';
export type { NormalizedEntry } from './model/normalize';
export { compareVersions } from './model/sort';
export {
  groupByVersion,
  groupByMilestone,
  groupByStatus,
  groupByStatusAndCategory,
  useGroupLimit,
} from './grouping';
export type { EntryGroup, StatusGroup, StatusCategoryMatrix } from './grouping';
export { useTimelineState } from './hooks/useTimelineState';
export type { TimelineState, CategoryFilter, StatusFilter } from './hooks/useTimelineState';
export type {
  ChangelogEntry,
  PaginationConfig,
  ChangelogTimelineProps,
  TimelineItemProps,
  ChangelogCategory,
  TimelineLayout,
  EntryStatus,
} from './types';