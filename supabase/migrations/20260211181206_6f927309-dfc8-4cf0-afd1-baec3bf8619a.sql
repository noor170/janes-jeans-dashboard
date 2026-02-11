
-- Create shop products table
CREATE TABLE public.shop_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'jeans',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{"/placeholder.svg"}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Public read access (shop is public)
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shop products"
  ON public.shop_products
  FOR SELECT
  USING (true);

-- Seed with existing product data
INSERT INTO public.shop_products (id, name, description, price, category, sizes, colors, images, in_stock, rating, reviews) VALUES
  ('P001', 'Classic Indigo Slim', 'Timeless slim-fit jeans in classic indigo wash', 89.99, 'jeans', ARRAY['30','32','34','36'], ARRAY['Dark Indigo'], ARRAY['/images/products/mens-slim-dark.jpg'], true, 4.5, 128),
  ('P002', 'Urban Skinny Fit', 'Modern skinny jeans for urban style', 79.99, 'jeans', ARRAY['28','30','32'], ARRAY['Black'], ARRAY['/images/products/mens-skinny-black.jpg'], true, 4.3, 95),
  ('P003', 'Comfort Relaxed', 'Relaxed fit for all-day comfort', 74.99, 'jeans', ARRAY['32','34','36','38'], ARRAY['Stone Wash'], ARRAY['/images/products/mens-relaxed-light.jpg'], true, 4.6, 156),
  ('P004', 'Premium Slim Dark', 'Premium quality raw denim slim jeans', 129.99, 'jeans', ARRAY['30','32','34'], ARRAY['Raw Denim'], ARRAY['/images/products/mens-slim-navy.jpg'], true, 4.8, 234),
  ('P009', 'High Rise Skinny', 'Flattering high rise skinny jeans', 89.99, 'jeans', ARRAY['24','26','28','30'], ARRAY['Dark Indigo'], ARRAY['/images/products/womens-skinny-dark.jpg'], true, 4.7, 198),
  ('P010', 'Mom Fit Relaxed', 'Classic mom jeans with relaxed fit', 79.99, 'jeans', ARRAY['26','28','30'], ARRAY['Light Wash'], ARRAY['/images/products/womens-relaxed-light.jpg'], true, 4.4, 87),
  ('P011', 'Ankle Slim', 'Chic ankle-length slim jeans', 84.99, 'jeans', ARRAY['25','27','29'], ARRAY['Medium Blue'], ARRAY['/images/products/womens-slim-blue.jpg'], true, 4.6, 145),
  ('P012', 'Curve Skinny', 'Designed for curves skinny fit', 94.99, 'jeans', ARRAY['27','29','31'], ARRAY['Black'], ARRAY['/images/products/womens-skinny-black.jpg'], true, 4.5, 167),
  ('P017', 'Distressed Slim', 'Trendy distressed slim fit', 94.99, 'jeans', ARRAY['30','31','32','34'], ARRAY['Ripped Blue'], ARRAY['/images/products/mens-slim-ripped.jpg'], true, 4.3, 112),
  ('P013', 'Wide Leg Relaxed', 'Trendy wide leg relaxed jeans', 99.99, 'jeans', ARRAY['24','26','28'], ARRAY['Stone Wash'], ARRAY['/images/products/womens-relaxed-wide.jpg'], true, 4.7, 203),
  ('P015', 'Bootcut Slim', 'Classic bootcut slim jeans', 89.99, 'jeans', ARRAY['26','28','30'], ARRAY['Dark Wash'], ARRAY['/images/products/womens-slim-bootcut.jpg'], true, 4.6, 89),
  ('P020', 'Flare Leg', 'Retro flare leg jeans', 89.99, 'jeans', ARRAY['26','28','30'], ARRAY['Medium Wash'], ARRAY['/images/products/womens-flare-medium.jpg'], true, 4.4, 78);
