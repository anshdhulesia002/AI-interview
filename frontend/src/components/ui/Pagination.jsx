import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 5,
  onItemsPerPageChange,
  className = '',
}) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to render
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-subtle ${className}`}>
      
      {/* Item Counter & Items Per Page Selector */}
      <div className="flex items-center gap-3 text-xs text-content-secondary">
        <span>
          Showing <strong className="text-content-primary">{startItem}-{endItem}</strong> of{' '}
          <strong className="text-content-primary">{totalItems}</strong> items
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-content-muted">Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 text-xs bg-surface-base border border-border-default rounded-lg text-content-primary focus:outline-none focus:ring-1 focus:ring-sky-500 font-semibold"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1">
        
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-hover border border-border-default disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Buttons */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all ${
              currentPage === page
                ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-500/30'
                : 'text-content-secondary hover:text-content-primary bg-surface-base border border-border-default hover:bg-surface-hover'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-hover border border-border-default disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};

export default Pagination;
