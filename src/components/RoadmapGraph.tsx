import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/roadmap-graph.css';
import type { ChangelogEntry, EntryStatus } from '../types';
import { STATUS_LABELS } from '../types';
import { normalizeEntries, type NormalizedEntry } from '../model/normalize';
import { groupByMilestone, type EntryGroup } from '../grouping';

export interface RoadmapGraphProps {
  /** Entries to graph (already filtered when used inside ChangelogTimeline). */
  entries: readonly ChangelogEntry[];
  /**
   * How many of the newest shipped milestones to show; older ones collapse into
   * a "+N earlier" box that expands on click. @default 3
   */
  maxShipped?: number;
  /** Override the band labels. */
  statusLabels?: Partial<Record<EntryStatus, string>>;
  /** Called with the milestone key (version, milestone or status label) when one is picked. */
  onSelect?: (key: string) => void;
  /** Highlight a milestone, e.g. the one the viewer last picked. */
  selectedKey?: string;
  /** Accessible name and visible heading. @default 'Roadmap overview' */
  title?: string;
  className?: string;
}

interface Band {
  status: EntryStatus;
  label: string;
  groups: EntryGroup[];
  /** Number of collapsed older milestones shown as one "+N earlier" box. */
  earlier: number;
}

const summaryOf = (entries: NormalizedEntry[]) => {
  const [first] = entries;
  if (!first) return '';
  return entries.length === 1 ? first.title : `${first.title} +${entries.length - 1} more`;
};

const isNormalized = (entries: readonly ChangelogEntry[]): entries is NormalizedEntry[] =>
  entries.every((entry) => 'order' in entry && typeof entry.status === 'string');

/**
 * Shipped / In progress / Next / Ideas bands over a version axis, with a short
 * summary per milestone. Horizontal on wide containers, vertical on narrow ones.
 * Pure CSS Grid: no chart or diagram library.
 */
const RoadmapGraph: React.FC<RoadmapGraphProps> = ({
  entries,
  maxShipped = 3,
  statusLabels,
  onSelect,
  selectedKey,
  title = 'Roadmap overview',
  className = '',
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLLIElement>(null);
  const [showAllShipped, setShowAllShipped] = useState(false);

  const normalized = useMemo(
    () => (isNormalized(entries) ? entries : normalizeEntries(entries)),
    [entries]
  );
  const groups = useMemo(() => groupByMilestone(normalized), [normalized]);
  const labels = { ...STATUS_LABELS, ...statusLabels };

  const currentKey = useMemo(
    () => [...groups].reverse().find((group) => group.status === 'shipped')?.key,
    [groups]
  );

  const bands = useMemo(() => {
    const result: Band[] = [];
    for (const group of groups) {
      const last = result[result.length - 1];
      if (last && last.status === group.status) last.groups.push(group);
      else result.push({ status: group.status, label: '', groups: [group], earlier: 0 });
    }
    for (const band of result) {
      band.label = labels[band.status];
      if (band.status === 'shipped' && !showAllShipped && band.groups.length > maxShipped) {
        band.earlier = band.groups.length - Math.max(1, maxShipped);
        band.groups = band.groups.slice(band.earlier);
      }
    }
    return result;
    // labels is rebuilt each render from statusLabels; depend on its source instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, maxShipped, showAllShipped, statusLabels]);

  // Explicit column starts, so bands and the axis can share rows without auto-placement.
  const starts: number[] = [];
  const columns = bands.reduce((sum, band) => {
    starts.push(sum + 1);
    return sum + band.groups.length + (band.earlier ? 1 : 0);
  }, 0);

  // Start with the current release in view when the graph is wider than its box.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const current = currentRef.current;
    if (!scroller || !current || scroller.scrollWidth <= scroller.clientWidth) return;
    scroller.scrollLeft = current.offsetLeft - (scroller.clientWidth - current.offsetWidth) / 2;
  }, [columns]);

  if (groups.length === 0) return null;

  return (
    <section className={`ct-graph ${className}`} aria-label={title}>
      <h2 className="ct-graph__title">{title}</h2>
      <div className="ct-graph__scroller" ref={scrollerRef}>
        <div
          className="ct-graph__grid"
          style={{ '--ct-graph-cols': columns } as React.CSSProperties}
        >
          <div className="ct-graph__axis" aria-hidden="true" />
          {bands.map((band, bandIndex) => (
            <section
              key={band.status}
              className="ct-graph__band"
              data-status={band.status}
              style={
                {
                  '--ct-graph-start': starts[bandIndex],
                  '--ct-graph-span': band.groups.length + (band.earlier ? 1 : 0),
                } as React.CSSProperties
              }
              aria-label={band.label}
            >
              <h3 className="ct-graph__band-label">{band.label}</h3>
              <ol className="ct-graph__milestones">
                {band.earlier > 0 && (
                  <li className="ct-graph__milestone ct-graph__milestone--earlier">
                    <button
                      type="button"
                      className="ct-graph__node"
                      aria-expanded={false}
                      onClick={() => setShowAllShipped(true)}
                    >
                      +{band.earlier} earlier
                    </button>
                    <span className="ct-graph__tick" aria-hidden="true" />
                    <span className="ct-graph__summary">Show older releases</span>
                  </li>
                )}
                {band.groups.map((group) => {
                  const isCurrent = group.key === currentKey;
                  const pick = () => onSelect?.(group.key);
                  return (
                    <li
                      key={group.key}
                      ref={isCurrent ? currentRef : undefined}
                      className={`ct-graph__milestone ${
                        selectedKey === group.key ? 'is-selected' : ''
                      }`}
                    >
                      <button
                        type="button"
                        className="ct-graph__node"
                        aria-label={`${group.key}, ${labels[group.status].toLowerCase()}${
                          isCurrent ? ', current release' : ''
                        }: ${summaryOf(group.entries)}`}
                        aria-current={isCurrent ? 'true' : undefined}
                        aria-pressed={onSelect ? selectedKey === group.key : undefined}
                        onClick={pick}
                      >
                        {group.key}
                        {isCurrent && <span className="ct-graph__current">Current</span>}
                      </button>
                      <span className="ct-graph__tick" aria-hidden="true" />
                      <span
                        className={`ct-graph__summary ${onSelect ? 'is-clickable' : ''}`}
                        aria-hidden="true"
                        onClick={onSelect ? pick : undefined}
                      >
                        {summaryOf(group.entries)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapGraph;
