/**
 * Product Returns Service Layer
 */

import { ProductReturnDTO } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './util';

export const fetchReturns = async (): Promise<ProductReturnDTO[]> => {
  return apiGet<ProductReturnDTO[]>('/api/returns');
};

export const fetchReturnById = async (id: string): Promise<ProductReturnDTO> => {
  return apiGet<ProductReturnDTO>(`/api/returns/${id}`);
};

export const createReturn = async (ret: Partial<ProductReturnDTO>): Promise<ProductReturnDTO> => {
  return apiPost<ProductReturnDTO>('/api/returns', ret);
};

export const updateReturn = async (id: string, ret: Partial<ProductReturnDTO>): Promise<ProductReturnDTO> => {
  return apiPut<ProductReturnDTO>(`/api/returns/${id}`, ret);
};

export const approveReturn = async (id: string): Promise<ProductReturnDTO> => {
  return apiPost<ProductReturnDTO>(`/api/returns/${id}/approve`);
};

export const rejectReturn = async (id: string, notes?: string): Promise<ProductReturnDTO> => {
  return apiPost<ProductReturnDTO>(`/api/returns/${id}/reject`, notes ? { notes } : {});
};

export const deleteReturn = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/returns/${id}`);
};
