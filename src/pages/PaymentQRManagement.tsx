import { useState, useEffect } from 'react';
import { Upload, Trash2, QrCode, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PaymentQR {
  id?: string;
  payment_method: string;
  qr_image_url: string;
  account_number: string;
}

const METHODS = [
  { key: 'bkash', label: 'bKash', color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/20', border: 'border-pink-200' },
  { key: 'nagad', label: 'Nagad', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200' },
];

export default function PaymentQRManagement() {
  const [qrData, setQrData] = useState<Record<string, PaymentQR>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [accountNumbers, setAccountNumbers] = useState<Record<string, string>>({ bkash: '', nagad: '' });

  const fetchQRCodes = async () => {
    const { data } = await supabase
      .from('payment_qr_codes')
      .select('*');
    if (data) {
      const map: Record<string, PaymentQR> = {};
      const nums: Record<string, string> = { bkash: '', nagad: '' };
      data.forEach((item) => {
        map[item.payment_method] = item;
        nums[item.payment_method] = item.account_number || '';
      });
      setQrData(map);
      setAccountNumbers(nums);
    }
  };

  useEffect(() => { fetchQRCodes(); }, []);

  const handleUpload = async (method: string, file: File) => {
    setUploading(method);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${method}-qr.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('payment-qr-codes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('payment-qr-codes')
        .getPublicUrl(fileName);

      const qrImageUrl = urlData.publicUrl;

      // Upsert to table
      const { error: dbError } = await supabase
        .from('payment_qr_codes')
        .upsert({
          payment_method: method,
          qr_image_url: qrImageUrl,
          account_number: accountNumbers[method] || '',
        }, { onConflict: 'payment_method' });

      if (dbError) throw dbError;

      toast.success(`${method === 'bkash' ? 'bKash' : 'Nagad'} QR code uploaded successfully`);
      fetchQRCodes();
    } catch (err: unknown) {
      toast.error(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteQR = async (method: string) => {
    try {
      // Delete from storage
      const files = [`${method}-qr.jpg`, `${method}-qr.png`, `${method}-qr.jpeg`, `${method}-qr.webp`];
      await supabase.storage.from('payment-qr-codes').remove(files);

      // Delete from table
      await supabase
        .from('payment_qr_codes')
        .delete()
        .eq('payment_method', method);

      toast.success('QR code removed');
      fetchQRCodes();
    } catch {
      toast.error('Failed to remove QR code');
    }
  };

  const handleSaveAccountNumber = async (method: string) => {
    try {
      const existing = qrData[method];
      if (existing) {
        await supabase
          .from('payment_qr_codes')
          .update({ account_number: accountNumbers[method] })
          .eq('payment_method', method);
      } else {
        await supabase
          .from('payment_qr_codes')
          .upsert({
            payment_method: method,
            qr_image_url: '',
            account_number: accountNumbers[method],
          }, { onConflict: 'payment_method' });
      }
      toast.success('Account number saved');
      fetchQRCodes();
    } catch {
      toast.error('Failed to save account number');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment QR Codes</h2>
        <p className="text-muted-foreground">
          Upload QR codes for bKash and Nagad payment methods. Customers will see these during checkout.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {METHODS.map(({ key, label, color, bg, border }) => (
          <Card key={key} className={`${border}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${color}`}>
                <Smartphone className="h-5 w-5" />
                {label} QR Code
              </CardTitle>
              <CardDescription>
                Upload a {label} payment QR code for customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current QR Display */}
              {qrData[key]?.qr_image_url ? (
                <div className={`flex flex-col items-center gap-3 p-4 rounded-lg ${bg}`}>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <img
                      src={qrData[key].qr_image_url}
                      alt={`${label} QR`}
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteQR(key)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove QR
                  </Button>
                </div>
              ) : (
                <div className={`flex flex-col items-center gap-3 p-6 rounded-lg ${bg}`}>
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No QR code uploaded</p>
                </div>
              )}

              {/* Upload Button */}
              <div>
                <Label htmlFor={`qr-${key}`} className="text-sm font-medium">
                  Upload QR Image
                </Label>
                <div className="mt-1">
                  <Input
                    id={`qr-${key}`}
                    type="file"
                    accept="image/*"
                    disabled={uploading === key}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(key, file);
                    }}
                  />
                </div>
                {uploading === key && (
                  <p className="text-sm text-muted-foreground mt-1">Uploading...</p>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor={`acc-${key}`} className="text-sm font-medium">
                  Account Number
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`acc-${key}`}
                    placeholder="01XXXXXXXXX"
                    value={accountNumbers[key]}
                    onChange={(e) =>
                      setAccountNumbers((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleSaveAccountNumber(key)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
