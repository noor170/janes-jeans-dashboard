import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ShopCustomer {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  gender: string;
  city: string;
}

interface ShopCustomerContextType {
  customer: ShopCustomer | null;
  isLoggedIn: boolean;
  register: (data: Omit<ShopCustomer, 'id'>) => Promise<void>;
  login: (email: string, mobile: string) => Promise<void>;
  logout: () => void;
}

const ShopCustomerContext = createContext<ShopCustomerContextType | null>(null);

const STORAGE_KEY = 'shop_customer';

export function ShopCustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopCustomer | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (customer) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [customer]);

  const register = async (data: Omit<ShopCustomer, 'id'>) => {
    const { data: existing } = await supabase
      .from('shop_customers')
      .select('*')
      .eq('email', data.email)
      .maybeSingle();

    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const { data: row, error } = await supabase
      .from('shop_customers')
      .insert({
        email: data.email,
        mobile: data.mobile,
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender,
        city: data.city,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    setCustomer({
      id: row.id,
      email: row.email,
      mobile: row.mobile,
      firstName: row.first_name,
      lastName: row.last_name,
      gender: row.gender,
      city: row.city,
    });
  };

  const login = async (email: string, mobile: string) => {
    const { data: row, error } = await supabase
      .from('shop_customers')
      .select('*')
      .eq('email', email)
      .eq('mobile', mobile)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) throw new Error('No account found with this email and mobile number.');

    setCustomer({
      id: row.id,
      email: row.email,
      mobile: row.mobile,
      firstName: row.first_name,
      lastName: row.last_name,
      gender: row.gender,
      city: row.city,
    });
  };

  const logout = () => setCustomer(null);

  return (
    <ShopCustomerContext.Provider value={{ customer, isLoggedIn: !!customer, register, login, logout }}>
      {children}
    </ShopCustomerContext.Provider>
  );
}

export const useShopCustomer = () => {
  const ctx = useContext(ShopCustomerContext);
  if (!ctx) throw new Error('useShopCustomer must be used within ShopCustomerProvider');
  return ctx;
};
