import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { CustomerDTO } from '@/types';
import { fetchOrders } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Package } from 'lucide-react';

interface CustomerDetailsDialogProps {
  customer: CustomerDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsDialog = ({ customer, isOpen, onClose }: CustomerDetailsDialogProps) => {
  const { t } = useLanguage();

  const { data: allOrders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    enabled: isOpen && !!customer,
  });

  if (!customer) return null;

  const customerOrders = allOrders.filter(order => order.customerEmail === customer.email);

  const getStatusBadge = (status: CustomerDTO['status']) => {
    switch (status) {
      case 'vip':
        return <Badge className="bg-amber-500 hover:bg-amber-600">VIP</Badge>;
      case 'inactive':
        return <Badge variant="secondary">{t('inactive')}</Badge>;
      default:
        return <Badge variant="default">{t('active')}</Badge>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-500 hover:bg-green-600">{t('delivered')}</Badge>;
      case 'Shipped':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{t('shipped')}</Badge>;
      case 'Processing':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{t('processing')}</Badge>;
      default:
        return <Badge variant="secondary">{t('pending')}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {customer.name}
            {getStatusBadge(customer.status)}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">{t('viewDetails')}</TabsTrigger>
            <TabsTrigger value="orders">{t('orders')} ({customerOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 overflow-auto space-y-4 mt-4">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">{t('contactInfo')}</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{customer.address}</span>
                </div>
              </div>
            </div>

            {/* Order Statistics */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">{t('orderStats')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{customer.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">{t('totalOrders')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">${customer.totalSpent.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">{t('totalSpent')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center gap-3 pt-2 border-t">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('memberSince')}: {new Date(customer.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="space-y-2 pt-2 border-t">
                <h4 className="font-medium text-sm text-muted-foreground">{t('notes')}</h4>
                <p className="text-sm">{customer.notes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="flex-1 overflow-auto mt-4">
            {customerOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">{t('noData')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>{t('orderDate')}:</span>
                        <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('items')}:</span>
                        <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      </div>
                      <div className="flex justify-between font-medium text-foreground">
                        <span>{t('total')}:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    {/* Order Items Preview */}
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">{t('products')}:</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="truncate max-w-[60%]">{item.productName}</span>
                            <span>x{item.quantity} · ${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
