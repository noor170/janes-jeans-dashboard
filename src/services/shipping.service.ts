/**
 * Shipping Service Layer
 * Handles shipping vendors and shipment CRUD operations.
 */

import { ShippingVendorDTO, ShipmentDTO, ShipmentStatus } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete, API_BASE_URL, getAuthHeaders } from './api.client';

// ============= MAPPERS =============

const mapVendor = (v: any): ShippingVendorDTO => ({
  id: v.id,
  name: v.name,
  code: v.code,
  contactEmail: v.contactEmail || '',
  contactPhone: v.contactPhone || '',
  website: v.website,
  trackingUrlTemplate: v.trackingUrlTemplate,
  status: v.status as 'active' | 'inactive',
  avgDeliveryDays: v.avgDeliveryDays || 0,
  createdAt: v.createdAt,
});

const mapShipment = (s: any): ShipmentDTO => ({
  id: s.id,
  orderId: s.orderId,
  vendorId: s.vendorId,
  trackingNumber: s.trackingNumber,
  status: s.status as ShipmentStatus,
  shippingAddress: s.shippingAddress,
  shippedAt: s.shippedAt,
  estimatedDelivery: s.estimatedDelivery,
  deliveredAt: s.deliveredAt,
  notes: s.notes,
  createdAt: s.createdAt,
});

// ============= SHIPPING VENDORS =============

export const fetchShippingVendors = async (): Promise<ShippingVendorDTO[]> => {
  const data = await apiGet<any[]>('/api/vendors');
  return data.map(mapVendor);
};

export const fetchShippingVendorById = async (id: string): Promise<ShippingVendorDTO | undefined> => {
  try {
    return mapVendor(await apiGet<any>(`/api/vendors/${id}`));
  } catch {
    return undefined;
  }
};

export const createShippingVendor = async (vendor: Omit<ShippingVendorDTO, 'id' | 'createdAt'>): Promise<ShippingVendorDTO> => {
  const data = await apiPost<any>('/api/vendors', vendor);
  return mapVendor(data);
};

export const updateShippingVendor = async (id: string, updates: Partial<ShippingVendorDTO>): Promise<ShippingVendorDTO | undefined> => {
  const data = await apiPut<any>(`/api/vendors/${id}`, updates);
  return mapVendor(data);
};

export const deleteShippingVendor = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/vendors/${id}`);
};

// ============= SHIPMENTS =============

export const fetchShipments = async (): Promise<ShipmentDTO[]> => {
  const data = await apiGet<any[]>('/api/shipments');
  return data.map(mapShipment);
};

export const fetchShipmentById = async (id: string): Promise<ShipmentDTO | undefined> => {
  try {
    return mapShipment(await apiGet<any>(`/api/shipments/${id}`));
  } catch {
    return undefined;
  }
};

export const fetchShipmentByOrderId = async (orderId: string): Promise<ShipmentDTO | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shipments/order/${orderId}`, {
      headers: getAuthHeaders(),
    });
    if (response.status === 404) return undefined;
    const data = await response.json();
    return mapShipment(data);
  } catch {
    return undefined;
  }
};

export const createShipment = async (shipment: Omit<ShipmentDTO, 'id' | 'createdAt'>): Promise<ShipmentDTO> => {
  const data = await apiPost<any>('/api/shipments', shipment);
  return mapShipment(data);
};

export const updateShipment = async (id: string, updates: Partial<ShipmentDTO>): Promise<ShipmentDTO | undefined> => {
  const data = await apiPut<any>(`/api/shipments/${id}`, updates);
  return mapShipment(data);
};

export const updateShipmentStatus = async (id: string, status: ShipmentStatus): Promise<ShipmentDTO | undefined> => {
  const data = await apiPut<any>(`/api/shipments/${id}/status`, { status });
  return mapShipment(data);
};

export const deleteShipment = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/shipments/${id}`);
};
