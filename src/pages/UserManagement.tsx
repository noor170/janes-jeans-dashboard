import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Search, 
  Shield, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Trash2, 
  Key,
  MoreHorizontal,
  Plus,
  RefreshCw
} from 'lucide-react';
import { authApi } from '@/lib/authApi';
import { UserDTO, UserRole } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
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
import { toast } from 'sonner';
import CreateAdminDialog from '@/components/admin/CreateAdminDialog';
import ResetPasswordDialog from '@/components/admin/ResetPasswordDialog';
import EditUserDialog from '@/components/admin/EditUserDialog';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserDTO | null>(null);
  const [editUser, setEditUser] = useState<UserDTO | null>(null);

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => authApi.getAllUsers(),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => authApi.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deactivated successfully');
    },
    onError: () => toast.error('Failed to deactivate user'),
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => authApi.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User activated successfully');
    },
    onError: () => toast.error('Failed to activate user'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
      setDeleteUserId(null);
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => 
      authApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: () => toast.error('Failed to update user role'),
  });

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Super Admin</Badge>;
      case 'ADMIN':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Admin</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          {isSuperAdmin && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Admin
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {users.length} users total • {users.filter(u => u.isActive).length} active
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditUser(user)}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setResetPasswordUser(user)}>
                              <Key className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isSuperAdmin && user.role !== 'SUPER_ADMIN' && (
                              <>
                                {user.role === 'USER' ? (
                                  <DropdownMenuItem 
                                    onClick={() => updateRoleMutation.mutate({ id: user.id, role: 'ADMIN' })}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Promote to Admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => updateRoleMutation.mutate({ id: user.id, role: 'USER' })}
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Demote to User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {user.isActive ? (
                              <DropdownMenuItem 
                                onClick={() => deactivateMutation.mutate(user.id)}
                                disabled={user.id === currentUser?.id}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => activateMutation.mutate(user.id)}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            {isSuperAdmin && user.id !== currentUser?.id && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteUserId(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteUserId && deleteMutation.mutate(deleteUserId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Admin Dialog */}
      <CreateAdminDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog 
        user={resetPasswordUser} 
        onClose={() => setResetPasswordUser(null)} 
      />

      {/* Edit User Dialog */}
      <EditUserDialog 
        user={editUser} 
        onClose={() => setEditUser(null)} 
      />
    </div>
  );
};

export default UserManagement;
