import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, ArrowRight } from 'lucide-react';
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
import { useCart, PaymentDetails } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const cardSchema = z.object({
  cardNumber: z.string().min(16, 'Please enter a valid card number').max(19),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Please enter in MM/YY format'),
  cvv: z.string().min(3, 'Please enter a valid CVV').max(4),
});

const bkashSchema = z.object({
  bkashNumber: z.string().min(11, 'Please enter a valid bKash number').max(14),
  transactionId: z.string().optional(),
});

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, shipmentDetails, setPaymentDetails, getCartTotal } = useCart();
  const [paymentType, setPaymentType] = useState<'card' | 'bkash'>('card');

  const cardForm = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardNumber: '', expiryDate: '', cvv: '' },
  });

  const bkashForm = useForm({
    resolver: zodResolver(bkashSchema),
    defaultValues: { bkashNumber: '', transactionId: '' },
  });

  if (items.length === 0 || !shipmentDetails) {
    navigate('/shop/cart');
    return null;
  }

  const handleCardSubmit = (data: z.infer<typeof cardSchema>) => {
    setPaymentDetails({ type: 'card', ...data });
    navigate('/shop/order-success');
  };

  const handleBkashSubmit = (data: z.infer<typeof bkashSchema>) => {
    setPaymentDetails({ type: 'bkash', ...data });
    navigate('/shop/order-success');
  };

  const total = getCartTotal();
  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

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
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentType}
                  onValueChange={(v) => setPaymentType(v as 'card' | 'bkash')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className={cn(
                        'flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                        paymentType === 'card' && 'border-primary'
                      )}
                    >
                      <CreditCard className="h-8 w-8 mb-2" />
                      <span className="font-semibold">Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="bkash" id="bkash" className="peer sr-only" />
                    <Label
                      htmlFor="bkash"
                      className={cn(
                        'flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                        paymentType === 'bkash' && 'border-primary'
                      )}
                    >
                      <Smartphone className="h-8 w-8 mb-2" />
                      <span className="font-semibold">bKash</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Payment Form */}
            {paymentType === 'card' && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                  <CardDescription>Enter your card information securely</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...cardForm}>
                    <form onSubmit={cardForm.handleSubmit(handleCardSubmit)} className="space-y-4">
                      <FormField
                        control={cardForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={cardForm.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={cardForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" size="lg" className="w-full">
                        Pay ${grandTotal.toFixed(2)}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* bKash Payment Form */}
            {paymentType === 'bkash' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-pink-600">bKash Payment</CardTitle>
                  <CardDescription>
                    Send payment to: <span className="font-semibold">01700-000000</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...bkashForm}>
                    <form onSubmit={bkashForm.handleSubmit(handleBkashSubmit)} className="space-y-4">
                      <FormField
                        control={bkashForm.control}
                        name="bkashNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your bKash Number</FormLabel>
                            <FormControl>
                              <Input placeholder="01XXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={bkashForm.control}
                        name="transactionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction ID (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="TrxID from bKash" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                        <p className="font-semibold">Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                          <li>Open bKash app and go to Send Money</li>
                          <li>Enter number: 01700-000000</li>
                          <li>Send amount: ${grandTotal.toFixed(2)}</li>
                          <li>Enter the Transaction ID above</li>
                        </ol>
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-pink-600 hover:bg-pink-700">
                        Confirm bKash Payment
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
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
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
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
