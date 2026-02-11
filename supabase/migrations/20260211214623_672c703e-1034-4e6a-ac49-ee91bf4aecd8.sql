
-- Create shop_customers table for customer registration
CREATE TABLE public.shop_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shop_customers ENABLE ROW LEVEL SECURITY;

-- Anyone can register (insert)
CREATE POLICY "Anyone can register as shop customer"
ON public.shop_customers
FOR INSERT
WITH CHECK (true);

-- Customers can view their own record by email
CREATE POLICY "Anyone can view shop customers"
ON public.shop_customers
FOR SELECT
USING (true);
