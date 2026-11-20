import React from 'react';
import { STATUS_LABELS } from '../types';
import { parseEntryDate, type NormalizedEntry } from '../model/normalize';
import { CATEGORY_CONFIG } from '../model/categories';
import { highlightMatches } from './highlight';

// Date for shipped work; quarter and votes for roadmap items.
const metaOf = (entry: NormalizedEntry) => {
  const items: string[] = [];
  const date = parseEntryDate(entry.date);
  if (date) {
    items.push(
      date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    );
  }
  if (entry.quarter) items.push(entry.quarter);
  if (typeof entry.votes === 'number') {
    items.push(`${entry.votes} ${entry.votes === 1 ? 'vote' : 'votes'}`);
  }
  return items;
};

export interface EntryCardProps {
  entry: NormalizedEntry;
  /** Search query to highlight; empty for none. */
  query?: string;
}

/** The card every layout renders. */
const EntryCard: React.FC<EntryCardProps> = ({ entry, query = '' }) => {
  const config = CATEGORY_CONFIG[entry.category];
  return (
    <div className="timeline-card">
      <div className="card-header">
        <span className="category-icon">{config.icon}</span>
        <div className="card-content">
          <h3 className="card-title">{highlightMatches(entry.title, query)}</h3>
          <div className="card-meta">
            <span className="category-label" data-category={entry.category}>
              {config.label}
            </span>
            {entry.status !== 'shipped' && (
              <span className="status-badge" data-status={entry.status}>
                {STATUS_LABELS[entry.status]}
              </span>
            )}
            {metaOf(entry).map((item) => (
              <React.Fragment key={item}>
                <span aria-hidden="true">•</span>
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
          <p className="card-description">{highlightMatches(entry.description, query)}</p>
          <div className="card-tags">
            {entry.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryCard;
