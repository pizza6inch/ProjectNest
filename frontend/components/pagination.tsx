import { Button } from "./ui/button";

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  const renderPageButtons = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Less than or equal to 5 pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={page === i ? "default" : "outline"}
            size="sm"
            className="w-9"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      // More than 5 pages, show current page and neighbors with ellipsis
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, startPage + 4);

      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
      }

      // First page
      if (startPage > 1) {
        pages.push(
          <Button
            key={1}
            variant={page === 1 ? "default" : "outline"}
            size="sm"
            className="w-9"
            onClick={() => handlePageChange(1)}
          >
            1
          </Button>
        );

        if (startPage > 2) {
          pages.push(
            <span key="ellipsis1" className="mx-1 select-none">
              ...
            </span>
          );
        }
      }

      // Page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <Button
            key={i}
            variant={page === i ? "default" : "outline"}
            size="sm"
            className="w-9"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }

      // Last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <span key="ellipsis2" className="mx-1 select-none">
              ...
            </span>
          );
        }

        pages.push(
          <Button
            key={totalPages}
            variant={page === totalPages ? "default" : "outline"}
            size="sm"
            className="w-9"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Button>
        );
      }
    }

    return pages;
  };

  return (
    total > 0 && (
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">{renderPageButtons()}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    )
  );
}
