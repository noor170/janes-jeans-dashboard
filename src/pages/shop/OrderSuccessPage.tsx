import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckoutSteps } from '@/components/shop/CheckoutSteps';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { items, shipmentDetails, paymentDetails, getCartTotal, resetCheckout } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Redirect if no items or missing checkout data
  useEffect(() => {
    if (!orderPlaced && (items.length === 0 || !shipmentDetails || !paymentDetails)) {
      navigate('/shop/cart');
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

    // Prepare order payload for Spring Boot backend
    const orderPayload = {
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
        address: `${shipmentDetails.address}, ${shipmentDetails.city} ${shipmentDetails.postalCode}`,
      },
      payment: {
        type: paymentDetails.type,
        status: 'SUCCESS',
      },
      totalAmount: grandTotal,
    };

    try {
      // In production, this would POST to Spring Boot backend
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderPayload),
      // });
      // const data = await response.json();
      
      // Mock API call for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      
      console.log('Order payload:', orderPayload);
      setOrderId(mockOrderId);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      
      // Clear cart after successful order
      resetCheckout();
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
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
              Order ID: <span className="text-primary">{orderId}</span>
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
                  <p className="text-sm font-medium text-muted-foreground">Shipping To:</p>
                  <p>{shipmentDetails.name}</p>
                  <p className="text-muted-foreground">{shipmentDetails.address}</p>
                  <p className="text-muted-foreground">{shipmentDetails.city}, {shipmentDetails.postalCode}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method:</p>
                  <p className="capitalize">{paymentDetails.type === 'bkash' ? 'bKash' : 'Credit Card'}</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid:</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            <p className="text-muted-foreground mb-6">
              A confirmation email has been sent to <strong>{shipmentDetails.email}</strong>
            </p>
            <div className="flex gap-4 justify-center">
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
          <Card>
            <CardHeader>
              <CardTitle>Review Your Order</CardTitle>
              <CardDescription>Please review your order details before placing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
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

              {/* Shipping Info */}
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

              {/* Payment Info */}
              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-muted-foreground capitalize">
                  {paymentDetails.type === 'bkash' ? 'bKash Mobile Payment' : 'Credit/Debit Card'}
                </p>
              </div>

              <Separator />

              {/* Total */}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
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
