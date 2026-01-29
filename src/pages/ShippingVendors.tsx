import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Plus, Eye, Edit2, Trash2, Globe, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchShippingVendors, deleteShippingVendor } from '@/lib/api';
import { ShippingVendorDTO } from '@/types';
import { exportToCsv } from '@/lib/exportCsv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import TablePagination from '@/components/TablePagination';
import { usePagination } from '@/hooks/usePagination';
import VendorFormDialog from '@/components/VendorFormDialog';

const ShippingVendors = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedVendor, setSelectedVendor] = useState<ShippingVendorDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);

  const { data: vendors = [], isLoading, refetch } = useQuery({
    queryKey: ['shippingVendors'],
    queryFn: fetchShippingVendors,
  });

  const statusCounts = {
    all: vendors.length,
    active: vendors.filter(v => v.status === 'active').length,
    inactive: vendors.filter(v => v.status === 'inactive').length,
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pagination = usePagination(filteredVendors, { initialPageSize: 10 });

  const handleExport = () => {
    const headers = [
      language === 'en' ? 'Vendor Name' : 'ভেন্ডরের নাম',
      language === 'en' ? 'Code' : 'কোড',
      language === 'en' ? 'Email' : 'ইমেইল',
      language === 'en' ? 'Phone' : 'ফোন',
      language === 'en' ? 'Avg Delivery Days' : 'গড় ডেলিভারি দিন',
      t('status'),
    ];

    const data = filteredVendors.map(vendor => [
      vendor.name,
      vendor.code,
      vendor.contactEmail,
      vendor.contactPhone,
      vendor.avgDeliveryDays,
      vendor.status,
    ]);

    exportToCsv({
      filename: `shipping-vendors-${new Date().toISOString().split('T')[0]}`,
      headers,
      data,
    });

    toast.success(t('export') + ' successful');
  };

  const handleEdit = (vendor: ShippingVendorDTO) => {
    setSelectedVendor(vendor);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedVendor(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (vendorId: string) => {
    setVendorToDelete(vendorId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (vendorToDelete) {
      await deleteShippingVendor(vendorToDelete);
      toast.success(t('delete') + ' successful');
      refetch();
    }
    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  const pageTitle = language === 'en' ? 'Shipping Vendors' : 'শিপিং ভেন্ডর';
  const addVendorText = language === 'en' ? 'Add Vendor' : 'ভেন্ডর যোগ করুন';
  const editVendorText = language === 'en' ? 'Edit Vendor' : 'ভেন্ডর সম্পাদনা';

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{pageTitle}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t('export')}
          </Button>
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            {addVendorText}
          </Button>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className="rounded-full"
        >
          {t('all')} ({statusCounts.all})
        </Button>
        <Button
          variant={statusFilter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('active')}
          className="rounded-full"
        >
          {t('active')} ({statusCounts.active})
        </Button>
        <Button
          variant={statusFilter === 'inactive' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('inactive')}
          className="rounded-full"
        >
          {t('inactive')} ({statusCounts.inactive})
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'en' ? 'Vendor' : 'ভেন্ডর'}</TableHead>
              <TableHead>{language === 'en' ? 'Code' : 'কোড'}</TableHead>
              <TableHead>{language === 'en' ? 'Contact' : 'যোগাযোগ'}</TableHead>
              <TableHead className="text-center">{language === 'en' ? 'Avg Days' : 'গড় দিন'}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {t('noData')}
                </TableCell>
              </TableRow>
            ) : (
              pagination.paginatedItems.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{vendor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{vendor.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{vendor.contactEmail}</p>
                      <p className="text-muted-foreground">{vendor.contactPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{vendor.avgDeliveryDays}</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                      {vendor.status === 'active' ? t('active') : t('inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {t('actions')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {vendor.website && (
                          <DropdownMenuItem onClick={() => window.open(vendor.website, '_blank')}>
                            <Globe className="h-4 w-4 mr-2" />
                            {language === 'en' ? 'Visit Website' : 'ওয়েবসাইট'}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEdit(vendor)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          {editVendorText}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(vendor.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        onPageChange={pagination.setCurrentPage}
        onPageSizeChange={pagination.setPageSize}
        goToFirstPage={pagination.goToFirstPage}
        goToLastPage={pagination.goToLastPage}
        goToNextPage={pagination.goToNextPage}
        goToPreviousPage={pagination.goToPreviousPage}
      />

      {/* Form Dialog */}
      <VendorFormDialog
        vendor={isEditMode ? selectedVendor : null}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedVendor(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setSelectedVendor(null);
          refetch();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShippingVendors;
