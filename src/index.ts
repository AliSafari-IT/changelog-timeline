// changelog-timeline\src\index.ts
import '@asafarim/design-tokens/css';
import './styles/vtimeline.css';

export { default as ChangelogTimeline } from './components/ChangelogTimeline';
export type {
  ChangelogEntry,
  PaginationConfig,
  ChangelogTimelineProps,
  TimelineItemProps,
  ChangelogCategory,
} from './types';