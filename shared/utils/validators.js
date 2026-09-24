export function validateProduct(values) {
  const errors = {};

  if (!values.title || !values.title.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!values.description || !values.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!values.category || !values.category.trim()) {
    errors.category = 'Category is required';
  }

  const price = Number(values.price);
  if (!values.price && values.price !== 0) {
    errors.price = 'Price is required';
  } else if (isNaN(price) || price < 0) {
    errors.price = 'Price must be a positive number';
  }

  const stock = Number(values.stock);
  if (values.stock === '' || values.stock == null) {
    errors.stock = 'Stock is required';
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = 'Stock must be a non-negative integer';
  }

  return errors;
}