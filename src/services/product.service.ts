/**
 * Product Service Layer
 * Handles product CRUD and inventory operations.
 */

import { ProductDTO, GenderFilter } from '@/types';
import { apiGet } from './api.client';

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
  }));
};
