import type { ChangelogCategory } from '../types';

export interface CategoryConfig {
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  label: string;
}

export const CATEGORY_CONFIG: Record<ChangelogCategory, CategoryConfig> = {
  feature: {
    color: 'var(--category-feature-icon)',
    bgColor: 'var(--category-feature-bg)',
    textColor: 'var(--category-feature-text)',
    icon: '✨',
    label: 'Feature',
  },
  fix: {
    color: 'var(--category-fix-icon)',
    bgColor: 'var(--category-fix-bg)',
    textColor: 'var(--category-fix-text)',
    icon: '🐛',
    label: 'Bug Fix',
  },
  improvement: {
    color: 'var(--category-improvement-icon)',
    bgColor: 'var(--category-improvement-bg)',
    textColor: 'var(--category-improvement-text)',
    icon: '⚡',
    label: 'Improvement',
  },
  breaking: {
    color: 'var(--category-breaking-icon)',
    bgColor: 'var(--category-breaking-bg)',
    textColor: 'var(--category-breaking-text)',
    icon: '⚠️',
    label: 'Breaking Change',
  },
  security: {
    color: 'var(--category-security-icon)',
    bgColor: 'var(--category-security-bg)',
    textColor: 'var(--category-security-text)',
    icon: '🔒',
    label: 'Security',
  },
  docs: {
    color: 'var(--category-docs-icon)',
    bgColor: 'var(--category-docs-bg)',
    textColor: 'var(--category-docs-text)',
    icon: '📚',
    label: 'Documentation',
  },
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG) as ChangelogCategory[];
