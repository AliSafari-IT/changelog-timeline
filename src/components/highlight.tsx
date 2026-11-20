import type { ReactNode } from 'react';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wrap search terms in <mark>. Returns the plain string when there is no query. */
export const highlightMatches = (value: string, query: string): ReactNode => {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return value;

  const matcher = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  return value
    .split(matcher)
    .map((part, index) => (index % 2 === 1 ? <mark key={`${part}-${index}`}>{part}</mark> : part));
};
