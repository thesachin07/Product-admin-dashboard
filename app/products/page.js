'use client';

import { useProducts } from '@/features/products/hooks/useProducts';
import ProductGrid from '@/features/products/components/ProductGrid';
import Pagination from '@/features/products/components/Pagination';
import Spinner from '@/shared/components/Spinner';
import EmptyState from '@/shared/components/EmptyState';
import ErrorState from '@/shared/components/ErrorState';

export default function ProductsPage() {
  const { products, total, loading, error, page, limit, totalPages } = useProducts();

  if (loading) return <Spinner />;

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!products.length) {
    return <EmptyState message="No products found" />;
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Products</h1>
        <p className="text-xs text-gray-500">
          Showing {start}-{end} of {total}
        </p>
      </div>

      <ProductGrid products={products} onDelete={() => {}} />

      <Pagination page={page} totalPages={totalPages} limit={limit} />
    </div>
  );
}