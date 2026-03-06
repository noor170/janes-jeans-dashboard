/**
 * Coupon Service Layer
 */

import { CouponDTO } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './util';

export const fetchCoupons = async (): Promise<CouponDTO[]> => {
  return apiGet<CouponDTO[]>('/api/coupons');
};

export const fetchCouponById = async (id: string): Promise<CouponDTO> => {
  return apiGet<CouponDTO>(`/api/coupons/${id}`);
};

export const createCoupon = async (coupon: Partial<CouponDTO>): Promise<CouponDTO> => {
  return apiPost<CouponDTO>('/api/coupons', coupon);
};

export const updateCoupon = async (id: string, coupon: Partial<CouponDTO>): Promise<CouponDTO> => {
  return apiPut<CouponDTO>(`/api/coupons/${id}`, coupon);
};

export const deleteCoupon = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/coupons/${id}`);
};

export const validateCoupon = async (code: string, orderTotal: number): Promise<{
  valid: boolean;
  discount: number;
  couponCode: string;
  discountType: string;
  discountValue: number;
}> => {
  return apiPost('/api/coupons/validate', { code, orderTotal });
};
