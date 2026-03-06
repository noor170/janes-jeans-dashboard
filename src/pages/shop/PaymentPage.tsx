import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, ArrowRight, QrCode } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckoutSteps } from '@/components/shop/CheckoutSteps';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const mobilePaymentSchema = z.object({
  senderNumber: z.string().min(11, 'Please enter a valid mobile number').max(14),
  transactionId: z.string().min(1, 'Transaction ID is required'),
});

interface PaymentQRCode {
  payment_method: string;
  qr_image_url: string;
  account_number: string;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, shipmentDetails, setPaymentDetails, getCartTotal, appliedCoupon } = useCart();
  const [paymentType, setPaymentType] = useState<'bkash' | 'nagad'>('bkash');
  const [qrCodes, setQrCodes] = useState<Record<string, PaymentQRCode>>({});

  const form = useForm({
    resolver: zodResolver(mobilePaymentSchema),
    defaultValues: { senderNumber: '', transactionId: '' },
  });

  useEffect(() => {
    const fetchQRCodes = async () => {
      const { data } = await supabase
        .from('payment_qr_codes')
        .select('payment_method, qr_image_url, account_number');
      if (data) {
        const map: Record<string, PaymentQRCode> = {};
        data.forEach((item) => {
          map[item.payment_method] = item;
        });
        setQrCodes(map);
      }
    };
    fetchQRCodes();
  }, []);

  if (items.length === 0 || !shipmentDetails) {
    navigate('/shop/cart');
    return null;
  }

  const handleSubmit = (data: z.infer<typeof mobilePaymentSchema>) => {
    setPaymentDetails({
      type: paymentType as 'bkash',
      bkashNumber: data.senderNumber,
      transactionId: data.transactionId,
    });
    navigate('/shop/order-success');
  };

  const total = getCartTotal();
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const shipping = total > 100 ? 0 : 9.99;
  const tax = (total - couponDiscount) * 0.08;
  const grandTotal = total - couponDiscount + shipping + tax;

  const currentQR = qrCodes[paymentType];
  const accountNumber = currentQR?.account_number || '';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/shop/checkout">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Payment</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CheckoutSteps currentStep={3} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select bKash or Nagad to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentType}
                  onValueChange={(v) => {
                    setPaymentType(v as 'bkash' | 'nagad');
                    form.reset();
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="bkash" id="bkash" className="peer sr-only" />
                    <Label
                      htmlFor="bkash"
                      className={cn(
                        'flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                        paymentType === 'bkash' && 'border-pink-500 bg-pink-50 dark:bg-pink-950/20'
                      )}
                    >
                      <Smartphone className="h-8 w-8 mb-2 text-pink-600" />
                      <span className="font-semibold text-pink-600">bKash</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="nagad" id="nagad" className="peer sr-only" />
                    <Label
                      htmlFor="nagad"
                      className={cn(
                        'flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                        paymentType === 'nagad' && 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                      )}
                    >
                      <Smartphone className="h-8 w-8 mb-2 text-orange-600" />
                      <span className="font-semibold text-orange-600">Nagad</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* QR Code & Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className={paymentType === 'bkash' ? 'text-pink-600' : 'text-orange-600'}>
                  {paymentType === 'bkash' ? 'bKash' : 'Nagad'} Payment
                </CardTitle>
                <CardDescription>
                  {accountNumber
                    ? <>Send payment to: <span className="font-semibold">{accountNumber}</span></>
                    : 'Scan the QR code below to pay'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code Display */}
                {currentQR?.qr_image_url ? (
                  <div className="flex flex-col items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Scan QR Code to Pay</p>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <img
                        src={currentQR.qr_image_url}
                        alt={`${paymentType} QR Code`}
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <p className="text-lg font-bold">
                      Amount: <span className={paymentType === 'bkash' ? 'text-pink-600' : 'text-orange-600'}>৳{grandTotal.toFixed(2)}</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-6 bg-muted/50 rounded-lg text-muted-foreground">
                    <QrCode className="h-16 w-16" />
                    <p className="text-sm">QR code not available. Please use the account number above.</p>
                  </div>
                )}

                {/* Payment Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="senderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your {paymentType === 'bkash' ? 'bKash' : 'Nagad'} Number</FormLabel>
                          <FormControl>
                            <Input placeholder="01XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transactionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter TrxID after payment" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                      <p className="font-semibold">Instructions:</p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Scan the QR code or open {paymentType === 'bkash' ? 'bKash' : 'Nagad'} app</li>
                        <li>Go to Send Money{accountNumber ? ` → ${accountNumber}` : ''}</li>
                        <li>Send amount: ৳{grandTotal.toFixed(2)}</li>
                        <li>Enter the Transaction ID above</li>
                      </ol>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className={cn(
                        'w-full',
                        paymentType === 'bkash'
                          ? 'bg-pink-600 hover:bg-pink-700'
                          : 'bg-orange-600 hover:bg-orange-700'
                      )}
                    >
                      Confirm {paymentType === 'bkash' ? 'bKash' : 'Nagad'} Payment
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Shipping to:</p>
                  <div className="text-sm text-muted-foreground">
                    <p>{shipmentDetails.name}</p>
                    <p>{shipmentDetails.address}</p>
                    <p>{shipmentDetails.city}, {shipmentDetails.postalCode}</p>
                    <p>{shipmentDetails.phone}</p>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Coupon ({appliedCoupon?.code})</span>
                      <span>-৳{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `৳${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>৳{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">৳{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
