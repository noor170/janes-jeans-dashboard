import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, Truck, PackageCheck, CheckCircle2, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useShopCustomer } from '@/contexts/ShopCustomerContext';
import { toast } from 'sonner';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const statusIcons = [Clock, Package, Truck, PackageCheck];

function getStatusIndex(status: string) {
  const idx = statusSteps.findIndex(s => s.toLowerCase() === status.toLowerCase());
  return idx >= 0 ? idx : 0;
}

interface OrderWithItems {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_type: string;
  total_amount: number;
  created_at: string;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  notes: string | null;
  items: Array<{
    product_name: string;
    quantity: number;
    size: string | null;
    price: number;
  }>;
}

export default function MyOrders() {
  const { customer, isLoggedIn } = useShopCustomer();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !customer) {
      navigate('/shop/register', { state: { from: '/shop/my-orders' } });
      return;
    }
    fetchOrders();
  }, [isLoggedIn, customer]);

  async function fetchOrders() {
    if (!customer) return;
    setLoading(true);
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', customer.email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch items for all orders
      const orderIds = (ordersData || []).map(o => o.id);
      let allItems: any[] = [];
      if (orderIds.length > 0) {
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('order_id, product_name, quantity, size, price')
          .in('order_id', orderIds);
        allItems = itemsData || [];
      }

      const ordersWithItems: OrderWithItems[] = (ordersData || []).map(order => ({
        ...order,
        items: allItems.filter(item => item.order_id === order.id),
      }));

      setOrders(ordersWithItems);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadgeVariant(status: string) {
    switch (status.toLowerCase()) {
      case 'delivered': return 'default' as const;
      case 'shipped': return 'secondary' as const;
      case 'processing': return 'outline' as const;
      default: return 'outline' as const;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/shop">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <h1 className="text-xl font-bold">My Orders</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
              <Button asChild><Link to="/shop">Browse Products</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {orders.map((order) => {
              const currentStep = getStatusIndex(order.status);
              return (
                <AccordionItem key={order.id} value={order.id} className="border rounded-lg px-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="text-left">
                        <p className="font-semibold">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">৳{Number(order.total_amount).toFixed(2)}</span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {/* Status Timeline */}
                    <div className="flex items-center justify-between relative my-4">
                      {statusSteps.map((step, i) => {
                        const Icon = statusIcons[i];
                        const isComplete = i <= currentStep;
                        return (
                          <div key={step} className="flex flex-col items-center z-10 flex-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${isComplete ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground'}`}>
                              {isComplete && i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                            </div>
                            <span className={`text-[10px] mt-1.5 font-medium ${isComplete ? 'text-primary' : 'text-muted-foreground'}`}>{step}</span>
                          </div>
                        );
                      })}
                      <div className="absolute top-[18px] left-[12%] right-[12%] h-0.5 bg-border -z-0">
                        <div className="h-full bg-primary transition-all" style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }} />
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Items */}
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.product_name} {item.size ? `(${item.size})` : ''} × {item.quantity}</span>
                          <span className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">৳{Number(order.total_amount).toFixed(2)}</span>
                    </div>

                    {order.shipping_address && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Shipping: </span>
                        {order.shipping_address}, {order.shipping_city} {order.shipping_postal_code || ''}
                      </div>
                    )}

                    <div className="mt-2 text-sm">
                      <span className="font-medium">Payment: </span>
                      <span className="text-muted-foreground capitalize">{order.payment_type}</span>
                      {' — '}
                      <Badge variant="outline" className="text-xs">{order.payment_status}</Badge>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </main>
    </div>
  );
}
