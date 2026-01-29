import { ProductDTO, OrderDTO, DashboardStats, GenderFilter, OrderStatus, CustomerDTO, ShippingVendorDTO, ShipmentDTO, ShipmentStatus } from '@/types';
import { mockProducts, mockOrders, mockSalesData, getCategoryDistribution, mockCustomers, mockShippingVendors, mockShipments } from '@/data/mockData';

// Simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for orders (simulating database)
let ordersStore = [...mockOrders];

// GET /api/products?gender={category}
export const fetchProducts = async (gender: GenderFilter): Promise<ProductDTO[]> => {
  await delay(200);
  if (gender === 'All') {
    return mockProducts;
  }
  return mockProducts.filter(p => p.gender === gender);
};

// GET /api/dashboard/stats?gender={category}
export const fetchDashboardStats = async (gender: GenderFilter): Promise<DashboardStats> => {
  await delay(150);
  const products = gender === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.gender === gender);
  
  const relevantOrders = ordersStore.filter(order => {
    if (gender === 'All') return true;
    return order.items.some(item => {
      const product = mockProducts.find(p => p.id === item.productId);
      return product?.gender === gender;
    });
  });

  const totalSales = relevantOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeOrders = relevantOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockAlerts = products.filter(p => p.stockLevel < 10).length;
  const totalCustomers = new Set(relevantOrders.map(o => o.customerEmail)).size;

  return {
    totalSales,
    activeOrders,
    lowStockAlerts,
    totalCustomers,
  };
};

// GET /api/sales?gender={category}
export const fetchSalesData = async (gender: GenderFilter) => {
  await delay(150);
  if (gender === 'All') {
    return mockSalesData;
  }
  return mockSalesData.map(data => ({
    month: data.month,
    men: gender === 'Men' ? data.men : 0,
    women: gender === 'Women' ? data.women : 0,
    total: gender === 'Men' ? data.men : data.women,
  }));
};

// GET /api/categories?gender={category}
export const fetchCategoryDistribution = async (gender: GenderFilter) => {
  await delay(150);
  return getCategoryDistribution(gender);
};

// GET /api/orders
export const fetchOrders = async (): Promise<OrderDTO[]> => {
  await delay(200);
  return [...ordersStore].sort((a, b) => 
    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );
};

// GET /api/orders/:id
export const fetchOrderById = async (id: string): Promise<OrderDTO | undefined> => {
  await delay(150);
  return ordersStore.find(o => o.id === id);
};

// POST /api/orders
export const createOrder = async (order: Omit<OrderDTO, 'id' | 'orderDate'>): Promise<OrderDTO> => {
  await delay(300);
  const newOrder: OrderDTO = {
    ...order,
    id: `ORD${String(ordersStore.length + 1).padStart(3, '0')}`,
    orderDate: new Date().toISOString(),
  };
  ordersStore.push(newOrder);
  return newOrder;
};

// PUT /api/orders/:id
export const updateOrder = async (id: string, updates: Partial<OrderDTO>): Promise<OrderDTO | undefined> => {
  await delay(300);
  const index = ordersStore.findIndex(o => o.id === id);
  if (index === -1) return undefined;
  
  ordersStore[index] = { ...ordersStore[index], ...updates };
  return ordersStore[index];
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<OrderDTO | undefined> => {
  await delay(200);
  const index = ordersStore.findIndex(o => o.id === id);
  if (index === -1) return undefined;
  
  const updates: Partial<OrderDTO> = { status };
  if (status === 'Shipped') {
    updates.shippedDate = new Date().toISOString();
  } else if (status === 'Delivered') {
    updates.deliveredDate = new Date().toISOString();
  }
  
  ordersStore[index] = { ...ordersStore[index], ...updates };
  return ordersStore[index];
};

// DELETE /api/orders/:id
export const deleteOrder = async (id: string): Promise<boolean> => {
  await delay(200);
  const index = ordersStore.findIndex(o => o.id === id);
  if (index === -1) return false;
  
  ordersStore.splice(index, 1);
  return true;
};

// In-memory store for customers
let customersStore = [...mockCustomers];

// GET /api/customers
export const fetchCustomers = async (): Promise<CustomerDTO[]> => {
  await delay(200);
  return [...customersStore].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// GET /api/customers/:id
export const fetchCustomerById = async (id: string): Promise<CustomerDTO | undefined> => {
  await delay(150);
  return customersStore.find(c => c.id === id);
};

// POST /api/customers
export const createCustomer = async (customer: Omit<CustomerDTO, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>): Promise<CustomerDTO> => {
  await delay(300);
  const newCustomer: CustomerDTO = {
    ...customer,
    id: `CUS${String(customersStore.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0,
  };
  customersStore.push(newCustomer);
  return newCustomer;
};

// PUT /api/customers/:id
export const updateCustomer = async (id: string, updates: Partial<CustomerDTO>): Promise<CustomerDTO | undefined> => {
  await delay(300);
  const index = customersStore.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  
  customersStore[index] = { ...customersStore[index], ...updates };
  return customersStore[index];
};

// DELETE /api/customers/:id
export const deleteCustomer = async (id: string): Promise<boolean> => {
  await delay(200);
  const index = customersStore.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  customersStore.splice(index, 1);
  return true;
};

// ============= SHIPPING VENDORS API =============

let vendorsStore = [...mockShippingVendors];

// GET /api/vendors
export const fetchShippingVendors = async (): Promise<ShippingVendorDTO[]> => {
  await delay(200);
  return [...vendorsStore].sort((a, b) => a.name.localeCompare(b.name));
};

// GET /api/vendors/:id
export const fetchShippingVendorById = async (id: string): Promise<ShippingVendorDTO | undefined> => {
  await delay(150);
  return vendorsStore.find(v => v.id === id);
};

// POST /api/vendors
export const createShippingVendor = async (vendor: Omit<ShippingVendorDTO, 'id' | 'createdAt'>): Promise<ShippingVendorDTO> => {
  await delay(300);
  const newVendor: ShippingVendorDTO = {
    ...vendor,
    id: `VND${String(vendorsStore.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  };
  vendorsStore.push(newVendor);
  return newVendor;
};

// PUT /api/vendors/:id
export const updateShippingVendor = async (id: string, updates: Partial<ShippingVendorDTO>): Promise<ShippingVendorDTO | undefined> => {
  await delay(300);
  const index = vendorsStore.findIndex(v => v.id === id);
  if (index === -1) return undefined;
  
  vendorsStore[index] = { ...vendorsStore[index], ...updates };
  return vendorsStore[index];
};

// DELETE /api/vendors/:id
export const deleteShippingVendor = async (id: string): Promise<boolean> => {
  await delay(200);
  const index = vendorsStore.findIndex(v => v.id === id);
  if (index === -1) return false;
  
  vendorsStore.splice(index, 1);
  return true;
};

// ============= SHIPMENTS API =============

let shipmentsStore = [...mockShipments];

// GET /api/shipments
export const fetchShipments = async (): Promise<ShipmentDTO[]> => {
  await delay(200);
  return [...shipmentsStore].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// GET /api/shipments/:id
export const fetchShipmentById = async (id: string): Promise<ShipmentDTO | undefined> => {
  await delay(150);
  return shipmentsStore.find(s => s.id === id);
};

// GET /api/shipments/order/:orderId
export const fetchShipmentByOrderId = async (orderId: string): Promise<ShipmentDTO | undefined> => {
  await delay(150);
  return shipmentsStore.find(s => s.orderId === orderId);
};

// POST /api/shipments
export const createShipment = async (shipment: Omit<ShipmentDTO, 'id' | 'createdAt'>): Promise<ShipmentDTO> => {
  await delay(300);
  const newShipment: ShipmentDTO = {
    ...shipment,
    id: `SHP${String(shipmentsStore.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  };
  shipmentsStore.push(newShipment);
  return newShipment;
};

// PUT /api/shipments/:id
export const updateShipment = async (id: string, updates: Partial<ShipmentDTO>): Promise<ShipmentDTO | undefined> => {
  await delay(300);
  const index = shipmentsStore.findIndex(s => s.id === id);
  if (index === -1) return undefined;
  
  shipmentsStore[index] = { ...shipmentsStore[index], ...updates };
  return shipmentsStore[index];
};

// PUT /api/shipments/:id/status
export const updateShipmentStatus = async (id: string, status: ShipmentStatus): Promise<ShipmentDTO | undefined> => {
  await delay(200);
  const index = shipmentsStore.findIndex(s => s.id === id);
  if (index === -1) return undefined;
  
  const updates: Partial<ShipmentDTO> = { status };
  if (status === 'picked_up' || status === 'in_transit') {
    if (!shipmentsStore[index].shippedAt) {
      updates.shippedAt = new Date().toISOString();
    }
  } else if (status === 'delivered') {
    updates.deliveredAt = new Date().toISOString();
  }
  
  shipmentsStore[index] = { ...shipmentsStore[index], ...updates };
  return shipmentsStore[index];
};

// DELETE /api/shipments/:id
export const deleteShipment = async (id: string): Promise<boolean> => {
  await delay(200);
  const index = shipmentsStore.findIndex(s => s.id === id);
  if (index === -1) return false;
  
  shipmentsStore.splice(index, 1);
  return true;
};
