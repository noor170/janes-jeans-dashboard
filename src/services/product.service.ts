/**
 * Product Service Layer
 * Handles product CRUD and inventory operations.
 */

import { ProductDTO, GenderFilter } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './util';

export const fetchProducts = async (gender: GenderFilter): Promise<ProductDTO[]> => {
  const params = gender !== 'All' ? `?gender=${gender}` : '';
  const data = await apiGet<any[]>(`/api/products${params}`);
  return data.map(p => ({
    id: p.id,
    name: p.name,
    gender: p.gender,
    fit: p.fit,
    size: p.size,
    wash: p.wash || '',
    price: Number(p.price),
    stockLevel: p.stockLevel,
    discountPercent: Number(p.discountPercent || 0),
    offerDiscountPercent: Number(p.offerDiscountPercent || 0),
    offerName: p.offerName || '',
    offerStart: p.offerStart,
    offerEnd: p.offerEnd,
  }));
};

export const createProduct = async (product: Partial<ProductDTO>): Promise<ProductDTO> => {
  return apiPost<ProductDTO>('/api/products', product);
};

export const updateProduct = async (id: string, product: Partial<ProductDTO>): Promise<ProductDTO> => {
  return apiPut<ProductDTO>(`/api/products/${id}`, product);
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/products/${id}`);
};
