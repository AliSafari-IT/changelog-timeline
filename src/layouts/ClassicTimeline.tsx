import React, { useMemo } from 'react';
import { groupByVersion } from '../grouping';
import { CATEGORY_CONFIG } from '../model/categories';
import EntryCard from '../components/EntryCard';
import type { LayoutProps } from './types';

/** left, center, right, compact and horizontal: one vertical (or horizontal) axis per version. */
const ClassicTimeline: React.FC<LayoutProps> = ({ layout, entries, query }) => {
  const groups = useMemo(() => groupByVersion(entries), [entries]);

  return (
    <>
      {groups.map((group) => (
        <div key={group.key} className="version-section">
          <div className="version-header">
            <span className="version-badge">{group.label}</span>
            <div className="version-divider" />
          </div>

          <div
            className="timeline-container"
            {...(layout === 'horizontal'
              ? {
                  tabIndex: 0,
                  role: 'group',
                  'aria-label': `Version ${group.key} entries`,
                }
              : {})}
          >
            <div className="timeline-line" />
            {group.entries.map((entry, index) => {
              const side =
                layout === 'center'
                  ? index % 2 === 0
                    ? 'timeline-item--left'
                    : 'timeline-item--right'
                  : '';
              return (
                <div key={entry.id} className={`timeline-item ${side}`}>
                  <div
                    className="timeline-dot"
                    style={{ color: CATEGORY_CONFIG[entry.category].color }}
                  />
                  <EntryCard entry={entry} query={query} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default ClassicTimeline;
