/**
 * Customer Service Layer
 * Handles customer CRUD operations.
 */

import { CustomerDTO } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './api.client';

const mapCustomer = (c: any): CustomerDTO => ({
  id: c.id,
  name: c.name,
  email: c.email,
  phone: c.phone || '',
  address: c.address || '',
  status: c.status as 'active' | 'inactive' | 'vip',
  totalOrders: c.totalOrders || 0,
  totalSpent: Number(c.totalSpent) || 0,
  createdAt: c.createdAt,
  notes: c.notes,
});

export const fetchCustomers = async (): Promise<CustomerDTO[]> => {
  const data = await apiGet<any[]>('/api/customers');
  return data.map(mapCustomer);
};

export const fetchCustomerById = async (id: string): Promise<CustomerDTO | undefined> => {
  try {
    return mapCustomer(await apiGet<any>(`/api/customers/${id}`));
  } catch {
    return undefined;
  }
};

export const createCustomer = async (customer: Omit<CustomerDTO, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>): Promise<CustomerDTO> => {
  const data = await apiPost<any>('/api/customers', customer);
  return mapCustomer(data);
};

export const updateCustomer = async (id: string, updates: Partial<CustomerDTO>): Promise<CustomerDTO | undefined> => {
  const data = await apiPut<any>(`/api/customers/${id}`, updates);
  return mapCustomer(data);
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/customers/${id}`);
};
