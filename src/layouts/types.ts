import type { ComponentType } from 'react';
import type { TimelineLayout } from '../types';
import type { NormalizedEntry } from '../model/normalize';

export interface LayoutProps {
  layout: TimelineLayout;
  /**
   * Already filtered (search, category, status). Classic layouts get the current page;
   * roadmap layouts get every filtered entry and limit per group themselves.
   */
  entries: NormalizedEntry[];
  /** Search query to highlight in cards. */
  query: string;
}

export interface LayoutDefinition {
  label: string;
  /** Classic layouts use page-based pagination; roadmap layouts group first. */
  kind: 'classic' | 'roadmap';
  Component: ComponentType<LayoutProps>;
}
