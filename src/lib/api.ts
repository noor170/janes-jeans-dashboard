import { ProductDTO, OrderDTO, DashboardStats, GenderFilter, OrderStatus, CustomerDTO } from '@/types';
import { mockProducts, mockOrders, mockSalesData, getCategoryDistribution, mockCustomers } from '@/data/mockData';

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
