'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/features/products/hooks/useProducts';
import ProductGrid from '@/features/products/components/ProductGrid';
import Pagination from '@/features/products/components/Pagination';
import SearchBar from '@/features/products/components/SearchBar';
import FilterSort from '@/features/products/components/FilterSort';
import Spinner from '@/shared/components/Spinner';
import EmptyState from '@/shared/components/EmptyState';
import ErrorState from '@/shared/components/ErrorState';
import Modal from '@/shared/components/Modal';
import { deleteProduct as apiDeleteProduct } from '@/features/products/service/product.api';
import { deleteLocalProduct } from '@/features/products/state/productStore';

export default function ProductsPage() {
  const { products, total, loading, error, page, limit, totalPages, refresh } = useProducts();

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);

    try {
     
      await apiDeleteProduct(pendingDelete.id);
      
      deleteLocalProduct(pendingDelete.id);
      setPendingDelete(null);
      refresh();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <Spinner />;

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={refresh}
      />
    );
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Products</h1>
        <Link
          href="/products/add"
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SearchBar />
        <FilterSort />
      </div>

      {!products.length ? (
        <EmptyState message="No products found" />
      ) : (
        <>
          <p className="text-xs text-gray-500">
            Showing {start}-{end} of {total}
          </p>

          <ProductGrid
            products={products}
            onDelete={(p) => setPendingDelete(p)}
          />

          <Pagination page={page} totalPages={totalPages} limit={limit} />
        </>
      )}

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${pendingDelete?.title}"?`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}