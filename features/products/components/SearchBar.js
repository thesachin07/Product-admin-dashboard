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

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search products..."
      className="w-full sm:max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
    />
  );
}