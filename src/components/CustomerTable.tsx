import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Mail, Eye, Edit2, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchCustomers, deleteCustomer } from '@/lib/api';
import { CustomerDTO } from '@/types';
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
import CustomerDetailsDialog from '@/components/CustomerDetailsDialog';
import CustomerFormDialog from '@/components/CustomerFormDialog';

type StatusFilter = 'all' | 'active' | 'inactive' | 'vip';

const CustomerTable = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const { data: customers = [], isLoading, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  // Count customers by status for filter chips
  const statusCounts = {
    all: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    vip: customers.filter(c => c.status === 'vip').length,
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pagination = usePagination(filteredCustomers, { initialPageSize: 10 });

  const handleExport = () => {
    const headers = [
      t('customerName'),
      t('customerEmail'),
      t('phone'),
      t('totalOrders'),
      t('totalSpent'),
      t('memberSince'),
      t('status'),
    ];

    const data = filteredCustomers.map(customer => [
      customer.name,
      customer.email,
      customer.phone,
      customer.totalOrders,
      `$${customer.totalSpent.toFixed(2)}`,
      new Date(customer.createdAt).toLocaleDateString(),
      customer.status,
    ]);

    exportToCsv({
      filename: `customers-${new Date().toISOString().split('T')[0]}`,
      headers,
      data,
    });

    toast.success(t('export') + ' successful');
  };

  const handleViewDetails = (customer: CustomerDTO) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleEdit = (customer: CustomerDTO) => {
    setSelectedCustomer(customer);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (customerId: string) => {
    setCustomerToDelete(customerId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete) {
      await deleteCustomer(customerToDelete);
      toast.success(t('delete') + ' successful');
      refetch();
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">{t('customers')}</h2>
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
            <UserPlus className="h-4 w-4 mr-2" />
            {t('addCustomer')}
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
        <Button
          variant={statusFilter === 'vip' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('vip')}
          className="rounded-full bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
          style={statusFilter !== 'vip' ? { background: 'transparent', color: 'hsl(var(--foreground))' } : {}}
        >
          VIP ({statusCounts.vip})
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('customerName')}</TableHead>
              <TableHead>{t('customerEmail')}</TableHead>
              <TableHead>{t('phone')}</TableHead>
              <TableHead className="text-center">{t('totalOrders')}</TableHead>
              <TableHead className="text-right">{t('totalSpent')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {t('noData')}
                </TableCell>
              </TableRow>
            ) : (
              pagination.paginatedItems.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="text-center">{customer.totalOrders}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${customer.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {t('actions')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t('viewDetails')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(customer)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          {t('editCustomer')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(customer.id)}
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

      {/* Details Dialog */}
      <CustomerDetailsDialog
        customer={selectedCustomer}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Form Dialog */}
      <CustomerFormDialog
        customer={isEditMode ? selectedCustomer : null}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCustomer(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setSelectedCustomer(null);
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

export default CustomerTable;
