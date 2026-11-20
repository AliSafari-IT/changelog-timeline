import React, { useId, useMemo, useRef } from "react";
import type { ChangelogTimelineProps } from "../types";
import { STATUS_LABELS } from "../types";
import { CATEGORIES, CATEGORY_CONFIG } from "../model/categories";
import { useTimelineState } from "../hooks/useTimelineState";
import { ALL_LAYOUTS, LAYOUTS } from "../layouts/registry";
import Pagination from "./Pagination";
import "../styles/vtimeline.css";

const ChangelogTimeline: React.FC<ChangelogTimelineProps> = ({
  entries,
  className = "",
  headerClassName = "",
  maxVisible = 8,
  showPagination = true,
  searchable = false,
  layout = "left",
  layoutSwitcher = false,
  onLayoutChange,
  title,
  subtitle,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  const state = useTimelineState(entries, {
    pageSize: maxVisible,
    paginate: showPagination,
    initialLayout: layout,
    onLayoutChange,
  });

  const definition = LAYOUTS[state.layout] ?? LAYOUTS.left;
  const isClassic = definition.kind === "classic";
  const paginated = showPagination && isClassic;

  const layoutOptions = useMemo(() => {
    if (!layoutSwitcher) return [];
    const options = Array.isArray(layoutSwitcher)
      ? layoutSwitcher.filter((option) => ALL_LAYOUTS.includes(option))
      : ALL_LAYOUTS;
    return options.length > 1 ? options : [];
  }, [layoutSwitcher]);

  const handlePageChange = (newPage: number) => {
    state.setPage(newPage);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { totalCount, page, pageSize, category } = state;
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalCount);
  const LayoutComponent = definition.Component;

  return (
    <div
      ref={rootRef}
      className={`changelog-timeline changelog-timeline--${state.layout} ${className}`}
    >
      <div className={`timeline-header ${headerClassName}`}>
        <h1 className="timeline-title">{title || "📝 Changelog"}</h1>
        <p className="timeline-subtitle">{subtitle || "Track all updates and changes"}</p>
      </div>

      {searchable && (
        <div className="timeline-search">
          <label htmlFor={searchId}>Search changelog</label>
          <div className="timeline-search__control">
            <span aria-hidden="true">⌕</span>
            <input
              id={searchId}
              type="search"
              value={state.query}
              placeholder="Search titles, descriptions, versions, or tags"
              onChange={(event) => state.setQuery(event.target.value)}
            />
          </div>
        </div>
      )}

      {layoutOptions.length > 0 && (
        <div className="layout-switcher" role="group" aria-label="Timeline layout">
          <span className="layout-switcher__label" aria-hidden="true">
            Layout
          </span>
          {layoutOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`layout-switcher__option ${
                state.layout === option ? "active" : ""
              }`}
              aria-pressed={state.layout === option}
              onClick={() => state.setLayout(option)}
            >
              {LAYOUTS[option].label}
            </button>
          ))}
        </div>
      )}

      {state.statuses.length > 1 && (
        <div className="filter-chips filter-chips--status" role="group" aria-label="Status">
          <button
            type="button"
            className={`filter-chip ${state.status === "all" ? "active" : ""}`}
            aria-pressed={state.status === "all"}
            onClick={() => state.setStatus("all")}
          >
            All statuses
          </button>
          {state.statuses.map((status) => (
            <button
              key={status}
              type="button"
              data-status={status}
              className={`filter-chip ${state.status === status ? "active" : ""}`}
              aria-pressed={state.status === status}
              onClick={() => state.setStatus(status)}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      )}

      <div className="filter-chips">
        <button
          className={`filter-chip ${category === "all" ? "active" : ""}`}
          onClick={() => state.setCategory("all")}
        >
          All
        </button>
        {CATEGORIES.map((key) => (
          <button
            key={key}
            className={`filter-chip ${category === key ? "active" : ""}`}
            onClick={() => state.setCategory(key)}
          >
            {CATEGORY_CONFIG[key].icon} {CATEGORY_CONFIG[key].label}
          </button>
        ))}
      </div>

      {paginated && totalCount > 0 && (
        <div className="results-info">
          Showing {startEntry}-{endEntry} of {totalCount}{" "}
          {category === "all" ? "entries" : category + " entries"}
        </div>
      )}

      {totalCount === 0 && (
        <div className="empty-state" role="status">
          <strong>No changelog entries found.</strong>
          {state.query && <span>Try a different search term.</span>}
        </div>
      )}

      {totalCount > 0 && (
        <LayoutComponent
          layout={state.layout}
          entries={paginated ? state.paged : state.filtered}
          query={searchable ? state.query : ""}
        />
      )}

      {paginated && totalCount > pageSize && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          categoryFilter={category}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ChangelogTimeline;
