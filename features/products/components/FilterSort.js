'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCategories } from '../hooks/useCategories';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'title-asc', label: 'Title: A-Z' },
];

export default function FilterSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = useCategories();

  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || 'asc';

  const currentSort = sortBy ? `${sortBy}-${order}` : '';

  function updateURL(updates) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value == null) params.delete(key);
      else params.set(key, value);
    });

    params.set('page', '1');
    router.replace(`/products?${params.toString()}`);
  }

  function handleCategory(e) {
    const val = e.target.value;
  
    if (val) {
      updateURL({ category: val, q: '' });
    } else {
      updateURL({ category: '' });
    }
  }

  function handleSort(e) {
    const val = e.target.value;
    if (!val) {
      updateURL({ sortBy: '', order: '' });
      return;
    }
    const [by, ord] = val.split('-');
    updateURL({ sortBy: by, order: ord });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={category}
        onChange={handleCategory}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
      >
        <option value="">All Categories</option>
        {categories.map((c) => {
          const value = typeof c === 'string' ? c : c.slug;
          const label = typeof c === 'string' ? c : c.name;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      <select
        value={currentSort}
        onChange={handleSort}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}