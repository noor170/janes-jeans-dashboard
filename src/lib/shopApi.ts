/**
 * @deprecated Use imports from '@/services' instead.
 * This file re-exports for backward compatibility.
 */
export {
  fetchShopProducts,
  fetchShopProductById,
  checkStockAvailability,
  createGuestOrder,
} from '@/services/shop.service';

export type {
  StockCheckItem,
  StockCheckResult,
  GuestOrderPayload,
  GuestOrderResponse,
} from '@/services/shop.service';
