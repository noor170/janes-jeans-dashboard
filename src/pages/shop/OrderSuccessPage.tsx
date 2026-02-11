import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckoutSteps } from '@/components/shop/CheckoutSteps';
import { useCart } from '@/contexts/CartContext';
import { createGuestOrder, checkStockAvailability, GuestOrderResponse, StockCheckResult } from '@/lib/shopApi';
import { toast } from 'sonner';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { items, shipmentDetails, paymentDetails, getCartTotal, resetCheckout } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderResponse, setOrderResponse] = useState<GuestOrderResponse | null>(null);
  const [stockIssues, setStockIssues] = useState<StockCheckResult['issues']>([]);

  useEffect(() => {
    if (!orderPlaced && (items.length === 0 || !shipmentDetails || !paymentDetails)) {
      navigate('/shop/cart');
      return;
    }

    // Check stock on page load
    if (items.length > 0 && !orderPlaced) {
      setIsCheckingStock(true);
      checkStockAvailability(
        items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        }))
      )
        .then((result) => {
          if (!result.available) {
            setStockIssues(result.issues);
          }
        })
        .catch((err) => console.error('Stock check failed:', err))
        .finally(() => setIsCheckingStock(false));
    }
  }, [items.length, shipmentDetails, paymentDetails, navigate, orderPlaced]);

  if (!shipmentDetails || !paymentDetails) {
    return null;
  }

  const total = getCartTotal();
  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setStockIssues([]);

    try {
      const response = await createGuestOrder({
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        })),
        shipmentDetails: {
          name: shipmentDetails.name,
          email: shipmentDetails.email,
          phone: shipmentDetails.phone,
          address: shipmentDetails.address,
          city: shipmentDetails.city,
          postalCode: shipmentDetails.postalCode,
        },
        payment: {
          type: paymentDetails.type,
          status: 'SUCCESS',
        },
        totalAmount: grandTotal,
      });

      setOrderResponse(response);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      resetCheckout();
    } catch (error: any) {
      if (error?.stockError) {
        toast.error(error.message || 'Some items are out of stock');
        setStockIssues(
          (error.stockErrors || []).map((msg: string) => ({
            productId: '',
            productName: msg,
          }))
        );
      } else {
        console.error('Failed to place order:', error);
        toast.error('Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced && orderResponse) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle2 className="h-24 w-24 mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground text-lg mb-4">
              Thank you for your purchase. Your order has been received.
            </p>
            <p className="text-xl font-semibold mb-8">
              Order ID: <span className="text-primary">{orderResponse.orderNumber}</span>
            </p>
            <Card className="text-left mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer:</p>
                  <p>{orderResponse.customerName}</p>
                  <p className="text-muted-foreground">{orderResponse.customerEmail}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status:</p>
                  <p>{orderResponse.status}</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">${Number(orderResponse.totalAmount).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={async () => {
                try {
                  await fetch(`/api/orders/${orderResponse.orderId}/confirm-email`, { method: 'POST' });
                  toast.success('Confirmation email sent');
                } catch (e) { toast.error('Failed to send confirmation email'); }
              }}>
                Confirm Order (send email)
              </Button>

              <Button size="lg" variant="outline" onClick={async () => {
                try {
                  const res = await fetch(`/api/orders/${orderResponse.orderId}/skip-verify`, { method: 'POST' });
                  if (res.ok) toast.success('Order finalized without email verification');
                  else toast.error('Unable to skip verification');
                } catch (e) { toast.error('Failed to skip verification'); }
              }}>
                Skip Email Confirmation
              </Button>

              <Button size="lg" asChild>
                <Link to="/shop">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Order Confirmation</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CheckoutSteps currentStep={4} />

        <div className="max-w-3xl mx-auto mt-8">
          {/* Stock warnings */}
          {stockIssues.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Stock Availability Issue</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1">
                  {stockIssues.map((issue, i) => (
                    <li key={i} className="text-sm">
                      {issue.availableStock !== undefined
                        ? `${issue.productName}: only ${issue.availableStock} available (you requested ${issue.requestedQuantity})`
                        : issue.productName}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm font-medium">Please update your cart before placing the order.</p>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Review Your Order</CardTitle>
              <CardDescription>Please review your order details before placing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Items ({items.length})</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded bg-muted overflow-hidden">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Size: {item.size} x {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Shipping Information</h3>
                <div className="text-muted-foreground">
                  <p>{shipmentDetails.name}</p>
                  <p>{shipmentDetails.email}</p>
                  <p>{shipmentDetails.phone}</p>
                  <p>{shipmentDetails.address}</p>
                  <p>{shipmentDetails.city}, {shipmentDetails.postalCode}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-muted-foreground capitalize">
                  {paymentDetails.type === 'bkash' ? 'bKash Mobile Payment' : 'Credit/Debit Card'}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
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
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || isCheckingStock || stockIssues.length > 0}
              >
                {isCheckingStock ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking stock...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : stockIssues.length > 0 ? (
                  'Update Cart to Continue'
                ) : (
                  <>
                    Place Order
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
