import { ProductDTO, OrderDTO, DashboardStats, GenderFilter, OrderStatus, CustomerDTO, ShippingVendorDTO, ShipmentDTO, ShipmentStatus } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw error;
  }
  return response.json();
};

// ============= PRODUCTS API =============

export const fetchProducts = async (gender: GenderFilter): Promise<ProductDTO[]> => {
  const params = gender !== 'All' ? `?gender=${gender}` : '';
  const response = await fetch(`${API_BASE_URL}/api/products${params}`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse<any[]>(response);
  return data.map(p => ({
    id: p.id,
    name: p.name,
    gender: p.gender,
    fit: p.fit,
    size: p.size,
    wash: p.wash || '',
    price: Number(p.price),
    stockLevel: p.stockLevel,
  }));
};

// GET /api/dashboard/stats - computed from products & orders
export const fetchDashboardStats = async (gender: GenderFilter): Promise<DashboardStats> => {
  const [products, orders] = await Promise.all([
    fetchProducts(gender),
    fetchOrders(),
  ]);

  const relevantOrders = gender === 'All'
    ? orders
    : orders.filter(order => order.items.some(item => {
        const product = products.find(p => p.id === item.productId);
        return product?.gender === gender;
      }));

  const totalSales = relevantOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeOrders = relevantOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockAlerts = products.filter(p => p.stockLevel < 10).length;
  const totalCustomers = new Set(relevantOrders.map(o => o.customerEmail)).size;

  return { totalSales, activeOrders, lowStockAlerts, totalCustomers };
};

// Sales data - computed from orders
export const fetchSalesData = async (gender: GenderFilter) => {
  const orders = await fetchOrders();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthData: Record<string, { men: number; women: number }> = {};

  monthNames.forEach(m => { monthData[m] = { men: 0, women: 0 }; });

  orders.forEach(order => {
    const date = new Date(order.orderDate);
    const month = monthNames[date.getMonth()];
    if (month) {
      // Simplified: split evenly between men/women for now
      monthData[month].men += order.totalAmount / 2;
      monthData[month].women += order.totalAmount / 2;
    }
  });

  return monthNames.map(month => ({
    month,
    men: Math.round(monthData[month].men),
    women: Math.round(monthData[month].women),
    total: Math.round(monthData[month].men + monthData[month].women),
  }));
};

// Category distribution - computed from products
export const fetchCategoryDistribution = async (gender: GenderFilter) => {
  const products = await fetchProducts(gender);
  const fitCounts: Record<string, number> = {};
  products.forEach(p => {
    fitCounts[p.fit] = (fitCounts[p.fit] || 0) + 1;
  });

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  return Object.entries(fitCounts).map(([name, value], i) => ({
    name,
    value,
    fill: colors[i % colors.length],
  }));
};

// ============= ORDERS API =============

export const fetchOrders = async (): Promise<OrderDTO[]> => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse<any[]>(response);
  return data.map(mapOrder);
};

export const fetchOrderById = async (id: string): Promise<OrderDTO | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<any>(response);
    return mapOrder(data);
  } catch {
    return undefined;
  }
};

export const createOrder = async (order: Omit<OrderDTO, 'id' | 'orderDate'>): Promise<OrderDTO> => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
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
    }),
  });
  return mapOrder(await handleResponse<any>(response));
};

export const updateOrder = async (id: string, updates: Partial<OrderDTO>): Promise<OrderDTO | undefined> => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return mapOrder(await handleResponse<any>(response));
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<OrderDTO | undefined> => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return mapOrder(await handleResponse<any>(response));
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.ok;
};

// ============= CUSTOMERS API =============

export const fetchCustomers = async (): Promise<CustomerDTO[]> => {
  const response = await fetch(`${API_BASE_URL}/api/customers`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse<any[]>(response);
  return data.map(mapCustomer);
};

export const fetchCustomerById = async (id: string): Promise<CustomerDTO | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      headers: getAuthHeaders(),
    });
    return mapCustomer(await handleResponse<any>(response));
  } catch {
    return undefined;
  }
};

export const createCustomer = async (customer: Omit<CustomerDTO, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>): Promise<CustomerDTO> => {
  const response = await fetch(`${API_BASE_URL}/api/customers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(customer),
  });
  return mapCustomer(await handleResponse<any>(response));
};

export const updateCustomer = async (id: string, updates: Partial<CustomerDTO>): Promise<CustomerDTO | undefined> => {
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return mapCustomer(await handleResponse<any>(response));
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.ok;
};

// ============= SHIPPING VENDORS API =============

export const fetchShippingVendors = async (): Promise<ShippingVendorDTO[]> => {
  const response = await fetch(`${API_BASE_URL}/api/vendors`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse<any[]>(response);
  return data.map(mapVendor);
};

export const fetchShippingVendorById = async (id: string): Promise<ShippingVendorDTO | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
      headers: getAuthHeaders(),
    });
    return mapVendor(await handleResponse<any>(response));
  } catch {
    return undefined;
  }
};

export const createShippingVendor = async (vendor: Omit<ShippingVendorDTO, 'id' | 'createdAt'>): Promise<ShippingVendorDTO> => {
  const response = await fetch(`${API_BASE_URL}/api/vendors`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(vendor),
  });
  return mapVendor(await handleResponse<any>(response));
};

export const updateShippingVendor = async (id: string, updates: Partial<ShippingVendorDTO>): Promise<ShippingVendorDTO | undefined> => {
  const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return mapVendor(await handleResponse<any>(response));
};

export const deleteShippingVendor = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.ok;
};

// ============= SHIPMENTS API =============

export const fetchShipments = async (): Promise<ShipmentDTO[]> => {
  const response = await fetch(`${API_BASE_URL}/api/shipments`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse<any[]>(response);
  return data.map(mapShipment);
};

export const fetchShipmentById = async (id: string): Promise<ShipmentDTO | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shipments/${id}`, {
      headers: getAuthHeaders(),
    });
    return mapShipment(await handleResponse<any>(response));
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
    return mapShipment(await handleResponse<any>(response));
  } catch {
    return undefined;
  }
};

export const createShipment = async (shipment: Omit<ShipmentDTO, 'id' | 'createdAt'>): Promise<ShipmentDTO> => {
  const response = await fetch(`${API_BASE_URL}/api/shipments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(shipment),
  });
  return mapShipment(await handleResponse<any>(response));
};

export const updateShipment = async (id: string, updates: Partial<ShipmentDTO>): Promise<ShipmentDTO | undefined> => {
  const response = await fetch(`${API_BASE_URL}/api/shipments/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return mapShipment(await handleResponse<any>(response));
};

export const updateShipmentStatus = async (id: string, status: ShipmentStatus): Promise<ShipmentDTO | undefined> => {
  const response = await fetch(`${API_BASE_URL}/api/shipments/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return mapShipment(await handleResponse<any>(response));
};

export const deleteShipment = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/shipments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.ok;
};

// ============= MAPPERS =============

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
