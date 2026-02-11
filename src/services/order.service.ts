/**
 * Order Service Layer
 * Handles order CRUD, status updates.
 */

import { OrderDTO, OrderStatus } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './api.client';

const mapOrder = (o: any): OrderDTO => ({
  id: o.id,
  customerName: o.customerName,
  customerEmail: o.customerEmail,
  items: (o.items || []).map((item: any) => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    price: Number(item.price),
    size: item.size,
  })),
  status: o.status as OrderStatus,
  orderDate: o.orderDate,
  shippedDate: o.shippedDate,
  deliveredDate: o.deliveredDate,
  totalAmount: Number(o.totalAmount),
  shippingAddress: o.shippingAddress,
  notes: o.notes,
});

export const fetchOrders = async (): Promise<OrderDTO[]> => {
  const data = await apiGet<any[]>('/api/orders');
  return data.map(mapOrder);
};

export const fetchOrderById = async (id: string): Promise<OrderDTO | undefined> => {
  try {
    const data = await apiGet<any>(`/api/orders/${id}`);
    return mapOrder(data);
  } catch {
    return undefined;
  }
};

export const createOrder = async (order: Omit<OrderDTO, 'id' | 'orderDate'>): Promise<OrderDTO> => {
  const data = await apiPost<any>('/api/orders', {
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    notes: order.notes,
    items: order.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
    })),
  });
  return mapOrder(data);
};

export const updateOrder = async (id: string, updates: Partial<OrderDTO>): Promise<OrderDTO | undefined> => {
  const data = await apiPut<any>(`/api/orders/${id}`, updates);
  return mapOrder(data);
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<OrderDTO | undefined> => {
  const data = await apiPut<any>(`/api/orders/${id}/status`, { status });
  return mapOrder(data);
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/orders/${id}`);
};
