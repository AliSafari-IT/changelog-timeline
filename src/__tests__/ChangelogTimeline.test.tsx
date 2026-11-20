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
