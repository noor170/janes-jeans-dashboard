/**
 * Shop Service Layer
 * Handles public-facing shop operations: products, stock check, guest orders.
 * 
 * Strategy: When VITE_API_URL is set, uses Spring Boot backend (/api/shop/catalog).
 * Falls back to Supabase for the Lovable preview environment.
 */

import { ShopProduct } from '@/data/shopProducts';
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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

export interface CatalogSearchParams {
  category?: string;
  subcategory?: string;
  search?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedCatalogResponse {
  content: ShopProduct[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// ============= Backend detection =============

const isBackendAvailable = (): boolean => !!API_BASE_URL;

// ============= Mappers =============

const mapSupabaseProduct = (p: any): ShopProduct => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: Number(p.price),
  category: p.category || 'jeans',
  subcategory: p.subcategory || '',
  sizes: p.sizes || [],
  colors: p.colors || [],
  images: p.images || ['/placeholder.svg'],
  inStock: p.in_stock ?? p.inStock ?? true,
  rating: Number(p.rating) || 4.5,
  reviews: p.reviews || 0,
  metadata: p.metadata || {},
});

const mapBackendProduct = (p: any): ShopProduct => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: Number(p.price),
  category: p.category || 'jeans',
  subcategory: p.subcategory || '',
  sizes: p.sizes || [],
  colors: p.colors || [],
  images: p.images || ['/placeholder.svg'],
  inStock: p.inStock ?? true,
  rating: Number(p.rating) || 4.5,
  reviews: p.reviews || 0,
  metadata: p.metadata || {},
});

// ============= Spring Boot API functions =============

const fetchFromBackend = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`Backend error: ${response.status}`);
  return response.json();
};

const postToBackend = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Backend error: ${response.status}`);
  return response.json();
};

// ============= Catalog (paginated) =============

export const searchCatalog = async (params: CatalogSearchParams = {}): Promise<PaginatedCatalogResponse> => {
  if (isBackendAvailable()) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.subcategory && params.subcategory !== 'all') query.set('subcategory', params.subcategory);
    if (params.search) query.set('search', params.search);
    if (params.inStock !== undefined) query.set('inStock', String(params.inStock));
    if (params.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    query.set('page', String(params.page ?? 0));
    query.set('size', String(params.size ?? 12));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortDir) query.set('sortDir', params.sortDir);

    const data = await fetchFromBackend<any>(`/api/shop/catalog?${query.toString()}`);
    return {
      content: (data.content || []).map(mapBackendProduct),
      page: data.page,
      size: data.size,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      last: data.last,
      first: data.first,
    };
  }

  // Supabase fallback — client-side pagination
  let query = supabase.from('shop_products').select('*', { count: 'exact' });
  if (params.category && params.category !== 'all') query = query.eq('category', params.category);
  if (params.subcategory && params.subcategory !== 'all') query = query.eq('subcategory', params.subcategory);
  if (params.search) query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  if (params.inStock !== undefined) query = query.eq('in_stock', params.inStock);
  if (params.minPrice !== undefined) query = query.gte('price', params.minPrice);
  if (params.maxPrice !== undefined) query = query.lte('price', params.maxPrice);

  const sortField = params.sortBy === 'createdAt' ? 'created_at' : (params.sortBy === 'inStock' ? 'in_stock' : (params.sortBy || 'created_at'));
  query = query.order(sortField, { ascending: params.sortDir === 'asc' });

  const pageNum = params.page ?? 0;
  const pageSize = params.size ?? 12;
  query = query.range(pageNum * pageSize, (pageNum + 1) * pageSize - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  const products = (data || []).map(mapSupabaseProduct);
  const total = count ?? products.length;

  return {
    content: products,
    page: pageNum,
    size: pageSize,
    totalElements: total,
    totalPages: Math.ceil(total / pageSize),
    last: (pageNum + 1) * pageSize >= total,
    first: pageNum === 0,
  };
};

// ============= Simple fetch (backward compatible) =============

export const fetchShopProducts = async (category?: string): Promise<ShopProduct[]> => {
  if (isBackendAvailable()) {
    const query = category && category !== 'all' ? `?category=${category}&size=1000` : '?size=1000';
    const data = await fetchFromBackend<any>(`/api/shop/catalog${query}`);
    return (data.content || []).map(mapBackendProduct);
  }

  // Supabase fallback
  let query = supabase.from('shop_products').select('*');
  if (category && category !== 'all') query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapSupabaseProduct);
};

export const fetchShopProductById = async (id: string): Promise<ShopProduct | null> => {
  if (isBackendAvailable()) {
    try {
      const data = await fetchFromBackend<any>(`/api/shop/catalog/${id}`);
      return mapBackendProduct(data);
    } catch { return null; }
  }

  const { data, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return mapSupabaseProduct(data);
};

// ============= Categories =============

export interface ShopCategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
  subcategories: { id: string; name: string; slug: string; sortOrder: number }[];
}

export const fetchShopCategories = async (): Promise<ShopCategoryResponse[]> => {
  if (isBackendAvailable()) {
    return fetchFromBackend<ShopCategoryResponse[]>('/api/shop/categories');
  }

  // Supabase fallback
  const { data: cats } = await supabase.from('shop_categories').select('*').order('sort_order');
  const { data: subs } = await supabase.from('shop_subcategories').select('*').order('sort_order');
  return (cats || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon || 'Package',
    sortOrder: c.sort_order || 0,
    subcategories: (subs || [])
      .filter((s: any) => s.category_id === c.id)
      .map((s: any) => ({ id: s.id, name: s.name, slug: s.slug, sortOrder: s.sort_order || 0 })),
  }));
};

// ============= Stock & Orders =============

export const checkStockAvailability = async (items: StockCheckItem[]): Promise<StockCheckResult> => {
  if (isBackendAvailable()) {
    return postToBackend<StockCheckResult>('/api/shop/check-stock', items);
  }
  return { available: true, issues: [] };
};

export const createGuestOrder = async (payload: GuestOrderPayload): Promise<GuestOrderResponse> => {
  if (isBackendAvailable()) {
    return postToBackend<GuestOrderResponse>('/api/shop/orders/confirm', payload);
  }

  // Supabase fallback
  const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: payload.shipmentDetails.name,
      customer_email: payload.shipmentDetails.email,
      customer_phone: payload.shipmentDetails.phone,
      shipping_address: payload.shipmentDetails.address,
      shipping_city: payload.shipmentDetails.city,
      shipping_postal_code: payload.shipmentDetails.postalCode,
      payment_type: payload.payment.type,
      payment_status: payload.payment.status,
      status: 'Pending',
      total_amount: payload.totalAmount,
      notes: `Payment: ${payload.payment.type}`,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('Order insert error:', orderError);
    throw new Error(orderError?.message || 'Failed to create order');
  }

  const orderItems = payload.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) console.error('Order items insert error:', itemsError);

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    totalAmount: Number(order.total_amount),
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    createdAt: order.created_at,
  };
};
