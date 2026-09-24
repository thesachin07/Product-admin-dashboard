'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
} from '../service/product.api';
import {parsePage, parseLimit, parseSortBy, parseOrder, parseString } from '@/shared/utils/urlHelpers';
import { mergeWithLocal } from '../state/productStore';

export function useProducts() {
  const searchParams = useSearchParams();

 
  const page = parsePage(searchParams.get('page'));
  const limit = parseLimit(searchParams.get('limit'));
  const q = parseString(searchParams.get('q'));
  const category = parseString(searchParams.get('category'));
  const sortBy = parseSortBy(searchParams.get('sortBy'));
  const order = parseOrder(searchParams.get('order'));

  const [data, setData] = useState({
    products: [],
    total: 0,
    loading: true,
    error: null,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  useEffect(() => {
    const controller = new AbortController();
    const skip = (page - 1) * limit;

    setData((prev) => ({ ...prev, loading: true, error: null }));

    let request;

    if (q) {
      request = searchProducts(q, { limit, skip, signal: controller.signal });
    } else if (category) {
      request = getProductsByCategory(category, {
        limit,
        skip,
        signal: controller.signal,
      });
    } else {
      request = getProducts({ limit, skip, signal: controller.signal });
    }

    request
      .then((res) => {
        if (controller.signal.aborted) return;

        let products = mergeWithLocal(res.products || [] )

        if (sortBy) {
          products = [...products].sort((a, b) => {
            const av = a[sortBy];
            const bv = b[sortBy];
            if (typeof av === 'string') {
              return order === 'desc'
                ? bv.localeCompare(av)
                : av.localeCompare(bv);
            }
            return order === 'desc' ? bv - av : av - bv;
          });
        }

        setData({
          products,
          total: res.total || 0,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (controller.signal.aborted || err.isCanceled) return;
        setData({
          products: [],
          total: 0,
          loading: false,
          error: err.message || 'Failed to load products',
        });
      });

    return () => controller.abort();
  }, [page, limit, q, category, sortBy, order, refreshKey]);

  return {
    ...data,
    page,
    limit,
    q,
    category,
    sortBy,
    order,
    refresh,
    totalPages: Math.ceil(data.total / limit) || 1,
  };
}