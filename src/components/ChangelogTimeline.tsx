import React, { useState, useMemo } from "react";
import type {
  ChangelogEntry,
  ChangelogTimelineProps,
  PaginationConfig,
} from "../types";
import "../styles/vtimeline.css";

// Category colors and icons
const categoryConfig = {
  feature: {
    color: "var(--category-feature-icon)",
    bgColor: "var(--category-feature-bg)",
    textColor: "var(--category-feature-text)",
    icon: "✨",
    label: "Feature",
  },
  fix: {
    color: "var(--category-fix-icon)",
    bgColor: "var(--category-fix-bg)",
    textColor: "var(--category-fix-text)",
    icon: "🐛",
    label: "Bug Fix",
  },
  improvement: {
    color: "var(--category-improvement-icon)",
    bgColor: "var(--category-improvement-bg)",
    textColor: "var(--category-improvement-text)",
    icon: "⚡",
    label: "Improvement",
  },
  breaking: {
    color: "var(--category-breaking-icon)",
    bgColor: "var(--category-breaking-bg)",
    textColor: "var(--category-breaking-text)",
    icon: "⚠️",
    label: "Breaking Change",
  },
  security: {
    color: "var(--category-security-icon)",
    bgColor: "var(--category-security-bg)",
    textColor: "var(--category-security-text)",
    icon: "🔒",
    label: "Security",
  },
  docs: {
    color: "var(--category-docs-icon)",
    bgColor: "var(--category-docs-bg)",
    textColor: "var(--category-docs-text)",
    icon: "📚",
    label: "Documentation",
  },
};

// Pagination Component
const Pagination: React.FC<PaginationConfig> = ({
  page,
  pageSize,
  totalCount,
  categoryFilter: mode,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        end = Math.min(maxVisible - 1, totalPages - 1);
      }

      if (page >= totalPages - 2) {
        start = Math.max(2, totalPages - (maxVisible - 2));
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-meta">
        Showing: <strong>{mode}</strong>
      </div>
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((pageNum, idx) =>
          typeof pageNum === "number" ? (
            <button
              key={`page-${pageNum}`}
              className={`pagination-number ${
                page === pageNum ? "active" : ""
              }`}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={page === pageNum ? "page" : undefined}
            >
              {pageNum}
            </button>
          ) : (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              {pageNum}
            </span>
          )
        )}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightMatches = (value: string, query: string) => {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return value;

  const matcher = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return value.split(matcher).map((part, index) =>
    index % 2 === 1 ? <mark key={`${part}-${index}`}>{part}</mark> : part
  );
};

// Timeline Component
const ChangelogTimeline: React.FC<ChangelogTimelineProps> = ({
  entries,
  className = "",
  headerClassName = "",
  maxVisible = 8,
  showPagination = true,
  searchable = false,
  layout = "left",
  title,
  subtitle,
}) => {
  const [filter, setFilter] = useState<
    "all" | "feature" | "fix" | "improvement" | "security" | "breaking" | "docs"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesCategory = filter === "all" || entry.category === filter;
      if (!matchesCategory || !normalizedQuery) return matchesCategory;

      const searchableText = [
        entry.title,
        entry.description,
        entry.version,
        ...entry.tags,
      ].join(" ").toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [entries, filter, searchQuery]);

  const paginatedEntries = useMemo(() => {
    if (!showPagination) return filteredEntries;
    const start = (currentPage - 1) * maxVisible;
    const end = start + maxVisible;
    return filteredEntries.slice(start, end);
  }, [filteredEntries, currentPage, maxVisible, showPagination]);

  // Group by version
  const groupedByVersion = useMemo(() => {
    return paginatedEntries.reduce((acc, entry) => {
      if (!acc[entry.version]) {
        acc[entry.version] = [];
      }
      acc[entry.version].push(entry);
      return acc;
    }, {} as Record<string, ChangelogEntry[]>);
  }, [paginatedEntries]);

  const versions = useMemo(() => {
    return Object.keys(groupedByVersion).sort((a, b) => {
      const parseVersion = (v: string) => v.split(".").map(Number);
      const [aMajor, aMinor, aPatch] = parseVersion(a);
      const [bMajor, bMinor, bPatch] = parseVersion(b);
      return bMajor - aMajor || bMinor - aMinor || bPatch - aPatch;
    });
  }, [groupedByVersion]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const totalCount = filteredEntries.length;
  const startEntry = (currentPage - 1) * maxVisible + 1;
  const endEntry = Math.min(currentPage * maxVisible, totalCount);

  return (
    <div className={`changelog-timeline changelog-timeline--${layout} ${className}`}>
      <div className={`timeline-header ${headerClassName}`}>
        <h1 className="timeline-title">{title || "📝 Changelog"}</h1>
        <p className="timeline-subtitle">{subtitle || "Track all updates and changes"}</p>
      </div>

      {searchable && (
        <div className="timeline-search">
          <label htmlFor="changelog-search">Search changelog</label>
          <div className="timeline-search__control">
            <span aria-hidden="true">⌕</span>
            <input
              id="changelog-search"
              type="search"
              value={searchQuery}
              placeholder="Search titles, descriptions, versions, or tags"
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}

      <div className="filter-chips">
        <button
          className={`filter-chip ${filter === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            className={`filter-chip ${filter === key ? "active" : ""}`}
            onClick={() => handleFilterChange(key as typeof filter)}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      {showPagination && totalCount > 0 && (
        <div className="results-info">
          Showing {startEntry}-{endEntry} of {totalCount}{" "}
          {filter === "all" ? "entries" : filter + " entries"}
        </div>
      )}

      {versions.map((version) => (
        <div key={version} className="version-section">
          <div className="version-header">
            <span className="version-badge">v{version}</span>
            <div className="version-divider" />
          </div>

          <div className="timeline-container">
            <div className="timeline-line" />
            {groupedByVersion[version].map((entry, index) => {
              const config = categoryConfig[entry.category];
              const isLeft = index % 2 === 0;
              const itemClass = layout === "center" 
                ? isLeft ? "timeline-item--left" : "timeline-item--right"
                : "";
              return (
                <div key={entry.id} className={`timeline-item ${itemClass}`}>
                  <div
                    className="timeline-dot"
                    style={{ color: config.color }}
                  />
                  <div className="timeline-card">
                    <div className="card-header">
                      <span className="category-icon">{config.icon}</span>
                      <div className="card-content">
                        <h3 className="card-title">
                          {highlightMatches(entry.title, searchable ? searchQuery : "")}
                        </h3>
                        <div className="card-meta">
                          <span
                            className="category-label"
                            style={{
                              background: config.bgColor,
                              color: config.textColor,
                            }}
                          >
                            {config.label}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="card-description">
                          {highlightMatches(entry.description, searchable ? searchQuery : "")}
                        </p>
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
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {showPagination && totalCount > maxVisible && (
        <Pagination
          page={currentPage}
          pageSize={maxVisible}
          totalCount={totalCount}
          categoryFilter={filter}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ChangelogTimeline;
