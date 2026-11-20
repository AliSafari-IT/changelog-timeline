import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ChangelogTimeline from '../components/ChangelogTimeline';
import type { ChangelogEntry } from '../types';

const entries: ChangelogEntry[] = [
  {
    id: '1',
    version: '1.1.0',
    date: '2026-11-01',
    category: 'feature',
    title: 'Add search',
    description: 'Search titles and tags',
    tags: ['ui'],
  },
  {
    id: '2',
    version: '1.0.1',
    date: '2026-10-20',
    category: 'fix',
    title: 'Fix pagination',
    description: 'Buttons align again',
    tags: ['ui'],
  },
];

afterEach(cleanup);

describe('ChangelogTimeline', () => {
  it('renders versions newest first', () => {
    render(<ChangelogTimeline entries={entries} />);
    const badges = screen.getAllByText(/^v\d/).map((el) => el.textContent);
    expect(badges).toEqual(['v1.1.0', 'v1.0.1']);
  });

  it('filters by category', () => {
    render(<ChangelogTimeline entries={entries} />);
    fireEvent.click(screen.getByRole('button', { name: /Bug Fix/ }));
    expect(screen.queryByText('Add search')).toBeNull();
    expect(screen.getByText('Fix pagination')).toBeTruthy();
  });

  it('searches titles', () => {
    render(<ChangelogTimeline entries={entries} searchable />);
    fireEvent.change(screen.getByLabelText('Search changelog'), {
      target: { value: 'pagination' },
    });
    expect(screen.queryByText('Add search')).toBeNull();
  });

  it('offers a layout switcher', () => {
    const { container } = render(<ChangelogTimeline entries={entries} layoutSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: 'Compact' }));
    expect(container.firstElementChild?.className).toContain('changelog-timeline--compact');
  });
});

describe('roadmap entries', () => {
  const roadmap: ChangelogEntry[] = [
    ...entries,
    {
      id: '3',
      category: 'feature',
      title: 'Board layout',
      description: 'Columns per status',
      tags: [],
      status: 'next',
      quarter: '2027-Q1',
      milestone: '1.3.0',
    },
    {
      id: '4',
      category: 'improvement',
      title: 'Accordion feed',
      description: 'Collapsible releases',
      tags: [],
      status: 'idea',
      votes: 3,
    },
  ];

  it('renders entries without version or date', () => {
    render(<ChangelogTimeline entries={roadmap} />);
    expect(screen.getByText('Accordion feed')).toBeTruthy();
    expect(screen.queryByText(/Invalid Date/)).toBeNull();
    expect(screen.getByText('3 votes')).toBeTruthy();
    expect(screen.getByText('2027-Q1')).toBeTruthy();
  });

  it('lists future groups first, then releases newest first', () => {
    render(<ChangelogTimeline entries={roadmap} />);
    const badges = Array.from(document.querySelectorAll('.version-badge')).map(
      (el) => el.textContent
    );
    expect(badges).toEqual(['Ideas', 'v1.3.0', 'v1.1.0', 'v1.0.1']);
  });

  it('finds roadmap items by status and quarter', () => {
    render(<ChangelogTimeline entries={roadmap} searchable />);
    const search = screen.getByLabelText('Search changelog');
    fireEvent.change(search, { target: { value: 'ideas' } });
    expect(screen.getByText('Accordion feed')).toBeTruthy();
    expect(screen.queryByText('Add search')).toBeNull();
    fireEvent.change(search, { target: { value: '2027-q1' } });
    expect(screen.getByText('Board layout')).toBeTruthy();
  });
});
