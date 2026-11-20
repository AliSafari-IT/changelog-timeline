import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  groupByMilestone,
  groupByStatus,
  groupByStatusAndCategory,
  groupByVersion,
  useGroupLimit,
} from '../grouping';
import { normalizeEntries } from '../model/normalize';
import { useTimelineState } from '../hooks/useTimelineState';
import type { ChangelogEntry } from '../types';

const e = (over: Partial<ChangelogEntry> & { id: string }): ChangelogEntry => ({
  category: 'feature',
  title: over.id,
  description: '',
  tags: [],
  ...over,
});

const data = normalizeEntries([
  e({ id: 'a', version: '1.0.0', date: '2026-01-01' }),
  e({ id: 'b', version: '1.10.0', date: '2026-03-01', category: 'fix' }),
  e({ id: 'c', version: '1.2.0', date: '2026-02-01' }),
  e({ id: 'd', status: 'in-progress', version: '1.11.0' }),
  e({ id: 'e', status: 'next', milestone: '1.12.0', quarter: '2027-Q2' }),
  e({ id: 'f', status: 'next', milestone: '1.13.0', quarter: '2027-Q1', category: 'security' }),
  e({ id: 'g', status: 'idea', votes: 1 }),
  e({ id: 'h', status: 'idea', votes: 5 }),
]);

const ids = (list: { id: string }[]) => list.map((x) => x.id);

describe('grouping', () => {
  it('groupByVersion: future first, releases newest first', () => {
    expect(groupByVersion(data).map((g) => g.label)).toEqual([
      'Ideas',
      'v1.13.0',
      'v1.12.0',
      'v1.11.0',
      'v1.10.0',
      'v1.2.0',
      'v1.0.0',
    ]);
  });

  it('groupByMilestone: oldest to newest along the axis', () => {
    const groups = groupByMilestone(data);
    expect(groups.map((g) => g.key)).toEqual([
      '1.0.0',
      '1.2.0',
      '1.10.0',
      '1.11.0',
      '1.12.0',
      '1.13.0',
      'Ideas',
    ]);
    expect(groups.map((g) => g.status)).toEqual([
      'shipped',
      'shipped',
      'shipped',
      'in-progress',
      'next',
      'next',
      'idea',
    ]);
    expect(ids(groups.at(-1)!.entries)).toEqual(['h', 'g']); // ideas by votes
  });

  it('groupByStatus: status order and per-status sorting', () => {
    const groups = groupByStatus(data);
    expect(groups.map((g) => g.label)).toEqual(['Shipped', 'In progress', 'Next', 'Ideas']);
    expect(ids(groups[0].entries)).toEqual(['b', 'c', 'a']); // newest version first
    expect(ids(groups[2].entries)).toEqual(['f', 'e']); // by quarter
  });

  it('groupByStatus hides empty statuses', () => {
    expect(groupByStatus(data.filter((x) => x.status === 'shipped')).map((g) => g.status)).toEqual([
      'shipped',
    ]);
  });

  it('groupByStatusAndCategory keeps only used rows and columns', () => {
    const m = groupByStatusAndCategory(data);
    expect(m.categories).toEqual(['feature', 'fix', 'security']);
    expect(m.statuses).toEqual(['shipped', 'in-progress', 'next', 'idea']);
    expect(ids(m.cell('next', 'security'))).toEqual(['f']);
    expect(m.cell('idea', 'fix')).toEqual([]);
  });
});

describe('useGroupLimit', () => {
  it('limits per group and expands one group at a time', () => {
    const { result } = renderHook(() => useGroupLimit(2));
    const items = [1, 2, 3, 4];
    expect(result.current.visible('a', items)).toEqual([1, 2]);
    expect(result.current.hiddenCount('a', items.length)).toBe(2);
    act(() => result.current.toggle('a'));
    expect(result.current.visible('a', items)).toEqual(items);
    expect(result.current.visible('b', items)).toEqual([1, 2]);
  });
});

describe('useTimelineState', () => {
  const raw = data.map(({ order: _o, ...rest }) => rest);
  const setup = () =>
    renderHook(() => useTimelineState(raw, { pageSize: 3, initialLayout: 'left' }));

  it('combines category, status and search, and resets the page', () => {
    const { result } = setup();
    expect(result.current.totalCount).toBe(8);
    expect(result.current.paged).toHaveLength(3);
    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);
    act(() => result.current.setStatus('next'));
    expect(result.current.page).toBe(1);
    expect(ids(result.current.filtered)).toEqual(['e', 'f']);
    act(() => result.current.setCategory('security'));
    expect(ids(result.current.filtered)).toEqual(['f']);
    act(() => {
      result.current.setCategory('all');
      result.current.setStatus('all');
      result.current.setQuery('2027-q2');
    });
    expect(ids(result.current.filtered)).toEqual(['e']);
  });

  it('lists the statuses present in the data', () => {
    const { result } = setup();
    expect(result.current.statuses).toEqual(['shipped', 'in-progress', 'next', 'idea']);
  });

  it('can turn pagination off', () => {
    const { result } = renderHook(() =>
      useTimelineState(raw, { pageSize: 3, paginate: false, initialLayout: 'left' })
    );
    expect(result.current.paged).toHaveLength(8);
  });
});
