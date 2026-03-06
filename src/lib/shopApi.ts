/**
 * @deprecated Use imports from '@/services' instead.
 * This file re-exports for backward compatibility.
 */
export {
  fetchShopProducts,
  fetchShopProductById,
  fetchShopCategories,
  searchCatalog,
  checkStockAvailability,
  createGuestOrder,
} from '@/services/shop.service';

export type {
  StockCheckItem,
  StockCheckResult,
  GuestOrderPayload,
  GuestOrderResponse,
  CatalogSearchParams,
  PaginatedCatalogResponse,
  ShopCategoryResponse,
} from '@/services/shop.service';
