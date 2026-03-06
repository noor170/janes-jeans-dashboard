import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Package, ArrowLeft, Loader2, CheckCircle2, Clock, Truck, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const trackingSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
});

type TrackingData = z.infer<typeof trackingSchema>;

interface OrderInfo {
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  payment_status: string;
  payment_type: string;
  total_amount: number;
  created_at: string;
  shipping_address: string | null;
  shipping_city: string | null;
  items: Array<{
    product_name: string;
    quantity: number;
    size: string | null;
    price: number;
  }>;
}

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

function getStatusIndex(status: string) {
  const idx = statusSteps.findIndex(s => s.toLowerCase() === status.toLowerCase());
  return idx >= 0 ? idx : 0;
}

const statusIcons = [Clock, Package, Truck, PackageCheck];

export default function OrderTracking() {
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [searched, setSearched] = useState(false);

  const form = useForm<TrackingData>({
    resolver: zodResolver(trackingSchema),
    defaultValues: { orderNumber: '' },
  });

  const onSubmit = async (data: TrackingData) => {
    setIsLoading(true);
    setSearched(true);
    setOrder(null);

    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', data.orderNumber)
        .maybeSingle();

      if (error) throw error;
      if (!orderData) {
        toast.error('No order found with this order number and email.');
        return;
      }

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('product_name, quantity, size, price')
        .eq('order_id', orderData.id);

      setOrder({
        ...orderData,
        items: itemsData || [],
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to track order');
    } finally {
      setIsLoading(false);
    }
  };

  const currentStep = order ? getStatusIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/shop">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <h1 className="text-xl font-bold">Track Your Order</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" /> Find Your Order
            </CardTitle>
            <CardDescription>Enter your order number to check the status</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="orderNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. ORD-XXXXXX" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Searching...</> : <><Search className="h-4 w-4 mr-2" /> Track Order</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {searched && !order && !isLoading && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No order found</p>
              <p className="text-sm">Please check your order number and email address.</p>
            </CardContent>
          </Card>
        )}

        {order && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order {order.order_number}</CardTitle>
                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </div>
              <CardDescription>
                Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Timeline */}
              <div className="flex items-center justify-between relative">
                {statusSteps.map((step, i) => {
                  const Icon = statusIcons[i];
                  const isComplete = i <= currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center z-10 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isComplete ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground'}`}>
                        {isComplete && i < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isComplete ? 'text-primary' : 'text-muted-foreground'}`}>{step}</span>
                    </div>
                  );
                })}
                {/* Connecting line */}
                <div className="absolute top-5 left-[12%] right-[12%] h-0.5 bg-border -z-0">
                  <div className="h-full bg-primary transition-all" style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }} />
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.product_name} {item.size ? `(${item.size})` : ''} × {item.quantity}</span>
                      <span className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">৳{Number(order.total_amount).toFixed(2)}</span>
              </div>

              {order.shipping_address && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-1">Shipping To</h3>
                    <p className="text-sm text-muted-foreground">{order.shipping_address}, {order.shipping_city}</p>
                  </div>
                </>
              )}

              <div>
                <h3 className="font-semibold mb-1">Payment</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {order.payment_type === 'bkash' ? 'bKash' : 'Nagad'} — <Badge variant="outline">{order.payment_status}</Badge>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
