'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/shared/hooks/useDebounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [value, setValue] = useState(urlQuery);
  const debounced = useDebounce(value, 500);

  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (debounced === urlQuery) return;

    const params = new URLSearchParams(searchParams.toString());

    if (debounced) {
      params.set('q', debounced);
      params.delete('category');
    } else {
      params.delete('q');
    }
    params.set('page', '1');

    router.replace(`/products?${params.toString()}`);
  }, [debounced]);

  function handleClear() {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.set('page', '1');
    router.replace(`/products?${params.toString()}`);
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="w-full px-3 py-2 pr-9 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}