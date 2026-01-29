import { useLanguage } from '@/contexts/LanguageContext';
import { CustomerDTO } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign } from 'lucide-react';

interface CustomerDetailsDialogProps {
  customer: CustomerDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsDialog = ({ customer, isOpen, onClose }: CustomerDetailsDialogProps) => {
  const { t } = useLanguage();

  if (!customer) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {customer.name}
            {getStatusBadge(customer.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
