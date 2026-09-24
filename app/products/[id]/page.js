'use client';

import { use } from 'react';
import Link from 'next/link';
import { useProductDetail } from '@/features/products/hooks/useProductDetail';
import Spinner from '@/shared/components/Spinner';
import ErrorState from '@/shared/components/ErrorState';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const { product, loading, error, notFound } = useProductDetail(id);

  if (loading) return <Spinner />;

  if (notFound) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Product not found</h2>
        <p className="text-sm text-gray-500">
          The product you're looking for doesn't exist.
        </p>
        <Link
          href="/products"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
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

  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="space-y-6">
      <Link
        href="/products"
        className="inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
      
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
            <img
              src={images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${product.title} ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

       
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 capitalize mb-1">
              {product.category}
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-xl font-semibold text-gray-900">
              ${product.price}
            </span>
            <span className="text-gray-600">⭐ {product.rating}</span>
            <span className="text-gray-600">Stock: {product.stock}</span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-2 flex gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

     
      {product.reviews?.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Reviews ({product.reviews.length})
          </h2>
          <div className="space-y-3">
            {product.reviews.map((r, i) => (
              <div
                key={i}
                className="p-4 bg-white border border-gray-200 rounded-md"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">
                    {r.reviewerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    ⭐ {r.rating}
                  </p>
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}