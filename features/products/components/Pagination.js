'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const PAGE_SIZES = [10, 20, 50];

export default function Pagination({ page, totalPages, limit }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateURL(updates) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value == null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`/products?${params.toString()}`);
  }

  function goToPage(p) {
    if (p < 1 || p > totalPages || p === page) return;
    updateURL({ page: p });
  }

  function changeLimit(newLimit) {
    updateURL({ limit: newLimit, page: 1 });
  }

  
  function getPages() {
    const pages = [];
    const show = 5;

    if (totalPages <= show) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, page - 1);
    let end = Math.min(totalPages - 1, page + 1);

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');

    pages.push(totalPages);
    return pages;
  }

  const pages = getPages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span>Per page:</span>
        <select
          value={limit}
          onChange={(e) => changeLimit(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-xs"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      
      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`e-${idx}`} className="px-2 text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 text-xs border rounded transition ${
                p === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}