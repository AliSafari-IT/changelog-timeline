import type { TimelineLayout } from '../types';
import ClassicTimeline from './ClassicTimeline';
import type { LayoutDefinition } from './types';

/**
 * Every layout the component can render. Adding a layout means one component file
 * plus one line here (and the name in the TimelineLayout union).
 */
export const LAYOUTS: Record<TimelineLayout, LayoutDefinition> = {
  left: { label: 'Left', kind: 'classic', Component: ClassicTimeline },
  center: { label: 'Center', kind: 'classic', Component: ClassicTimeline },
  right: { label: 'Right', kind: 'classic', Component: ClassicTimeline },
  compact: { label: 'Compact', kind: 'classic', Component: ClassicTimeline },
  horizontal: { label: 'Horizontal', kind: 'classic', Component: ClassicTimeline },
};

export const ALL_LAYOUTS = Object.keys(LAYOUTS) as TimelineLayout[];
