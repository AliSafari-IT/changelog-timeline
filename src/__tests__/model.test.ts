import { describe, expect, it } from 'vitest';
import { compareVersions } from '../model/sort';
import { groupKeyOf, normalizeEntries, parseEntryDate } from '../model/normalize';
import type { ChangelogEntry } from '../types';

describe('compareVersions', () => {
  const sorted = (list: string[]) => [...list].sort(compareVersions);

  it('compares numerically, not as strings', () => {
    expect(sorted(['1.10.0', '1.9.0', '1.2.3'])).toEqual(['1.2.3', '1.9.0', '1.10.0']);
  });

  it('puts pre-releases before their release', () => {
    expect(sorted(['2.0.0', '2.0.0-beta.2', '2.0.0-beta.1', '1.9.9'])).toEqual([
      '1.9.9',
      '2.0.0-beta.1',
      '2.0.0-beta.2',
      '2.0.0',
    ]);
  });

  it('treats 2.x as later than any 2.* release', () => {
    expect(sorted(['2.x', '2.9.3', '3.0.0'])).toEqual(['2.9.3', '2.x', '3.0.0']);
  });

  it('ignores a leading v', () => {
    expect(compareVersions('v1.2.0', '1.2.0')).toBe(0);
  });

  it('sorts labels after versions', () => {
    expect(sorted(['Next', '1.0.0', 'Ideas'])).toEqual(['1.0.0', 'Ideas', 'Next']);
  });
});

describe('normalizeEntries', () => {
  const base: ChangelogEntry = {
    id: '1',
    category: 'feature',
    title: 't',
    description: 'd',
    tags: [],
  };

  it('defaults status to shipped and keeps input order', () => {
    const input = [base, { ...base, id: '2', status: 'idea' as const }];
    const out = normalizeEntries(input);
    expect(out.map((e) => [e.status, e.order])).toEqual([
      ['shipped', 0],
      ['idea', 1],
    ]);
    expect(input[0]).not.toHaveProperty('order'); // no mutation
  });

  it('falls back to shipped for unknown statuses', () => {
    const out = normalizeEntries([{ ...base, status: 'bogus' as never }]);
    expect(out[0].status).toBe('shipped');
  });
});

describe('groupKeyOf', () => {
  it('uses version, then milestone, then the status label', () => {
    expect(groupKeyOf({ version: 'v1.2.0' })).toBe('1.2.0');
    expect(groupKeyOf({ milestone: '2.x', status: 'idea' })).toBe('2.x');
    expect(groupKeyOf({ status: 'next' })).toBe('Next');
    expect(groupKeyOf({ status: 'idea' })).toBe('Ideas');
    expect(groupKeyOf({})).toBe('Shipped');
  });
});

describe('parseEntryDate', () => {
  it('returns null for missing or invalid dates', () => {
    expect(parseEntryDate(undefined)).toBeNull();
    expect(parseEntryDate('not a date')).toBeNull();
    expect(parseEntryDate('2026-11-20')).toBeInstanceOf(Date);
  });
});
