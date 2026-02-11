import { ShopProduct } from '@/data/shopProducts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw error;
  }
  return response.json();
};

// ============= SHOP PRODUCTS (Public - No Auth) =============

export const fetchShopProducts = async (category?: string): Promise<ShopProduct[]> => {
  const params = category && category !== 'all' ? `?category=${category}` : '';
  const response = await fetch(`${API_BASE_URL}/api/shop/products${params}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await handleResponse<any[]>(response);
  return data.map(mapShopProduct);
};

export const fetchShopProductById = async (id: string): Promise<ShopProduct | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shop/products/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await handleResponse<any>(response);
    return mapShopProduct(data);
  } catch {
    return null;
  }
};

// ============= GUEST ORDERS (Public - No Auth) =============

export interface GuestOrderPayload {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    size: string;
    price: number;
  }[];
  shipmentDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  payment: {
    type: string;
    status: string;
  };
  totalAmount: number;
}

export interface GuestOrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

export const createGuestOrder = async (payload: GuestOrderPayload): Promise<GuestOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/shop/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<GuestOrderResponse>(response);
};

// ============= MAPPER =============

const mapShopProduct = (p: any): ShopProduct => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: Number(p.price),
  category: p.category || 'jeans',
  sizes: p.sizes || [],
  colors: p.colors || [],
  images: p.images || ['/placeholder.svg'],
  inStock: p.inStock ?? true,
  rating: p.rating || 4.5,
  reviews: p.reviews || 100,
});
