import axiosClient from '@/lib/api/axiosClient';

export async function getProducts({ limit = 10, skip = 0 } = {}) {
  return axiosClient.get('/products', {
    params: { limit, skip },
  });
}

export async function searchProducts(q, { limit = 10, skip = 0 } = {}) {
  return axiosClient.get('/products/search', {
    params: { q, limit, skip },
  });
}

export async function getProductsByCategory(category, { limit = 10, skip = 0 } = {}) {
  return axiosClient.get(`/products/category/${category}`, {
    params: { limit, skip },
  });
}

export async function getCategories() {
  return axiosClient.get('/products/categories');
}

export async function getProductById(id) {
  return axiosClient.get(`/products/${id}`);
}

export async function addProduct(data) {
  return axiosClient.post('/products/add', data);
}

export async function updateProduct(id, data) {
  return axiosClient.put(`/products/${id}`, data);
}

export async function deleteProduct(id) {
  return axiosClient.delete(`/products/${id}`);
}