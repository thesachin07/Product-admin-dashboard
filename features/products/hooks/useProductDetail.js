'use client';

import { useEffect, useState } from 'react';
import { getProductById } from '../service/product.api';

export function useProductDetail(id) {
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: null,
    notFound: false,
  });

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setState({ product: null, loading: true, error: null, notFound: false });

    getProductById(id)
      .then((product) => {
        if (cancelled) return;
        setState({ product, loading: false, error: null, notFound: false });
      })
      .catch((err) => {
        if (cancelled || err.isCanceled) return;

        if (err.status === 404) {
          setState({ product: null, loading: false, error: null, notFound: true });
        } else {
          setState({
            product: null,
            loading: false,
            error: err.message || 'Failed to load product',
            notFound: false,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}