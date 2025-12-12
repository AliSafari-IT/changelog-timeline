// changelog-timeline\src\index.ts
import './components/vtimeline.css';

export { default as ChangelogTimeline } from './components/ChangelogTimeline';
export type {
  ChangelogEntry,
  PaginationConfig,
  ChangelogTimelineProps,
  TimelineItemProps,
  ChangelogCategory,
} from './types';