'use client';

import { useState } from 'react';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { validateProduct } from '@/shared/utils/validators';

const EMPTY = {
  title: '',
  description: '',
  category: '',
  price: '',
  stock: '',
};

export default function ProductForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save',
  categories = [],
}) {
  const [form, setForm] = useState(initialValues || EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const errs = validateProduct(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
      });
    } catch (err) {
      setApiError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-xl" noValidate>
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {apiError}
        </div>
      )}

      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        disabled={submitting}
        required
      />

      <Input
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        error={errors.description}
        disabled={submitting}
        required
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={submitting}
          className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition
            ${errors.category ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
        >
          <option value="">Select category</option>
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
        {errors.category && (
          <p className="mt-1 text-xs text-red-500">{errors.category}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
          disabled={submitting}
          required
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          error={errors.stock}
          disabled={submitting}
          required
        />
      </div>

      <div className="pt-2">
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}