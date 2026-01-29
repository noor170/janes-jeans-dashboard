import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  category: string;
}

export interface ShipmentDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface PaymentDetails {
  type: 'card' | 'bkash';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bkashNumber?: string;
  transactionId?: string;
}

interface CartContextType {
  items: CartItem[];
  shipmentDetails: ShipmentDetails | null;
  paymentDetails: PaymentDetails | null;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  setShipmentDetails: (details: ShipmentDetails) => void;
  setPaymentDetails: (details: PaymentDetails) => void;
  resetCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shipmentDetails, setShipmentDetailsState] = useState<ShipmentDetails | null>(null);
  const [paymentDetails, setPaymentDetailsState] = useState<PaymentDetails | null>(null);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id && i.size === item.size);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id: string, size: string) => {
    setItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  }, []);

  const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id && item.size === size ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const setShipmentDetails = useCallback((details: ShipmentDetails) => {
    setShipmentDetailsState(details);
  }, []);

  const setPaymentDetails = useCallback((details: PaymentDetails) => {
    setPaymentDetailsState(details);
  }, []);

  const resetCheckout = useCallback(() => {
    setItems([]);
    setShipmentDetailsState(null);
    setPaymentDetailsState(null);
  }, []);

  return (
    <CartContext.Provider value={{
      items,
      shipmentDetails,
      paymentDetails,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      setShipmentDetails,
      setPaymentDetails,
      resetCheckout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
