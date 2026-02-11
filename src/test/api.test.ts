import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock import.meta.env
vi.stubGlobal('import', { meta: { env: { VITE_API_URL: 'http://localhost:8080' } } });

const API_BASE = 'http://localhost:8080';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockJsonResponse(data: any, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
  } as Response);
}

describe('API Module - Products', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('accessToken', 'test-jwt-token');
  });

  it('fetchProducts sends correct request for All gender', async () => {
    const mockProducts = [
      { id: '1', name: 'Slim Fit', gender: 'Men', fit: 'Slim', size: '32', wash: 'Dark', price: 89.99, stockLevel: 25 },
    ];
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockProducts));

    const { fetchProducts } = await import('@/lib/api');
    const result = await fetchProducts('All');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/products`,
      expect.objectContaining({ headers: expect.any(Object) })
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Slim Fit');
    expect(result[0].price).toBe(89.99);
  });

  it('fetchProducts sends gender filter param', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse([]));

    const { fetchProducts } = await import('@/lib/api');
    await fetchProducts('Men');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/products?gender=Men`,
      expect.any(Object)
    );
  });
});

describe('API Module - Orders', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('accessToken', 'test-jwt-token');
  });

  it('fetchOrders returns mapped orders', async () => {
    const mockOrders = [{
      id: 'ord-1',
      customerName: 'John Doe',
      customerEmail: 'john@test.com',
      items: [{ productId: 'p1', productName: 'Jeans', quantity: 2, price: 50, size: '32' }],
      status: 'Pending',
      orderDate: '2025-01-01',
      totalAmount: 100,
      shippingAddress: '123 St',
    }];
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockOrders));

    const { fetchOrders } = await import('@/lib/api');
    const result = await fetchOrders();

    expect(result).toHaveLength(1);
    expect(result[0].customerName).toBe('John Doe');
    expect(result[0].totalAmount).toBe(100);
    expect(result[0].items[0].price).toBe(50);
  });

  it('createOrder sends POST with correct body', async () => {
    const newOrder = {
      customerName: 'Jane',
      customerEmail: 'jane@test.com',
      items: [{ productId: 'p1', productName: 'Slim Jeans', quantity: 1, price: 89.99, size: '28' }],
      status: 'Pending' as const,
      totalAmount: 89.99,
      shippingAddress: '456 Ave',
    };
    mockFetch.mockReturnValueOnce(mockJsonResponse({ id: 'new-1', ...newOrder, orderDate: '2025-01-15' }));

    const { createOrder } = await import('@/lib/api');
    const result = await createOrder(newOrder);

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/orders`,
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.id).toBe('new-1');
  });

  it('updateOrderStatus sends PUT with status', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({
      id: 'ord-1', customerName: 'John', customerEmail: 'j@t.com',
      items: [], status: 'Shipped', orderDate: '2025-01-01', totalAmount: 100,
    }));

    const { updateOrderStatus } = await import('@/lib/api');
    const result = await updateOrderStatus('ord-1', 'Shipped');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/orders/ord-1/status`,
      expect.objectContaining({ method: 'PUT' })
    );
    expect(result?.status).toBe('Shipped');
  });

  it('deleteOrder returns true on success', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: true, status: 200 }));

    const { deleteOrder } = await import('@/lib/api');
    const result = await deleteOrder('ord-1');

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/orders/ord-1`,
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

describe('API Module - Customers', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
    localStorageMock.setItem('accessToken', 'test-jwt-token');
  });

  it('fetchCustomers returns mapped customers', async () => {
    const mockCustomers = [{
      id: 'c1', name: 'Alice', email: 'alice@test.com', phone: '123',
      address: '789 Blvd', status: 'active', totalOrders: 5, totalSpent: 500, createdAt: '2025-01-01',
    }];
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockCustomers));

    const { fetchCustomers } = await import('@/lib/api');
    const result = await fetchCustomers();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
    expect(result[0].totalSpent).toBe(500);
  });

  it('createCustomer sends POST request', async () => {
    const newCustomer = { name: 'Bob', email: 'bob@test.com', phone: '456', address: '101 Rd', status: 'active' as const };
    mockFetch.mockReturnValueOnce(mockJsonResponse({ id: 'c2', ...newCustomer, totalOrders: 0, totalSpent: 0, createdAt: '2025-01-15' }));

    const { createCustomer } = await import('@/lib/api');
    const result = await createCustomer(newCustomer);

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/customers`, expect.objectContaining({ method: 'POST' }));
    expect(result.id).toBe('c2');
  });

  it('deleteCustomer returns true on success', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: true, status: 200 }));

    const { deleteCustomer } = await import('@/lib/api');
    expect(await deleteCustomer('c1')).toBe(true);
  });
});

describe('API Module - Shipping Vendors', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
    localStorageMock.setItem('accessToken', 'test-jwt-token');
  });

  it('fetchShippingVendors returns mapped vendors', async () => {
    const mockVendors = [{
      id: 'v1', name: 'FedEx', code: 'FDX', contactEmail: 'support@fedex.com',
      contactPhone: '800-123', website: 'https://fedex.com',
      trackingUrlTemplate: 'https://fedex.com/track/{trackingNumber}',
      status: 'active', avgDeliveryDays: 3, createdAt: '2025-01-01',
    }];
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockVendors));

    const { fetchShippingVendors } = await import('@/lib/api');
    const result = await fetchShippingVendors();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('FedEx');
    expect(result[0].avgDeliveryDays).toBe(3);
  });

  it('createShippingVendor sends POST', async () => {
    const vendor = { name: 'DHL', code: 'DHL', contactEmail: 'dhl@test.com', contactPhone: '999', status: 'active' as const, avgDeliveryDays: 5 };
    mockFetch.mockReturnValueOnce(mockJsonResponse({ id: 'v2', ...vendor, createdAt: '2025-01-15' }));

    const { createShippingVendor } = await import('@/lib/api');
    const result = await createShippingVendor(vendor);

    expect(result.name).toBe('DHL');
  });
});

describe('API Module - Shipments', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
    localStorageMock.setItem('accessToken', 'test-jwt-token');
  });

  it('fetchShipments returns mapped shipments', async () => {
    const mockShipments = [{
      id: 's1', orderId: 'ord-1', vendorId: 'v1', trackingNumber: 'TRK123',
      status: 'In Transit', shippingAddress: '123 St', shippedAt: '2025-01-10',
      estimatedDelivery: '2025-01-15', createdAt: '2025-01-10',
    }];
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockShipments));

    const { fetchShipments } = await import('@/lib/api');
    const result = await fetchShipments();

    expect(result).toHaveLength(1);
    expect(result[0].trackingNumber).toBe('TRK123');
  });

  it('createShipment sends POST with shipment data', async () => {
    const shipment = {
      orderId: 'ord-1', vendorId: 'v1', trackingNumber: 'TRK456',
      status: 'pending' as const, shippingAddress: '456 Ave',
    };
    mockFetch.mockReturnValueOnce(mockJsonResponse({ id: 's2', ...shipment, createdAt: '2025-01-15' }));

    const { createShipment } = await import('@/lib/api');
    const result = await createShipment(shipment);

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/shipments`, expect.objectContaining({ method: 'POST' }));
    expect(result.trackingNumber).toBe('TRK456');
  });

  it('fetchShipmentByOrderId returns undefined on 404', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: false, status: 404 }));

    const { fetchShipmentByOrderId } = await import('@/lib/api');
    const result = await fetchShipmentByOrderId('nonexistent');

    expect(result).toBeUndefined();
  });

  it('updateShipmentStatus sends PUT', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({
      id: 's1', orderId: 'ord-1', vendorId: 'v1', trackingNumber: 'TRK123',
      status: 'delivered', shippingAddress: '123 St', createdAt: '2025-01-10',
    }));

    const { updateShipmentStatus } = await import('@/lib/api');
    const result = await updateShipmentStatus('s1', 'delivered');

    expect(result?.status).toBe('delivered');
  });
});

describe('API Error Handling', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
    localStorageMock.setItem('accessToken', 'test-jwt-token');
  });

  it('throws error on non-OK response', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({ message: 'Unauthorized' }, 401));

    const { fetchProducts } = await import('@/lib/api');
    await expect(fetchProducts('All')).rejects.toEqual({ message: 'Unauthorized' });
  });

  it('fetchOrderById returns undefined on error', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({ message: 'Not found' }, 404));

    const { fetchOrderById } = await import('@/lib/api');
    const result = await fetchOrderById('nonexistent');

    expect(result).toBeUndefined();
  });
});
