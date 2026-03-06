import { describe, it, expect, vi, beforeEach } from 'vitest';

const API_BASE = 'http://localhost:8080';

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

describe('Shop API - Products', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
  });

  it('fetchShopProducts calls /api/shop/products', async () => {
    const mockProducts = [{
      id: 'p1', name: 'Slim Dark', description: 'Premium jeans', price: 89.99,
      category: 'jeans', sizes: ['30', '32'], colors: ['Dark Wash'],
      images: ['/images/products/mens-slim-dark.jpg'], inStock: true, rating: 4.5, reviews: 120,
    }];
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockProducts));

    const { fetchShopProducts } = await import('@/lib/shopApi');
    const result = await fetchShopProducts();

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/shop/products`,
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Slim Dark');
    expect(result[0].inStock).toBe(true);
  });

  it('fetchShopProducts with category filter', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse([]));

    const { fetchShopProducts } = await import('@/lib/shopApi');
    await fetchShopProducts('jeans');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/shop/products?category=jeans`,
      expect.any(Object)
    );
  });

  it('fetchShopProducts ignores "all" category', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse([]));

    const { fetchShopProducts } = await import('@/lib/shopApi');
    await fetchShopProducts('all');

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/shop/products`, expect.any(Object));
  });

  it('fetchShopProductById returns product', async () => {
    const mockProduct = {
      id: 'p1', name: 'Relaxed', description: 'Comfy', price: 79.99,
      category: 'jeans', sizes: ['34'], colors: ['Light'], images: ['/placeholder.svg'],
      inStock: true, rating: 4.2, reviews: 80,
    };
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockProduct));

    const { fetchShopProductById } = await import('@/lib/shopApi');
    const result = await fetchShopProductById('p1');

    expect(result?.name).toBe('Relaxed');
    expect(result?.price).toBe(79.99);
  });

  it('fetchShopProductById returns null on error', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({ message: 'Not found' }, 404));

    const { fetchShopProductById } = await import('@/lib/shopApi');
    const result = await fetchShopProductById('nonexistent');

    expect(result).toBeNull();
  });
});

describe('Shop API - Stock Check', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
  });

  it('checkStockAvailability returns available=true when stock is sufficient', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({ available: true, issues: [] }));

    const { checkStockAvailability } = await import('@/lib/shopApi');
    const result = await checkStockAvailability([
      { productId: 'p1', productName: 'Jeans', quantity: 1, size: '32', price: 89.99 },
    ]);

    expect(result.available).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('checkStockAvailability returns issues when stock is low', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({
      available: false,
      issues: [{ productId: 'p1', productName: 'Jeans', requestedQuantity: 10, availableStock: 2 }],
    }));

    const { checkStockAvailability } = await import('@/lib/shopApi');
    const result = await checkStockAvailability([
      { productId: 'p1', productName: 'Jeans', quantity: 10, size: '32', price: 89.99 },
    ]);

    expect(result.available).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].availableStock).toBe(2);
  });
});

describe('Shop API - Guest Orders', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
  });

  it('createGuestOrder sends POST and returns order response', async () => {
    const orderPayload = {
      items: [{ productId: 'p1', productName: 'Slim Jeans', quantity: 1, size: '32', price: 89.99 }],
      shipmentDetails: {
        name: 'John Doe', email: 'john@test.com', phone: '+880 1234567890',
        address: '123 Main St', city: 'Dhaka', postalCode: '1200',
      },
      payment: { type: 'CARD', status: 'SUCCESS' },
      totalAmount: 89.99,
    };

    const mockResponse = {
      id: 'ord-new-1', orderNumber: 'ORD-ABCD1234', status: 'Pending',
      totalAmount: 89.99, customerName: 'John Doe', customerEmail: 'john@test.com',
      createdAt: '2025-01-15T10:00:00',
    };
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockResponse, 201));

    const { createGuestOrder } = await import('@/lib/shopApi');
    const result = await createGuestOrder(orderPayload);

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/shop/orders`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(orderPayload),
      })
    );
    expect(result.orderNumber).toBe('ORD-ABCD1234');
    expect(result.totalAmount).toBe(89.99);
  });

  it('createGuestOrder throws stock error on 409', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({
      ok: false,
      status: 409,
      json: () => Promise.resolve({
        message: 'Some items are out of stock',
        stockErrors: ['Slim Jeans: only 0 available (requested 1)'],
      }),
    } as Response));

    const { createGuestOrder } = await import('@/lib/shopApi');

    await expect(createGuestOrder({
      items: [{ productId: 'p1', productName: 'Slim Jeans', quantity: 1, size: '32', price: 89.99 }],
      shipmentDetails: { name: 'X', email: 'x@t.com', phone: '1', address: 'a', city: 'c', postalCode: '1' },
      payment: { type: 'CARD', status: 'SUCCESS' },
      totalAmount: 89.99,
    })).rejects.toMatchObject({ stockError: true });
  });
});

describe('Shop Product Mapper', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockClear();
  });

  it('maps missing fields with defaults', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse([{
      id: 'p1', name: 'Test', price: '49.99',
      // Missing optional fields
    }]));

    const { fetchShopProducts } = await import('@/lib/shopApi');
    const result = await fetchShopProducts();

    expect(result[0].description).toBe('');
    expect(result[0].category).toBe('jeans');
    expect(result[0].sizes).toEqual([]);
    expect(result[0].colors).toEqual([]);
    expect(result[0].images).toEqual(['/placeholder.svg']);
    expect(result[0].inStock).toBe(true);
    expect(result[0].price).toBe(49.99);
  });
});
