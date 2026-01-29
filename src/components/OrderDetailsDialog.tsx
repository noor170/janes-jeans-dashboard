import { OrderDTO } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface OrderDetailsDialogProps {
  order: OrderDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailsDialog = ({ order, open, onOpenChange }: OrderDetailsDialogProps) => {
  const { t } = useLanguage();

  if (!order) return null;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Pending':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Processing':
        return 'bg-info/20 text-info border-info/30';
      case 'Shipped':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Delivered':
        return 'bg-success/20 text-success border-success/30';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('orderId')}: {order.id}</span>
            <Badge className={getStatusColor(order.status)}>
              {t(order.status.toLowerCase() as any)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              {t('customer')}
            </h4>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              {t('shippingAddress')}
            </h4>
            <p className="text-sm">{order.shippingAddress}</p>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              {t('items')}
            </h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-2"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('orderDate')}
              </h4>
              <p className="text-sm">{format(new Date(order.orderDate), 'MMM dd, yyyy HH:mm')}</p>
            </div>
            {order.shippedDate && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Shipped</h4>
                <p className="text-sm">
                  {format(new Date(order.shippedDate), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}
            {order.deliveredDate && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Delivered</h4>
                <p className="text-sm">
                  {format(new Date(order.deliveredDate), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">{t('total')}</h4>
            <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
