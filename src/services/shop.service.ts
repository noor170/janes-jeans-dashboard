/**
 * Shop Service Layer
 * Handles public-facing shop operations: products, stock check, guest orders.
 */

import { ShopProduct } from '@/data/shopProducts';
import { publicGet, publicPost, API_BASE_URL } from './api.client';

// ============= Types =============

export interface StockCheckItem {
  productId: string;
  productName: string;
  quantity: number;
  size: string;
  price: number;
}

export interface StockCheckResult {
  available: boolean;
  issues: {
    productId: string;
    productName: string;
    requestedQuantity?: number;
    availableStock?: number;
    error?: string;
  }[];
}

export interface GuestOrderPayload {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    size: string;
    price: number;
  }[];
  shipmentDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  payment: {
    type: string;
    status: string;
  };
  totalAmount: number;
}

export interface GuestOrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

// ============= Mapper =============

const mapShopProduct = (p: any): ShopProduct => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: Number(p.price),
  category: p.category || 'jeans',
  sizes: p.sizes || [],
  colors: p.colors || [],
  images: p.images || ['/placeholder.svg'],
  inStock: p.inStock ?? true,
  rating: p.rating || 4.5,
  reviews: p.reviews || 100,
});

// ============= API Functions =============

export const fetchShopProducts = async (category?: string): Promise<ShopProduct[]> => {
  const params = category && category !== 'all' ? `?category=${category}` : '';
  const data = await publicGet<any[]>(`/api/shop/products${params}`);
  return data.map(mapShopProduct);
};

export const fetchShopProductById = async (id: string): Promise<ShopProduct | null> => {
  try {
    const data = await publicGet<any>(`/api/shop/products/${id}`);
    return mapShopProduct(data);
  } catch {
    return null;
  }
};

export const checkStockAvailability = async (items: StockCheckItem[]): Promise<StockCheckResult> => {
  return publicPost<StockCheckResult>('/api/shop/check-stock', items);
};

export const createGuestOrder = async (payload: GuestOrderPayload): Promise<GuestOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/shop/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    const error = await response.json();
    throw { stockError: true, message: error.message, stockErrors: error.stockErrors };
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw error;
  }
  return response.json();
};
