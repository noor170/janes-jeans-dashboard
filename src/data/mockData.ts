import { ProductDTO, OrderDTO, SalesData, CustomerDTO, ShippingVendorDTO, ShipmentDTO } from '@/types';

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
    shippingAddress: '123 Main St, New York, NY 10001',
    notes: '**VIP Customer** - Handle with care.\n\n- Gift wrapping requested\n- Leave at front door'
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
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    notes: '## Special Instructions\n\nCustomer requested:\n1. Express shipping\n2. No promotional materials\n\n> "Please ensure fast delivery for birthday gift"'
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

// Mock Customers
export const mockCustomers: CustomerDTO[] = [
  {
    id: 'CUS001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    status: 'vip',
    totalOrders: 12,
    totalSpent: 1549.88,
    createdAt: '2023-03-15T10:00:00Z',
    notes: 'Prefers express shipping. Loyal customer since 2023.',
  },
  {
    id: 'CUS002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    status: 'active',
    totalOrders: 5,
    totalSpent: 449.95,
    createdAt: '2023-08-20T14:30:00Z',
  },
  {
    id: 'CUS003',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '+1 (555) 345-6789',
    address: '789 Pine Rd, Chicago, IL 60601',
    status: 'active',
    totalOrders: 8,
    totalSpent: 879.92,
    createdAt: '2023-05-10T09:15:00Z',
  },
  {
    id: 'CUS004',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '+1 (555) 456-7890',
    address: '321 Elm St, Houston, TX 77001',
    status: 'active',
    totalOrders: 3,
    totalSpent: 269.97,
    createdAt: '2024-01-05T16:45:00Z',
  },
  {
    id: 'CUS005',
    name: 'David Wilson',
    email: 'dwilson@email.com',
    phone: '+1 (555) 567-8901',
    address: '555 Maple Dr, Phoenix, AZ 85001',
    status: 'inactive',
    totalOrders: 1,
    totalSpent: 129.99,
    createdAt: '2023-11-28T11:00:00Z',
    notes: 'Account inactive - no orders in 60+ days.',
  },
  {
    id: 'CUS006',
    name: 'Jessica Martinez',
    email: 'jmartinez@email.com',
    phone: '+1 (555) 678-9012',
    address: '888 Cedar Ln, Philadelphia, PA 19101',
    status: 'vip',
    totalOrders: 15,
    totalSpent: 2124.85,
    createdAt: '2023-02-01T08:00:00Z',
    notes: 'Top customer. Enrolled in loyalty program.',
  },
  {
    id: 'CUS007',
    name: 'Robert Taylor',
    email: 'rtaylor@email.com',
    phone: '+1 (555) 789-0123',
    address: '999 Birch Blvd, San Antonio, TX 78201',
    status: 'active',
    totalOrders: 4,
    totalSpent: 359.96,
    createdAt: '2023-09-12T13:20:00Z',
  },
  {
    id: 'CUS008',
    name: 'Amanda White',
    email: 'awhite@email.com',
    phone: '+1 (555) 890-1234',
    address: '111 Spruce Way, San Diego, CA 92101',
    status: 'active',
    totalOrders: 6,
    totalSpent: 509.94,
    createdAt: '2023-07-03T10:30:00Z',
  },
];

// Mock Shipping Vendors
export const mockShippingVendors: ShippingVendorDTO[] = [
  {
    id: 'VND001',
    name: 'Pathao',
    code: 'PATHAO',
    contactEmail: 'business@pathao.com',
    contactPhone: '+880 9666-777777',
    website: 'https://pathao.com',
    trackingUrlTemplate: 'https://pathao.com/track/{tracking_number}',
    status: 'active',
    avgDeliveryDays: 3,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'VND002',
    name: 'Steadfast',
    code: 'STEADFAST',
    contactEmail: 'support@steadfast.com.bd',
    contactPhone: '+880 9612-123456',
    website: 'https://steadfast.com.bd',
    trackingUrlTemplate: 'https://steadfast.com.bd/track/{tracking_number}',
    status: 'active',
    avgDeliveryDays: 2,
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'VND003',
    name: 'Redx',
    code: 'REDX',
    contactEmail: 'info@redx.com.bd',
    contactPhone: '+880 9613-789012',
    website: 'https://redx.com.bd',
    trackingUrlTemplate: 'https://redx.com.bd/track/{tracking_number}',
    status: 'active',
    avgDeliveryDays: 4,
    createdAt: '2023-02-01T00:00:00Z',
  },
  {
    id: 'VND004',
    name: 'Paperfly',
    code: 'PAPERFLY',
    contactEmail: 'contact@paperfly.com.bd',
    contactPhone: '+880 9614-456789',
    website: 'https://paperfly.com.bd',
    status: 'inactive',
    avgDeliveryDays: 5,
    createdAt: '2023-03-01T00:00:00Z',
  },
];

// Mock Shipments
export const mockShipments: ShipmentDTO[] = [
  {
    id: 'SHP001',
    orderId: 'ORD001',
    vendorId: 'VND001',
    trackingNumber: 'PTH123456789',
    status: 'delivered',
    shippedAt: '2024-01-16T14:00:00Z',
    estimatedDelivery: '2024-01-19T18:00:00Z',
    deliveredAt: '2024-01-19T11:00:00Z',
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'SHP002',
    orderId: 'ORD002',
    vendorId: 'VND002',
    trackingNumber: 'STF987654321',
    status: 'in_transit',
    shippedAt: '2024-01-19T09:00:00Z',
    estimatedDelivery: '2024-01-21T18:00:00Z',
    createdAt: '2024-01-18T16:00:00Z',
  },
  {
    id: 'SHP003',
    orderId: 'ORD003',
    vendorId: 'VND001',
    trackingNumber: 'PTH456789123',
    status: 'pending',
    estimatedDelivery: '2024-01-25T18:00:00Z',
    createdAt: '2024-01-20T10:00:00Z',
  },
];
