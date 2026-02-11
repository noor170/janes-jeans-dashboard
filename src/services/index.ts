/**
 * Services Barrel Export
 * Central export point for all service layers.
 */

// Util layer (JWT, API client)
export { jwtService, API_BASE_URL, getAuthHeaders, handleResponse, apiGet, apiPost, apiPut, apiPatch, apiDelete } from './util';

// Domain services
export { authService } from './auth.service';
export { userService } from './user.service';
export { auditService } from './audit.service';
export { fetchProducts } from './product.service';
export { fetchOrders, fetchOrderById, createOrder, updateOrder, updateOrderStatus, deleteOrder } from './order.service';
export { fetchCustomers, fetchCustomerById, createCustomer, updateCustomer, deleteCustomer } from './customer.service';
export {
  fetchShippingVendors, fetchShippingVendorById, createShippingVendor, updateShippingVendor, deleteShippingVendor,
  fetchShipments, fetchShipmentById, fetchShipmentByOrderId, createShipment, updateShipment, updateShipmentStatus, deleteShipment,
} from './shipping.service';
export { fetchDashboardStats, fetchSalesData, fetchCategoryDistribution } from './dashboard.service';
export {
  fetchShopProducts, fetchShopProductById, checkStockAvailability, createGuestOrder,
} from './shop.service';
export type { StockCheckItem, StockCheckResult, GuestOrderPayload, GuestOrderResponse } from './shop.service';
