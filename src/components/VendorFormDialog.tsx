import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShippingVendorDTO } from '@/types';
import { createShippingVendor, updateShippingVendor } from '@/lib/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const vendorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  code: z.string().min(1, 'Code is required').max(20).toUpperCase(),
  contactEmail: z.string().email('Invalid email address').max(255),
  contactPhone: z.string().min(1, 'Phone is required').max(20),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  trackingUrlTemplate: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  avgDeliveryDays: z.coerce.number().min(1).max(30),
});

type VendorFormData = z.infer<typeof vendorSchema>;

interface VendorFormDialogProps {
  vendor: ShippingVendorDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VendorFormDialog = ({ vendor, isOpen, onClose, onSuccess }: VendorFormDialogProps) => {
  const { t, language } = useLanguage();
  const isEditMode = !!vendor;

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      code: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      trackingUrlTemplate: '',
      status: 'active',
      avgDeliveryDays: 3,
    },
  });

  useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor.name,
        code: vendor.code,
        contactEmail: vendor.contactEmail,
        contactPhone: vendor.contactPhone,
        website: vendor.website || '',
        trackingUrlTemplate: vendor.trackingUrlTemplate || '',
        status: vendor.status,
        avgDeliveryDays: vendor.avgDeliveryDays,
      });
    } else {
      form.reset({
        name: '',
        code: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        trackingUrlTemplate: '',
        status: 'active',
        avgDeliveryDays: 3,
      });
    }
  }, [vendor, form]);

  const onSubmit = async (data: VendorFormData) => {
    try {
      const vendorData = {
        name: data.name,
        code: data.code.toUpperCase(),
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        website: data.website || undefined,
        trackingUrlTemplate: data.trackingUrlTemplate || undefined,
        status: data.status,
        avgDeliveryDays: data.avgDeliveryDays,
      };

      if (isEditMode && vendor) {
        await updateShippingVendor(vendor.id, vendorData);
        toast.success(language === 'en' ? 'Vendor updated' : 'ভেন্ডর আপডেট হয়েছে');
      } else {
        await createShippingVendor(vendorData);
        toast.success(language === 'en' ? 'Vendor created' : 'ভেন্ডর তৈরি হয়েছে');
      }
      onSuccess();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const dialogTitle = isEditMode 
    ? (language === 'en' ? 'Edit Vendor' : 'ভেন্ডর সম্পাদনা')
    : (language === 'en' ? 'Add Vendor' : 'ভেন্ডর যোগ করুন');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Vendor Name' : 'ভেন্ডরের নাম'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Pathao" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Code' : 'কোড'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="PATHAO" className="uppercase" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('customerEmail')}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phone')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Website' : 'ওয়েবসাইট'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackingUrlTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Tracking URL Template' : 'ট্র্যাকিং URL টেমপ্লেট'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/track/{tracking_number}" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="avgDeliveryDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Avg Delivery Days' : 'গড় ডেলিভারি দিন'}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={1} max={30} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="active">{t('active')}</SelectItem>
                        <SelectItem value="inactive">{t('inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

export default VendorFormDialog;
