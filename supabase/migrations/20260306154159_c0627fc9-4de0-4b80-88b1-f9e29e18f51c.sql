
-- Add subcategory and metadata JSONB to shop_products
ALTER TABLE public.shop_products
  ADD COLUMN IF NOT EXISTS subcategory text DEFAULT '',
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Create shop_categories reference table
CREATE TABLE public.shop_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text DEFAULT 'Package',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.shop_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.shop_categories FOR SELECT USING (true);

-- Create shop_subcategories reference table
CREATE TABLE public.shop_subcategories (
  id text PRIMARY KEY,
  category_id text NOT NULL REFERENCES public.shop_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(category_id, slug)
);

ALTER TABLE public.shop_subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subcategories" ON public.shop_subcategories FOR SELECT USING (true);
