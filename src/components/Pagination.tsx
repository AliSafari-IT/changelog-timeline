import React from "react";
import type { PaginationConfig } from "../types";

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

export default Pagination;
