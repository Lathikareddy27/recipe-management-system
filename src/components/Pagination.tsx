import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;

  const getPages = () => {
    const arr: (number | string)[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
      arr.push(1);
      if (start > 2) arr.push('...');
    }
    for (let i = start; i <= end; i++) arr.push(i);
    if (end < pages) {
      if (end < pages - 1) arr.push('...');
      arr.push(pages);
    }
    return arr;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {getPages().map((p, i) =>
        typeof p === 'number' ? (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-colors ${
              p === page
                ? 'bg-orange-500 text-white shadow-md'
                : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="px-2 text-gray-400">
            {p}
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
