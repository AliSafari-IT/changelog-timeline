import React, { useMemo } from 'react';
import { groupByVersion } from '../grouping';
import EntryCard from '../components/EntryCard';
import type { LayoutProps } from './types';

/** left, center, right, compact and horizontal: one vertical (or horizontal) axis per version. */
const ClassicTimeline: React.FC<LayoutProps> = ({ layout, entries, query, selectedKey }) => {
  const groups = useMemo(() => groupByVersion(entries), [entries]);

  return (
    <>
      {groups.map((group) => (
        <div
          key={group.key}
          className={`version-section ${selectedKey === group.key ? 'is-highlighted' : ''}`}
          data-group-key={group.key}
        >
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
                  <div className="timeline-dot" data-category={entry.category} />
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
