// Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-secondary text-secondary-foreground rounded disabled:opacity-50 hover:bg-secondary/80 transition-colors"
      >
        Previous
      </button>
      <span className="text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-secondary text-secondary-foreground rounded disabled:opacity-50 hover:bg-secondary/80 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;