import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShipmentDTO, ShipmentStatus } from '@/types';
import { fetchOrders, fetchShippingVendors } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, MapPin, Calendar, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';

interface ShipmentDetailsDialogProps {
  shipment: ShipmentDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShipmentDetailsDialog = ({ shipment, isOpen, onClose }: ShipmentDetailsDialogProps) => {
  const { t, language } = useLanguage();

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['shippingVendors'],
    queryFn: fetchShippingVendors,
  });

  if (!shipment) return null;

  const order = orders.find(o => o.id === shipment.orderId);
  const vendor = vendors.find(v => v.id === shipment.vendorId);

  const statusLabels: Record<ShipmentStatus, { en: string; bn: string }> = {
    pending: { en: 'Pending', bn: 'মুলতুবি' },
    picked_up: { en: 'Picked Up', bn: 'পিক আপ' },
    in_transit: { en: 'In Transit', bn: 'ট্রানজিটে' },
    out_for_delivery: { en: 'Out for Delivery', bn: 'ডেলিভারিতে' },
    delivered: { en: 'Delivered', bn: 'ডেলিভার্ড' },
    failed: { en: 'Failed', bn: 'ব্যর্থ' },
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    const label = statusLabels[status][language === 'bn' ? 'bn' : 'en'];
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500 hover:bg-green-600">{label}</Badge>;
      case 'in_transit':
      case 'out_for_delivery':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{label}</Badge>;
      case 'picked_up':
        return <Badge className="bg-cyan-500 hover:bg-cyan-600">{label}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{label}</Badge>;
      default:
        return <Badge variant="secondary">{label}</Badge>;
    }
  };

  const statusTimeline: { status: ShipmentStatus; label: string; date?: string }[] = [
    { status: 'pending', label: language === 'en' ? 'Order Created' : 'অর্ডার তৈরি', date: shipment.createdAt },
    { status: 'picked_up', label: language === 'en' ? 'Picked Up' : 'পিক আপ', date: shipment.shippedAt },
    { status: 'in_transit', label: language === 'en' ? 'In Transit' : 'ট্রানজিটে' },
    { status: 'out_for_delivery', label: language === 'en' ? 'Out for Delivery' : 'ডেলিভারিতে' },
    { status: 'delivered', label: language === 'en' ? 'Delivered' : 'ডেলিভার্ড', date: shipment.deliveredAt },
  ];

  const currentStatusIndex = statusTimeline.findIndex(s => s.status === shipment.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5" />
            {language === 'en' ? 'Shipment Details' : 'শিপমেন্ট বিবরণ'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status & Tracking */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'Tracking Number' : 'ট্র্যাকিং নম্বর'}
              </p>
              <p className="font-mono font-medium">{shipment.trackingNumber}</p>
            </div>
            {getStatusBadge(shipment.status)}
          </div>

          <Separator />

          {/* Order Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              {language === 'en' ? 'Order Information' : 'অর্ডার তথ্য'}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{t('orderId')}</p>
                <p className="font-medium">{shipment.orderId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('total')}</p>
                <p className="font-medium">${order?.totalAmount.toFixed(2) || '-'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('customer')}</p>
              <p className="font-medium">{order?.customerName || '-'}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-sm">{order?.shippingAddress || '-'}</p>
            </div>
          </div>

          <Separator />

          {/* Vendor Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              {language === 'en' ? 'Shipping Vendor' : 'শিপিং ভেন্ডর'}
            </h4>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{vendor?.name || '-'}</p>
                <p className="text-xs text-muted-foreground">{vendor?.code}</p>
              </div>
            </div>
            {vendor?.trackingUrlTemplate && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const url = vendor.trackingUrlTemplate?.replace('{tracking_number}', shipment.trackingNumber);
                  if (url) window.open(url, '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Track on Vendor Website' : 'ভেন্ডর ওয়েবসাইটে ট্র্যাক'}
              </Button>
            )}
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              {language === 'en' ? 'Shipment Timeline' : 'শিপমেন্ট টাইমলাইন'}
            </h4>
            <div className="space-y-3">
              {statusTimeline.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isFailed = shipment.status === 'failed' && index === currentStatusIndex;
                
                return (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className={`mt-0.5 ${isCompleted ? (isFailed ? 'text-destructive' : 'text-primary') : 'text-muted-foreground/30'}`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${isCompleted ? 'font-medium' : 'text-muted-foreground'}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-xs text-primary">(Current)</span>}
                      </p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(step.date).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            {shipment.estimatedDelivery && (
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {language === 'en' ? 'Est. Delivery' : 'আনুমানিক ডেলিভারি'}
                </p>
                <p>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
              </div>
            )}
            {shipment.deliveredAt && (
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {language === 'en' ? 'Delivered' : 'ডেলিভার্ড'}
                </p>
                <p>{new Date(shipment.deliveredAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {shipment.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('notes')}</p>
                <p className="text-sm">{shipment.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentDetailsDialog;
