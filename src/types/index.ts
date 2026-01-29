// ProductDTO following Spring Boot pattern
export interface ProductDTO {
  id: string;
  name: string;
  gender: 'Men' | 'Women';
  fit: 'Slim' | 'Skinny' | 'Relaxed';
  size: string;
  wash: string;
  price: number;
  stockLevel: number;
}

// OrderDTO following Spring Boot pattern
export interface OrderDTO {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItemDTO[];
  status: OrderStatus;
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  totalAmount: number;
  shippingAddress: string;
  notes?: string; // Markdown-formatted notes
}

export interface OrderItemDTO {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

export type GenderFilter = 'Men' | 'Women' | 'All';

// Dashboard statistics
export interface DashboardStats {
  totalSales: number;
  activeOrders: number;
  lowStockAlerts: number;
  totalCustomers: number;
}

// Sales data for charts
export interface SalesData {
  month: string;
  men: number;
  women: number;
  total: number;
}

// Category distribution for pie chart
export interface CategoryData {
  name: string;
  value: number;
  fill: string;
}

// CustomerDTO
export interface CustomerDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'vip';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  notes?: string;
}
