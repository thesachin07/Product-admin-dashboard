'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '@/features/products/components/ProductForm';
import { useProductDetail } from '@/features/products/hooks/useProductDetail';
import { useCategories } from '@/features/products/hooks/useCategories';
import { updateProduct } from '@/features/products/service/product.api';
import { updateLocalProduct } from '@/features/products/state/productStore';
import Spinner from '@/shared/components/Spinner';
import ErrorState from '@/shared/components/ErrorState';

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const categories = useCategories();
  const { product, loading, error, notFound } = useProductDetail(id);

  async function handleSubmit(values) {
  const updated = await updateProduct(id, values);
  updateLocalProduct(id, { ...updated, ...values, id: Number(id) });
  router.replace('/products');
}

  if (loading) return <Spinner />;

  if (notFound) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Product not found</h2>
        <Link href="/products" className="text-sm text-blue-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update product details
        </p>
      </div>

      <ProductForm
        initialValues={{
          title: product.title || '',
          description: product.description || '',
          category: product.category || '',
          price: product.price ?? '',
          stock: product.stock ?? '',
        }}
        onSubmit={handleSubmit}
        submitLabel="Update Product"
        categories={categories}
      />
    </div>
  );
}