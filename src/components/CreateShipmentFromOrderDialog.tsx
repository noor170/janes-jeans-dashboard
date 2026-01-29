import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { OrderDTO, ShipmentStatus } from '@/types';
import { createShipment, fetchShippingVendors, fetchShipmentByOrderId, updateOrderStatus } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Package, Truck } from 'lucide-react';

const shipmentSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  trackingNumber: z.string().min(1, 'Tracking number is required').max(50),
  estimatedDelivery: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

interface CreateShipmentFromOrderDialogProps {
  order: OrderDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSkip: () => void;
}

const CreateShipmentFromOrderDialog = ({ 
  order, 
  isOpen, 
  onClose, 
  onSuccess,
  onSkip 
}: CreateShipmentFromOrderDialogProps) => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: vendors = [] } = useQuery({
    queryKey: ['shippingVendors'],
    queryFn: fetchShippingVendors,
  });

  const activeVendors = vendors.filter(v => v.status === 'active');

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      vendorId: '',
      trackingNumber: '',
      estimatedDelivery: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        vendorId: activeVendors[0]?.id || '',
        trackingNumber: '',
        estimatedDelivery: '',
        notes: '',
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: ShipmentFormData) => {
    if (!order) return;
    
    try {
      // First update order status to Shipped
      await updateOrderStatus(order.id, 'Shipped');
      
      // Then create the shipment
      await createShipment({
        orderId: order.id,
        vendorId: data.vendorId,
        trackingNumber: data.trackingNumber,
        status: 'pending' as ShipmentStatus,
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery).toISOString() : undefined,
        notes: data.notes || undefined,
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      
      toast.success(language === 'en' ? 'Order shipped and shipment created' : 'অর্ডার শিপ এবং শিপমেন্ট তৈরি হয়েছে');
      onSuccess();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleSkip = async () => {
    if (!order) return;
    
    try {
      await updateOrderStatus(order.id, 'Shipped');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(language === 'en' ? 'Order status updated to Shipped' : 'অর্ডার স্ট্যাটাস শিপড হয়েছে');
      onSkip();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {language === 'en' ? 'Create Shipment' : 'শিপমেন্ট তৈরি'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? `Create a shipment for order ${order?.id} with tracking information.`
              : `অর্ডার ${order?.id} এর জন্য ট্র্যাকিং তথ্য সহ শিপমেন্ট তৈরি করুন।`
            }
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="rounded-lg border bg-muted/50 p-3 mb-2">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{order.customerName}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">${order.totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {order.shippingAddress}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="estimatedDelivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Estimated Delivery' : 'আনুমানিক ডেলিভারি'}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Notes' : 'নোট'} ({language === 'en' ? 'Optional' : 'ঐচ্ছিক'})</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} placeholder={language === 'en' ? 'Any special instructions...' : 'বিশেষ নির্দেশনা...'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={handleSkip}>
                {language === 'en' ? 'Skip & Ship Only' : 'শুধু শিপ করুন'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {language === 'en' ? 'Cancel' : 'বাতিল'}
              </Button>
              <Button type="submit" disabled={activeVendors.length === 0}>
                {language === 'en' ? 'Create Shipment' : 'শিপমেন্ট তৈরি'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShipmentFromOrderDialog;
