import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { CustomerDTO } from '@/types';
import { createCustomer, updateCustomer } from '@/lib/api';
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

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(1, 'Phone is required').max(20),
  address: z.string().min(1, 'Address is required').max(500),
  status: z.enum(['active', 'inactive', 'vip']),
  notes: z.string().max(1000).optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormDialogProps {
  customer: CustomerDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomerFormDialog = ({ customer, isOpen, onClose, onSuccess }: CustomerFormDialogProps) => {
  const { t } = useLanguage();
  const isEditMode = !!customer;

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      notes: '',
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
        notes: customer.notes || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        notes: '',
      });
    }
  }, [customer, form]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEditMode && customer) {
        await updateCustomer(customer.id, data);
        toast.success(t('editCustomer') + ' successful');
      } else {
        await createCustomer({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          status: data.status,
          notes: data.notes,
        });
        toast.success(t('addCustomer') + ' successful');
      }
      onSuccess();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? t('editCustomer') : t('addCustomer')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('customerName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
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
              name="phone"
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

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('shippingAddress')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
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
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('notes')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
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

export default CustomerFormDialog;
