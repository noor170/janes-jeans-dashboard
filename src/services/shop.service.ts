/**
 * Shop Service Layer
 * Handles public-facing shop operations: products, stock check, guest orders.
 */

import { ShopProduct } from '@/data/shopProducts';
// publicPost/API_BASE_URL no longer needed – orders go straight to the database
import { supabase } from '@/integrations/supabase/client';

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
  let query = supabase.from('shop_products').select('*');
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    sizes: p.sizes || [],
    colors: p.colors || [],
    images: p.images || ['/placeholder.svg'],
    inStock: p.in_stock ?? true,
    rating: Number(p.rating) || 4.5,
    reviews: p.reviews || 0,
  }));
};

export const fetchShopProductById = async (id: string): Promise<ShopProduct | null> => {
  const { data, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    sizes: data.sizes || [],
    colors: data.colors || [],
    images: data.images || ['/placeholder.svg'],
    inStock: data.in_stock ?? true,
    rating: Number(data.rating) || 4.5,
    reviews: data.reviews || 0,
  };
};

export const checkStockAvailability = async (items: StockCheckItem[]): Promise<StockCheckResult> => {
  // Simple stock check – always available since we don't track stock in Supabase yet
  return { available: true, issues: [] };
};

export const createGuestOrder = async (payload: GuestOrderPayload): Promise<GuestOrderResponse> => {
  const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

  // Insert order
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

  // Insert order items
  const orderItems = payload.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items insert error:', itemsError);
  }

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
