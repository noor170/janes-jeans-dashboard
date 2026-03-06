import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

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
  session: Session | null;
  registerWithAuth: (data: Omit<ShopCustomer, 'id'> & { password: string }) => Promise<void>;
  loginWithAuth: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Keep legacy methods for backward compat
  register: (data: Omit<ShopCustomer, 'id'>) => Promise<void>;
  login: (email: string, mobile: string) => Promise<void>;
}

const ShopCustomerContext = createContext<ShopCustomerContextType | null>(null);

const STORAGE_KEY = 'shop_customer';

export function ShopCustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopCustomer | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [session, setSession] = useState<Session | null>(null);

  // Listen for Supabase auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user && event === 'SIGNED_IN') {
        // Load customer profile from shop_customers
        const { data: row } = await supabase
          .from('shop_customers')
          .select('*')
          .eq('email', newSession.user.email!)
          .maybeSingle();

        if (row) {
          const c: ShopCustomer = {
            id: row.id,
            email: row.email,
            mobile: row.mobile,
            firstName: row.first_name,
            lastName: row.last_name,
            gender: row.gender,
            city: row.city,
          };
          setCustomer(c);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
        }
      } else if (event === 'SIGNED_OUT') {
        setCustomer(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (customer) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [customer]);

  const registerWithAuth = async (data: Omit<ShopCustomer, 'id'> & { password: string }) => {
    // 1. Sign up with Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError) throw new Error(authError.message);

    // 2. Create shop_customers profile
    const { data: existing } = await supabase
      .from('shop_customers')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();

    if (!existing) {
      const { error: profileError } = await supabase
        .from('shop_customers')
        .insert({
          email: data.email,
          mobile: data.mobile,
          first_name: data.firstName,
          last_name: data.lastName,
          gender: data.gender,
          city: data.city,
        });

      if (profileError) throw new Error(profileError.message);
    }
  };

  const loginWithAuth = async (email: string, password: string) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);

    // Load profile
    const { data: row, error } = await supabase
      .from('shop_customers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) throw new Error('Customer profile not found. Please register first.');

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

  // Legacy methods
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

  const logout = () => {
    supabase.auth.signOut();
    setCustomer(null);
  };

  return (
    <ShopCustomerContext.Provider value={{ customer, isLoggedIn: !!customer, session, registerWithAuth, loginWithAuth, register, login, logout }}>
      {children}
    </ShopCustomerContext.Provider>
  );
}

export const useShopCustomer = () => {
  const ctx = useContext(ShopCustomerContext);
  if (!ctx) throw new Error('useShopCustomer must be used within ShopCustomerProvider');
  return ctx;
};
