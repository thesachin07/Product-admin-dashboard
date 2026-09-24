'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/features/products/components/ProductForm';
import { useCategories } from '@/features/products/hooks/useCategories';
import { addProduct } from '@/features/products/service/product.api';
import { addLocalProduct } from '@/features/products/state/productStore';

export default function AddProductPage() {
  const router = useRouter();
  const categories = useCategories();

  async function handleSubmit(values) {
    
    const created = await addProduct(values);

    // Persist locally because api doesn't actually save
    addLocalProduct(created);

    router.replace('/products');
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Add Product</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Add Product"
        categories={categories}
      />
    </div>
  );
}