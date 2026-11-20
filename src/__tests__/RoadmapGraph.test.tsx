import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import RoadmapGraph from '../components/RoadmapGraph';
import ChangelogTimeline from '../components/ChangelogTimeline';
import type { ChangelogEntry } from '../types';

afterEach(cleanup);

const e = (over: Partial<ChangelogEntry> & { id: string }): ChangelogEntry => ({
  category: 'feature',
  title: `Title ${over.id}`,
  description: '',
  tags: [],
  ...over,
});

// The react-privacy-consent roadmap.
const consent: ChangelogEntry[] = [
  e({ id: '1', version: '1.0.0', date: '2026-01-01', title: 'Banner, modal, categories' }),
  e({ id: '2', version: '1.7.0', date: '2026-08-01', title: 'Consent survives reloads' }),
  e({ id: '3', version: '1.7.2', date: '2026-11-01', title: 'Theme follows data-theme' }),
  e({ id: '4', status: 'next', milestone: '1.8.0', title: 'Block scripts until consent' }),
  e({ id: '5', status: 'next', milestone: '1.9.0', title: 'AI consent and AI disclosures' }),
  e({ id: '6', status: 'next', milestone: '2.0.0', title: 'Consent receipts and server sync' }),
  e({ id: '7', status: 'idea', milestone: '2.x', title: 'Ad-tech standards, NL FR DE EN texts' }),
];

describe('RoadmapGraph', () => {
  it('draws bands in status order with milestones on the axis', () => {
    render(<RoadmapGraph entries={consent} />);
    const graph = screen.getByRole('region', { name: 'Roadmap overview' });
    const bands = within(graph).getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(bands).toEqual(['Shipped', 'Next', 'Ideas']);
    const nodes = within(graph)
      .getAllByRole('button')
      .map((b) => b.textContent);
    expect(nodes).toEqual(['1.0.0', '1.7.0', '1.7.2Current', '1.8.0', '1.9.0', '2.0.0', '2.x']);
  });

  it('marks the newest shipped milestone as current', () => {
    render(<RoadmapGraph entries={consent} />);
    const current = screen.getByRole('button', { current: true });
    expect(current.getAttribute('aria-label')).toMatch(/^1\.7\.2, shipped, current release/);
  });

  it('folds older shipped releases and expands them', () => {
    render(<RoadmapGraph entries={consent} maxShipped={2} />);
    expect(screen.queryByRole('button', { name: /^1\.0\.0/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '+1 earlier' }));
    expect(screen.getByRole('button', { name: /^1\.0\.0/ })).toBeTruthy();
  });

  it('reports the picked milestone', () => {
    const onSelect = vi.fn();
    render(<RoadmapGraph entries={consent} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /^1\.9\.0/ }));
    expect(onSelect).toHaveBeenCalledWith('1.9.0');
  });

  it('renders nothing without entries', () => {
    const { container } = render(<RoadmapGraph entries={[]} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('ChangelogTimeline with the graph', () => {
  it('stays hidden for plain changelogs', () => {
    render(<ChangelogTimeline entries={consent.filter((x) => !x.status)} />);
    expect(screen.queryByRole('region', { name: 'Roadmap overview' })).toBeNull();
  });

  it('shows above the entries when the data has several statuses', () => {
    const { container } = render(<ChangelogTimeline entries={consent} />);
    const graph = screen.getByRole('region', { name: 'Roadmap overview' });
    const firstSection = container.querySelector('.version-section');
    expect(graph.compareDocumentPosition(firstSection!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('can be turned off', () => {
    render(<ChangelogTimeline entries={consent} roadmapGraph={false} />);
    expect(screen.queryByRole('region', { name: 'Roadmap overview' })).toBeNull();
  });

  it('jumps to the page holding the picked milestone', () => {
    Element.prototype.scrollIntoView = vi.fn();
    const { container } = render(<ChangelogTimeline entries={consent} maxVisible={2} />);
    expect(container.querySelector('[data-group-key="2.x"]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^2\.x/ }));
    const section = container.querySelector('[data-group-key="2.x"]');
    expect(section).toBeTruthy();
    expect(section!.className).toContain('is-highlighted');
  });
});
