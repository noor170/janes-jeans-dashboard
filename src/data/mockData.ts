import { ProductDTO, OrderDTO, SalesData } from '@/types';

// Mock Products
export const mockProducts: ProductDTO[] = [
  // Men's Jeans
  { id: 'P001', name: 'Classic Indigo Slim', gender: 'Men', fit: 'Slim', size: '32', wash: 'Dark Indigo', price: 89.99, stockLevel: 45 },
  { id: 'P002', name: 'Urban Skinny Fit', gender: 'Men', fit: 'Skinny', size: '30', wash: 'Black', price: 79.99, stockLevel: 8 },
  { id: 'P003', name: 'Comfort Relaxed', gender: 'Men', fit: 'Relaxed', size: '34', wash: 'Stone Wash', price: 74.99, stockLevel: 32 },
  { id: 'P004', name: 'Premium Slim Dark', gender: 'Men', fit: 'Slim', size: '32', wash: 'Raw Denim', price: 129.99, stockLevel: 5 },
  { id: 'P005', name: 'Weekend Relaxed', gender: 'Men', fit: 'Relaxed', size: '36', wash: 'Light Blue', price: 69.99, stockLevel: 28 },
  { id: 'P006', name: 'Street Skinny', gender: 'Men', fit: 'Skinny', size: '28', wash: 'Washed Black', price: 84.99, stockLevel: 3 },
  { id: 'P007', name: 'Executive Slim', gender: 'Men', fit: 'Slim', size: '33', wash: 'Deep Navy', price: 99.99, stockLevel: 18 },
  { id: 'P008', name: 'Vintage Relaxed', gender: 'Men', fit: 'Relaxed', size: '35', wash: 'Vintage Wash', price: 79.99, stockLevel: 22 },
  
  // Women's Jeans
  { id: 'P009', name: 'High Rise Skinny', gender: 'Women', fit: 'Skinny', size: '26', wash: 'Dark Indigo', price: 89.99, stockLevel: 42 },
  { id: 'P010', name: 'Mom Fit Relaxed', gender: 'Women', fit: 'Relaxed', size: '28', wash: 'Light Wash', price: 79.99, stockLevel: 6 },
  { id: 'P011', name: 'Ankle Slim', gender: 'Women', fit: 'Slim', size: '27', wash: 'Medium Blue', price: 84.99, stockLevel: 35 },
  { id: 'P012', name: 'Curve Skinny', gender: 'Women', fit: 'Skinny', size: '29', wash: 'Black', price: 94.99, stockLevel: 9 },
  { id: 'P013', name: 'Wide Leg Relaxed', gender: 'Women', fit: 'Relaxed', size: '26', wash: 'Stone Wash', price: 99.99, stockLevel: 27 },
  { id: 'P014', name: 'Cropped Slim', gender: 'Women', fit: 'Slim', size: '25', wash: 'Bleached', price: 74.99, stockLevel: 4 },
  { id: 'P015', name: 'Bootcut Slim', gender: 'Women', fit: 'Slim', size: '28', wash: 'Dark Wash', price: 89.99, stockLevel: 31 },
  { id: 'P016', name: 'Stretch Skinny', gender: 'Women', fit: 'Skinny', size: '27', wash: 'Midnight Blue', price: 84.99, stockLevel: 19 },
];

// Mock Orders
export const mockOrders: OrderDTO[] = [
  {
    id: 'ORD001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    items: [
      { productId: 'P001', productName: 'Classic Indigo Slim', quantity: 2, price: 89.99, size: '32' },
      { productId: 'P003', productName: 'Comfort Relaxed', quantity: 1, price: 74.99, size: '34' }
    ],
    status: 'Delivered',
    orderDate: '2024-01-15T10:30:00Z',
    shippedDate: '2024-01-16T14:00:00Z',
    deliveredDate: '2024-01-19T11:00:00Z',
    totalAmount: 254.97,
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    items: [
      { productId: 'P009', productName: 'High Rise Skinny', quantity: 1, price: 89.99, size: '26' }
    ],
    status: 'Shipped',
    orderDate: '2024-01-18T14:45:00Z',
    shippedDate: '2024-01-19T09:00:00Z',
    totalAmount: 89.99,
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001'
  },
  {
    id: 'ORD003',
    customerName: 'Michael Brown',
    customerEmail: 'mbrown@email.com',
    items: [
      { productId: 'P002', productName: 'Urban Skinny Fit', quantity: 1, price: 79.99, size: '30' },
      { productId: 'P007', productName: 'Executive Slim', quantity: 1, price: 99.99, size: '33' }
    ],
    status: 'Processing',
    orderDate: '2024-01-20T09:15:00Z',
    totalAmount: 179.98,
    shippingAddress: '789 Pine Rd, Chicago, IL 60601'
  },
  {
    id: 'ORD004',
    customerName: 'Emily Davis',
    customerEmail: 'emily.d@email.com',
    items: [
      { productId: 'P011', productName: 'Ankle Slim', quantity: 2, price: 84.99, size: '27' },
      { productId: 'P013', productName: 'Wide Leg Relaxed', quantity: 1, price: 99.99, size: '26' }
    ],
    status: 'Pending',
    orderDate: '2024-01-21T16:30:00Z',
    totalAmount: 269.97,
    shippingAddress: '321 Elm St, Houston, TX 77001'
  },
  {
    id: 'ORD005',
    customerName: 'David Wilson',
    customerEmail: 'dwilson@email.com',
    items: [
      { productId: 'P004', productName: 'Premium Slim Dark', quantity: 1, price: 129.99, size: '32' }
    ],
    status: 'Pending',
    orderDate: '2024-01-21T18:00:00Z',
    totalAmount: 129.99,
    shippingAddress: '555 Maple Dr, Phoenix, AZ 85001'
  },
  {
    id: 'ORD006',
    customerName: 'Jessica Martinez',
    customerEmail: 'jmartinez@email.com',
    items: [
      { productId: 'P016', productName: 'Stretch Skinny', quantity: 3, price: 84.99, size: '27' }
    ],
    status: 'Processing',
    orderDate: '2024-01-20T11:45:00Z',
    totalAmount: 254.97,
    shippingAddress: '888 Cedar Ln, Philadelphia, PA 19101'
  }
];

// Sales data for charts
export const mockSalesData: SalesData[] = [
  { month: 'Jan', men: 12500, women: 15200, total: 27700 },
  { month: 'Feb', men: 11800, women: 14100, total: 25900 },
  { month: 'Mar', men: 14200, women: 16800, total: 31000 },
  { month: 'Apr', men: 13500, women: 15900, total: 29400 },
  { month: 'May', men: 15800, women: 18200, total: 34000 },
  { month: 'Jun', men: 16200, women: 19500, total: 35700 },
];

// Category distribution data
export const getCategoryDistribution = (gender: 'Men' | 'Women' | 'All') => {
  const products = gender === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.gender === gender);
  
  const fitCounts = products.reduce((acc, product) => {
    acc[product.fit] = (acc[product.fit] || 0) + product.stockLevel;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: 'Slim', value: fitCounts['Slim'] || 0, fill: 'hsl(var(--chart-1))' },
    { name: 'Skinny', value: fitCounts['Skinny'] || 0, fill: 'hsl(var(--chart-3))' },
    { name: 'Relaxed', value: fitCounts['Relaxed'] || 0, fill: 'hsl(var(--chart-5))' },
  ];
};
