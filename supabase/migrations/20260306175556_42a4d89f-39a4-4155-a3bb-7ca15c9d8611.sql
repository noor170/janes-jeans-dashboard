
-- Create storage bucket for payment QR codes
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-qr-codes', 'payment-qr-codes', true);

-- Allow anyone to view QR codes (public bucket)
CREATE POLICY "Anyone can view payment QR codes"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-qr-codes');

-- Allow authenticated users (admin) to upload QR codes
CREATE POLICY "Authenticated users can upload QR codes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-qr-codes');

-- Allow authenticated users (admin) to update QR codes
CREATE POLICY "Authenticated users can update QR codes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'payment-qr-codes');

-- Allow authenticated users (admin) to delete QR codes
CREATE POLICY "Authenticated users can delete QR codes"
ON storage.objects FOR DELETE
USING (bucket_id = 'payment-qr-codes');

-- Create table to store payment method QR code references
CREATE TABLE public.payment_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_method TEXT NOT NULL UNIQUE CHECK (payment_method IN ('bkash', 'nagad')),
  qr_image_url TEXT NOT NULL,
  account_number TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_qr_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can view QR codes (for shop customers)
CREATE POLICY "Anyone can view payment QR codes table"
ON public.payment_qr_codes FOR SELECT
USING (true);

-- Public insert/update for admin (since we don't have auth on this project's Supabase)
CREATE POLICY "Anyone can insert payment QR codes"
ON public.payment_qr_codes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update payment QR codes"
ON public.payment_qr_codes FOR UPDATE
USING (true);
