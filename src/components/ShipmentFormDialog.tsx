import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShipmentDTO, ShipmentStatus } from '@/types';
import { createShipment, updateShipment, fetchOrders, fetchShippingVendors, fetchShipments } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const shipmentSchema = z.object({
  orderId: z.string().min(1, 'Order is required'),
  vendorId: z.string().min(1, 'Vendor is required'),
  trackingNumber: z.string().min(1, 'Tracking number is required').max(50),
  status: z.enum(['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed']),
  estimatedDelivery: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

interface ShipmentFormDialogProps {
  shipment: ShipmentDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ShipmentFormDialog = ({ shipment, isOpen, onClose, onSuccess }: ShipmentFormDialogProps) => {
  const { t, language } = useLanguage();
  const isEditMode = !!shipment;

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['shippingVendors'],
    queryFn: fetchShippingVendors,
  });

  const { data: existingShipments = [] } = useQuery({
    queryKey: ['shipments'],
    queryFn: fetchShipments,
  });

  // Orders that don't have shipments yet (for new shipment creation)
  const availableOrders = orders.filter(order => {
    if (isEditMode && shipment?.orderId === order.id) return true;
    return !existingShipments.some(s => s.orderId === order.id);
  });

  const activeVendors = vendors.filter(v => v.status === 'active');

  const statusLabels: Record<ShipmentStatus, { en: string; bn: string }> = {
    pending: { en: 'Pending', bn: 'মুলতুবি' },
    picked_up: { en: 'Picked Up', bn: 'পিক আপ' },
    in_transit: { en: 'In Transit', bn: 'ট্রানজিটে' },
    out_for_delivery: { en: 'Out for Delivery', bn: 'ডেলিভারিতে' },
    delivered: { en: 'Delivered', bn: 'ডেলিভার্ড' },
    failed: { en: 'Failed', bn: 'ব্যর্থ' },
  };

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      orderId: '',
      vendorId: '',
      trackingNumber: '',
      status: 'pending',
      estimatedDelivery: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (shipment) {
      form.reset({
        orderId: shipment.orderId,
        vendorId: shipment.vendorId,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery?.split('T')[0] || '',
        notes: shipment.notes || '',
      });
    } else {
      form.reset({
        orderId: '',
        vendorId: '',
        trackingNumber: '',
        status: 'pending',
        estimatedDelivery: '',
        notes: '',
      });
    }
  }, [shipment, form]);

  const onSubmit = async (data: ShipmentFormData) => {
    try {
      const shipmentData = {
        orderId: data.orderId,
        vendorId: data.vendorId,
        trackingNumber: data.trackingNumber,
        status: data.status as ShipmentStatus,
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery).toISOString() : undefined,
        notes: data.notes || undefined,
      };

      if (isEditMode && shipment) {
        await updateShipment(shipment.id, shipmentData);
        toast.success(language === 'en' ? 'Shipment updated' : 'শিপমেন্ট আপডেট হয়েছে');
      } else {
        await createShipment(shipmentData);
        toast.success(language === 'en' ? 'Shipment created' : 'শিপমেন্ট তৈরি হয়েছে');
      }
      onSuccess();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const dialogTitle = isEditMode 
    ? (language === 'en' ? 'Update Shipment' : 'শিপমেন্ট আপডেট')
    : (language === 'en' ? 'Create Shipment' : 'শিপমেন্ট তৈরি');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Order' : 'অর্ডার'}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'en' ? 'Select order' : 'অর্ডার নির্বাচন'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableOrders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.id} - {order.customerName} (${order.totalAmount.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Shipping Vendor' : 'শিপিং ভেন্ডর'}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'en' ? 'Select vendor' : 'ভেন্ডর নির্বাচন'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name} ({vendor.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Tracking Number' : 'ট্র্যাকিং নম্বর'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="PTH123456789" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('status')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.keys(statusLabels) as ShipmentStatus[]).map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusLabels[status][language === 'bn' ? 'bn' : 'en']}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDelivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Est. Delivery' : 'আনুমানিক ডেলিভারি'}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('notes')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentFormDialog;
