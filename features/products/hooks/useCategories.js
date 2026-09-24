'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '../service/product.api';

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((res) => {
        if (cancelled) return;
        setCategories(res || []);
      })
      .catch(() => {
     
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}